// src/pages/WebsiteThumbnails.tsx
import React, { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import type { PageContent } from '../types/aws/content';

export const WebsiteThumbnails = () => {
    const [content, setContent] = useState<PageContent | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tempContent, setTempContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch content on component mount
    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await contentService.getContent('website-thumbnails', '/');

                if (data) {
                    setContent(data);
                    setTempContent(data.content);
                } else {
                    // Create initial content if none exists
                    const initialContent: PageContent = {
                        id: 'website-thumbnails',
                        path: '/',
                        content: 'Welcome to Website Thumbnails',
                        contentType: 'text',
                        version: 1,
                        lastModified: new Date().toISOString()
                    };
                    await contentService.updateContent(initialContent);
                    setContent(initialContent);
                    setTempContent(initialContent.content);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    // Handle edit button click
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Handle save button click
    const handleSave = async () => {
        if (content) {
            try {
                setLoading(true);
                setError(null);
                const updatedContent: PageContent = {
                    ...content,
                    content: tempContent,
                    lastModified: new Date().toISOString(),
                    version: content.version + 1,
                };
                await contentService.updateContent(updatedContent);
                setContent(updatedContent);
                setIsEditing(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle cancel button click
    const handleCancel = () => {
        if (content) {
            setTempContent(content.content);
        }
        setIsEditing(false);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Website Thumbnails</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {error}
                </div>
            )}

            {loading ? (
                <p>Loading content...</p>
            ) : content ? (
                <div>
                    {isEditing ? (
                        <div>
                            <textarea
                                value={tempContent}
                                onChange={(e) => setTempContent(e.target.value)}
                                className="w-full p-2 border rounded"
                                rows={10}
                            />
                            <div className="mt-2 space-x-2">
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div
                                dangerouslySetInnerHTML={{ __html: content.content }}
                                className="prose"
                            />
                            <button
                                onClick={handleEdit}
                                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};