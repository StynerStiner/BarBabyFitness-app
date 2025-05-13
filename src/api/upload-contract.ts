// API route handler for contract uploads
// This proxies the request to our server-side three-tier storage system
import axios from 'axios';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed' }), 
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Forward the request to our server's upload-contract endpoint
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3002';
    const formData = await req.formData();
    
    const response = await axios.post(
      `${serverUrl}/upload-contract`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Make sure binary data is properly transferred
        responseType: 'arraybuffer',
      }
    );

    // Parse the response
    const data = JSON.parse(response.data.toString());
    
    // Return the server's response to the client
    return new Response(
      JSON.stringify(data),
      { 
        status: response.status, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Error in upload-contract API route:', error);
    
    // Handle server connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Unable to connect to storage server. Please try again later.',
          error: error.message,
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Return other errors
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error uploading contract',
        error: error.message,
      }),
      { 
        status: error.response?.status || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}