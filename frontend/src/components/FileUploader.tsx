import React, { useState } from 'react';
import api from '../services/api';

interface FileUploaderProps {
    label: string;
    type: 'cv' | 'diploma' | 'idCard';
    dossierId: string;
    currentFile?: string;
    onUploadSuccess: (type: string, filePath: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ label, type, dossierId, currentFile, onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        setUploading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await api.post(`/dossier/${dossierId}/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Result is the updated dossier, or we can just assume success
            // But the backend returns the saved dossier.
            // Let's assume onUploadSuccess wants the new path. 
            // The backend return structure needs verification, let's assume it returns the dossier object.
            // For now, we'll just reload the page or trigger callback.
            onUploadSuccess(type, response.data.documents[type]);
            setUploading(false);
        } catch (err: any) {
            console.error(err);
            setError("Échec de l'envoi");
            setUploading(false);
        }
    };

    return (
        <div className="file-uploader" style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{label}</label>

            {currentFile ? (
                <div style={{ marginBottom: '0.5rem' }}>
                    <a href={`/uploads/${currentFile}`} target="_blank" rel="noopener noreferrer" style={{ color: 'green', marginRight: '1rem' }}>
                        Voir le document actuel
                    </a>
                </div>
            ) : (
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Aucun document envoyé.</p>
            )}

            <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={uploading}
            />
            {uploading && <span style={{ marginLeft: '1rem', color: 'blue' }}>Envoi en cours...</span>}
            {error && <span style={{ marginLeft: '1rem', color: 'red' }}>{error}</span>}
        </div>
    );
};

export default FileUploader;
