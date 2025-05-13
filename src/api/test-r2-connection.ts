import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';

/**
 * Test connection to Cloudflare R2
 */
export async function testR2Connection(): Promise<{
  success: boolean;
  message: string;
  bucketContents?: any[];
  error?: string;
}> {
  try {
    console.log('Testing R2 connection...');
    
    // Log environment variables (without revealing sensitive info)
    console.log('Environment variables:');
    console.log(`ENDPOINT: ${import.meta.env.VITE_CLOUDFLARE_R2_ENDPOINT ? 'Set' : 'Not set'}`);
    console.log(`ACCESS_KEY_ID: ${import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY_ID ? 'Set' : 'Not set'}`);
    console.log(`SECRET_ACCESS_KEY: ${import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY ? 'Set' : 'Not set'}`);
    console.log(`BUCKET_NAME: ${import.meta.env.VITE_CLOUDFLARE_R2_BUCKET_NAME ? 'Set' : 'Not set'}`);
    console.log(`PUBLIC_URL: ${import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_URL ? 'Set' : 'Not set'}`);

    // Initialize S3 client for R2
    const r2 = new S3Client({
      region: 'auto',
      endpoint: import.meta.env.VITE_CLOUDFLARE_R2_ENDPOINT || '',
      credentials: {
        accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY_ID || '',
        secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
      },
    });

    // List objects in the bucket to test connectivity
    const command = new ListObjectsCommand({
      Bucket: import.meta.env.VITE_CLOUDFLARE_R2_BUCKET_NAME || 'barbaby-contracts',
      MaxKeys: 10,
    });

    const response = await r2.send(command);
    
    return {
      success: true,
      message: 'Successfully connected to Cloudflare R2',
      bucketContents: response.Contents?.map(item => ({
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
      })),
    };
  } catch (error: any) {
    console.error('Error connecting to R2:', error);
    return {
      success: false,
      message: 'Failed to connect to Cloudflare R2',
      error: error.message,
    };
  }
}

/**
 * Test the server-side proxy for R2 template files (to avoid CORS issues)
 */
export async function testServerProxy(): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    console.log('Testing server proxy for R2 templates...');
    
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3002';
    const response = await fetch(`${serverUrl}/upload-contract/check-r2-connection`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      message: `Server proxy working: ${data.message || 'Connection successful'}`,
    };
  } catch (error: any) {
    console.error('Error testing server proxy:', error);
    return {
      success: false,
      message: 'Failed to connect to server proxy',
      error: error.message,
    };
  }
}

export default {
  testR2Connection,
  testServerProxy,
};