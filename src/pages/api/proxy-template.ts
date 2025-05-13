import { handleProxyRequest } from '@/api/proxy-template';

// API route handler for proxying template requests
export async function GET(request: Request) {
  return handleProxyRequest(request);
}

// Export the handler as the default export
export default { GET };
