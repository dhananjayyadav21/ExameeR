"use client";
import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';

export default function YoutubeUploader({ onUploadSuccess, defaultTitle = "Examee Upload", defaultDescription = "Uploaded via Examee" }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = async () => {
        if (!file) {
            toast.warning("Please select a video file first.");
            return;
        }
        setUploading(true);

        try {
            // 1. Ask backend for the Google Resumable Upload URL natively using backend credentials
            const initRes = await fetch('/api/youtube', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: defaultTitle || file.name,
                    description: defaultDescription,
                    size: file.size,
                    type: file.type || 'video/mp4'
                })
            });

            if (!initRes.ok) {
                const errorData = await initRes.json();
                throw new Error(errorData.error || "Failed to initialize upload");
            }

            const { uploadUrl } = await initRes.json();

            // 2. Upload video file chunks directly to Google URL bypassing Next.js API limits
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', uploadUrl, true);
            xhr.setRequestHeader('Content-Type', file.type || 'video/mp4');

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    setProgress(Math.round((e.loaded / e.total) * 100));
                }
            };

            xhr.onload = () => {
                setUploading(false);
                setProgress(0);
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    const videoId = response.id;
                    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
                    toast.success("Video successfully uploaded directly to your YouTube channel!");
                    if (onUploadSuccess) onUploadSuccess(youtubeUrl, videoId);
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                } else {
                    toast.error(`YouTube upload failed: ${xhr.statusText}`);
                }
            };

            xhr.onerror = () => {
                setUploading(false);
                setProgress(0);
                toast.error("Network Error during upload");
            };

            xhr.send(file);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className="yt-uploader-card">
            <h6 className="yt-uploader-title">
                <i className="fa-brands fa-youtube" style={{ color: '#ef4444', marginRight: '8px' }}></i>
                Upload Directly to YouTube
            </h6>
            <p className="yt-uploader-desc">Select an MP4 file. This will seamlessly upload to your authorized backend YouTube channel.</p>

            <div className="d-flex align-items-center gap-3 yt-uploader-actions">
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="form-control"
                    disabled={uploading}
                    style={{ fontSize: '0.85rem' }}
                />

                <button
                    type="button"
                    onClick={handleUploadClick}
                    className="yt-upload-btn"
                    disabled={uploading || !file}
                >
                    {uploading ? (
                        <><i className="fa-solid fa-spinner fa-spin me-2"></i>Uploading {progress}%</>
                    ) : (
                        <><i className="fa-solid fa-cloud-arrow-up me-2"></i>Upload to YouTube</>
                    )}
                </button>
            </div>

            {uploading && (
                <div className="yt-progress-container mt-3">
                    <div className="yt-progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
            )}

            <style jsx>{`
                .yt-uploader-card {
                    margin-top: 15px;
                    padding: 16px;
                    background: #fdf2f2;
                    border: 1px dashed #fca5a5;
                    border-radius: 12px;
                    position: relative;
                }
                .yt-uploader-title {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: #7f1d1d;
                    margin: 0 0 4px;
                }
                .yt-uploader-desc {
                    font-size: 0.78rem;
                    color: #991b1b;
                    margin: 0 0 12px;
                }
                .yt-upload-btn {
                    padding: 8px 16px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                }
                .yt-upload-btn:hover:not(:disabled) {
                    background: #dc2626;
                }
                .yt-upload-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .yt-progress-container {
                    width: 100%;
                    height: 6px;
                    background: #fecaca;
                    border-radius: 50px;
                    overflow: hidden;
                }
                .yt-progress-bar {
                    height: 100%;
                    background: #ef4444;
                    border-radius: 50px;
                    transition: width 0.3s ease;
                }
                @media (max-width: 576px) {
                    .yt-uploader-actions { flex-direction: column; align-items: stretch !important; }
                }
            `}</style>
        </div>
    );
}
