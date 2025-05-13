/**
 * API endpoint for uploading documents to R2
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Log whether environment variables are available
console.log('R2 environment variables available:', {
  endpoint: !!import.meta.env.VITE_CLOUDFLARE_R2_ENDPOINT,
  accessKey: !!import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY_ID,
  secretKey: !!import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  bucket: !!import.meta.env.VITE_CLOUDFLARE_R2_BUCKET_NAME,
  publicUrl: !!import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_URL
});

/**
 * Handles document upload to Cloudflare R2
 */
export async function uploadDocument(formData: FormData): Promise<{
  success: boolean;
  message: string;
  url?: string;
  error?: string;
}> {
  try {
    const file = formData.get('file') as File | null;
    const fileName = formData.get('fileName') as string | null;
    const type = formData.get('type') as string | null;

    if (!file || !fileName || !type) {
      return { 
        success: false, 
        message: 'Missing required parameters: file, fileName, or type' 
      };
    }

    // Convert file to array buffer and then to Uint8Array
    // AWS SDK expects Uint8Array, Buffer, or string for the Body parameter
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Initialize S3 client for R2
    const r2 = new S3Client({
      region: 'auto',
      endpoint: import.meta.env.VITE_CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY_ID || '',
        secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
      },
    });

    // Generate key based on file type
    const key = `${type}s/${fileName}`;

    // Upload file to R2
    const command = new PutObjectCommand({
      Bucket: import.meta.env.VITE_CLOUDFLARE_R2_BUCKET_NAME || 'barbaby-contracts',
      Key: key,
      Body: uint8Array, // Use Uint8Array instead of ArrayBuffer
      ContentType: file.type || 'application/pdf',
    });

    await r2.send(command);

    // Return success with the URL
    const url = `${import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
    console.log(`Document uploaded successfully to R2: ${key}`);
    
    return {
      success: true,
      message: `Document uploaded successfully to R2`,
      url,
    };
  } catch (error: any) {
    console.error('Error uploading document to R2:', error);
    return {
      success: false,
      message: 'Error uploading document to R2',
      error: error.message,
    };
  }
}

export default {
  uploadDocument
};