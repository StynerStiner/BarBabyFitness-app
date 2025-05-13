import { useState, useEffect } from 'react';
import { uploadPdfToR2 } from '../api/upload-proxy';

const TestPdfUploader = () => {
    const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadResult, setUploadResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successCount, setSuccessCount] = useState(0);
    const [clientName, setClientName] = useState('Test User');
    const [formType, setFormType] = useState('registration');
    const [generatingPdf, setGeneratingPdf] = useState(false);

    // Create a basic PDF structure for testing
    const generateTestPdf = (): Uint8Array => {
        setGeneratingPdf(true);
        const pdfContent = `%PDF-1.7
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 150 >>
stream
BT
/F1 24 Tf
100 700 Td
(BarBaby Fitness Test PDF) Tj
/F1 16 Tf
100 650 Td
(Client: ${clientName}) Tj
100 620 Td
(Form Type: ${formType}) Tj
100 590 Td
(Generated: ${new Date().toLocaleString()}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000234 00000 n
0000000302 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
691
%%EOF`;

        // Convert string to Uint8Array
        const encoder = new TextEncoder();
        const pdfBytes = encoder.encode(pdfContent);
        setGeneratingPdf(false);
        return pdfBytes;
    };

    const handleGeneratePdf = () => {
        try {
            const pdf = generateTestPdf();
            setPdfData(pdf);
            setError(null);
        } catch (err) {
            setError(`Error generating PDF: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    const handleUpload = async () => {
        if (!pdfData) {
            setError('Please generate a PDF first');
            return;
        }

        setIsLoading(true);
        setError(null);
        setUploadResult(null);

        try {
            // Additional metadata for this upload
            const metadata = {
                'test-upload': 'true',
                'client-name': clientName,
                'form-type': formType,
                'timestamp': new Date().toISOString(),
            };

            // Upload the PDF using our proxy service
            const result = await uploadPdfToR2(
                pdfData,
                formType,
                clientName,
                metadata
            );

            setUploadResult(result);
            setSuccessCount((prev) => prev + 1);
            console.log('PDF uploaded successfully:', result);
        } catch (err) {
            setError(`Error uploading PDF: ${err instanceof Error ? err.message : String(err)}`);
            console.error('Upload failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Generate an initial test PDF
        if (!pdfData) {
            handleGeneratePdf();
        }
    }, []);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">BarBabyFitness PDF Uploader Test</h1>

            <div className="mb-8 p-4 border border-gray-300 rounded-md">
                <h2 className="text-xl font-bold mb-4">Configure Test Upload</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 font-medium">Client Name:</label>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Form Type:</label>
                        <select
                            value={formType}
                            onChange={(e) => setFormType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="registration">Registration Form</option>
                            <option value="trainingAgreement">Training Agreement</option>
                            <option value="liabilityWaiver">Liability Waiver</option>
                            <option value="test">Test Form</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 mb-6">
                <button
                    onClick={handleGeneratePdf}
                    disabled={generatingPdf}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-400"
                >
                    {generatingPdf ? 'Generating...' : 'Generate Test PDF'}
                </button>

                <button
                    onClick={handleUpload}
                    disabled={isLoading || !pdfData}
                    className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-green-400"
                >
                    {isLoading ? 'Uploading...' : 'Upload PDF to R2'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <h3 className="font-bold">Error:</h3>
                    <p>{error}</p>
                </div>
            )}

            {pdfData && (
                <div className="bg-gray-100 border border-gray-300 p-4 rounded mb-4">
                    <h3 className="font-bold">Test PDF Generated:</h3>
                    <p>Size: {pdfData.length} bytes</p>
                    <p>Client: {clientName}</p>
                    <p>Type: {formType}</p>
                    {/* Preview not available since it's generated programmatically */}
                </div>
            )}

            {uploadResult && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <h3 className="font-bold">Upload Successful!</h3>
                    <p>Public URL: <a href={uploadResult} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{uploadResult}</a></p>
                    <p>Total successful uploads: {successCount}</p>
                </div>
            )}

            {/* Debug section */}
            <div className="mt-8 p-4 bg-gray-800 text-gray-200 rounded overflow-auto max-h-64">
                <h3 className="font-bold text-white">Debug Information:</h3>
                <pre className="text-xs">
                    {JSON.stringify({
                        clientName,
                        formType,
                        pdfSize: pdfData?.length || 0,
                        uploadResult,
                        successCount,
                    }, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default TestPdfUploader;
