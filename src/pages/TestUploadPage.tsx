import { useState } from 'react';
import { uploadPdfToR2 } from '../api/upload-proxy';

export default function TestUploadPage() {
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const testUpload = async () => {
        try {
            setIsLoading(true);
            setUploadStatus('Starting test upload...');

            // Create a simple PDF using text encoding
            const pdfContent = '%PDF-1.7\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 68 >>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(BarBabyFitness Test PDF Upload) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000234 00000 n\n0000000302 00000 n\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n421\n%%EOF';

            // Convert string to Uint8Array
            const encoder = new TextEncoder();
            const pdfBytes = encoder.encode(pdfContent);

            setUploadStatus('Created test PDF, uploading...');

            // Use our proxy upload function
            const uploadUrl = await uploadPdfToR2(
                pdfBytes,
                'test',
                'Test User',
                { 'test-metadata': 'true', 'test-time': new Date().toISOString() }
            );

            setUploadStatus('Upload successful!');
            setUrl(uploadUrl);
            console.log('Upload complete, URL:', uploadUrl);
        } catch (error) {
            console.error('Test upload failed:', error);
            setUploadStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">PDF Upload Test</h1>

            <button
                onClick={testUpload}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {isLoading ? 'Uploading...' : 'Test PDF Upload'}
            </button>

            {uploadStatus && (
                <div className="mt-4 p-4 border rounded">
                    <h2 className="font-bold">Status:</h2>
                    <p>{uploadStatus}</p>
                </div>
            )}

            {url && (
                <div className="mt-4">
                    <h2 className="font-bold">Uploaded PDF:</h2>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        View Uploaded PDF
                    </a>
                </div>
            )}
        </div>
    );
}
