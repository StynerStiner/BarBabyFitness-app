import React, { useState } from 'react';
import { testR2Connection } from '../api/test-r2-connection';

export function R2Test() {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const checkConnection = async () => {
        setLoading(true);
        setStatus('Testing connection to Cloudflare R2...');

        try {
            const result = await testR2Connection();

            if (result.success) {
                setStatus(`✅ Connection successful: ${result.message}`);
                console.log('Bucket contents:', result.bucketContents);
            } else {
                setStatus(`❌ Connection failed: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Cloudflare R2 Connection Test</h2>
            <button
                onClick={checkConnection}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? 'Testing...' : 'Test R2 Connection'}
            </button>
            {status && (
                <div className={`mt-4 p-3 rounded ${status.includes('✅') ? 'bg-green-100' : 'bg-red-100'}`}>
                    {status}
                </div>
            )}
        </div>
    );
}