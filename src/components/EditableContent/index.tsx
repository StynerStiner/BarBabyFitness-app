// src/components/EditableContent/index.tsx
import React, { useState, useEffect } from 'react';
import { contentService } from '../../services/contentService';

interface EditableContentProps {
    contentId: string;
    path: string;
    defaultContent?: string;
}

export const EditableContent: React.FC<EditableContentProps> = ({
    contentId,
    path,
    defaultContent = '',
}) => {
    const [content, setContent] = useState<string>(defaultContent);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await contentService.getContent(contentId, path);
                if (data) {
                    setContent(data.content);
                }
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        fetchContent();
    }, [contentId, path]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await contentService.updateContent({
                id: contentId,
                path,
                content,
                contentType: 'text',
                version: 1,
                lastModified: new Date().toISOString(),
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving content:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative group">
            {isEditing ? (
                <div className="w-full">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                    />
                    <div className="mt-2 space-x-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <div
                        onDoubleClick={() => setIsEditing(true)}
                        className="prose max-w-none cursor-pointer"
                    >
                        {content || defaultContent}
                    </div>
                    <div className="invisible group-hover:visible absolute top-0 right-0 text-xs bg-gray-100 px-2 py-1 rounded-md">
                        Double-click to edit
                    </div>
                </div>
            )}
        </div>
    );
};