/**
 * Proxy API for fetching templates from Cloudflare R2
 * This avoids CORS issues by proxying the request through the server
 */

// Function to fetch a template from Cloudflare R2 using server-side credentials
export const fetchTemplateFromR2 = async (templateName: string): Promise<Response> => {
  try {
    // Validate template name to prevent path traversal attacks
    if (!templateName || templateName.includes('..') || templateName.includes('/')) {
      return new Response('Invalid template name', { status: 400 });
    }

    // Construct the full template path
    const templatePath = `templates/${templateName}`;
    
    // Use environment variables for R2 access
    const r2Endpoint = import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_URL || 
                       'https://pub-a73c1de02759402f8f74a8b93a6f48ea.r2.dev';
    
    // Construct the full URL to the template
    const templateUrl = `${r2Endpoint}/${templatePath}`;
    
    console.log(`Proxy: Fetching template from R2: ${templateUrl}`);
    
    // Fetch the template from R2
    const response = await fetch(templateUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
    if (!response.ok) {
      console.error(`Proxy: Failed to fetch template from R2: ${response.status} ${response.statusText}`);
      return new Response(`Failed to fetch template: ${response.status} ${response.statusText}`, { 
        status: response.status 
      });
    }
    
    // Get the PDF content
    const pdfContent = await response.arrayBuffer();
    
    // Return the PDF with appropriate headers
    return new Response(pdfContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.byteLength.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Proxy: Error fetching template from R2:', error);
    return new Response(`Error fetching template: ${error instanceof Error ? error.message : 'Unknown error'}`, { 
      status: 500 
    });
  }
};

// Handler for the proxy endpoint
export const handleProxyRequest = async (request: Request): Promise<Response> => {
  try {
    // Parse the URL to get the template name
    const url = new URL(request.url);
    const templateName = url.searchParams.get('template');
    
    if (!templateName) {
      return new Response('Missing template parameter', { status: 400 });
    }
    
    // Fetch the template from R2
    return await fetchTemplateFromR2(templateName);
  } catch (error) {
    console.error('Proxy: Error handling proxy request:', error);
    return new Response(`Error handling proxy request: ${error instanceof Error ? error.message : 'Unknown error'}`, { 
      status: 500 
    });
  }
};

// Default export for use in API routes
export default handleProxyRequest;
