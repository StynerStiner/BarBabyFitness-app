// src/components/ContentTest.tsx
import React, { useState } from 'react';
import { contentService } from '../services/contentService';
import type { PageContent } from '../types/aws/content';

export function ContentTest() {
    const [message, setMessage] = useState('');

    const testSave = async () => {
        try {
            const content: PageContent = {
                id: 'test-1',
                path: '/test',
                content: 'Hello from DynamoDB!',
                contentType: 'text',
                version: 1,
                lastModified: new Date().toISOString()
            };

            await contentService.updateContent(content);
            setMessage('Content saved successfully!');
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error saving content');
        }
    };

    const testGet = async () => {
        try {
            const content = await contentService.getContent('test-1', '/test');
            setMessage(content ? `Retrieved: ${content.content}` : 'No content found');
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error getting content');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">DynamoDB Test</h1>
            <div className="space-x-4">
                <button
                    onClick={testSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Save Test Content
                </button>
                <button
                    onClick={testGet}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Get Test Content
                </button>
            </div>
            {message && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    {message}
                </div>
            )}
        </div>
    );
}