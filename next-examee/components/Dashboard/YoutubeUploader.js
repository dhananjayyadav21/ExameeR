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
            <div className="yt-uploader-header">
                <h6 className="yt-uploader-title">
                    <i className="fa-brands fa-youtube" style={{ color: '#ef4444', marginRight: '6px' }}></i>
                    Upload Directly to YouTube
                </h6>
            </div>

            <label className={`yt-dropzone ${file ? 'yt-dropzone-active' : ''}`}>
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="yt-hidden-input"
                    disabled={uploading}
                />

                {file ? (
                    <div className="yt-dz-content">
                        <i className="fa-solid fa-file-video yt-dz-icon" style={{ color: '#22c55e' }}></i>
                        <p className="yt-dz-text">{file.name}</p>
                        <p className="yt-dz-sub">Click to replace file</p>
                    </div>
                ) : (
                    <div className="yt-dz-content">
                        <i className="fa-solid fa-cloud-arrow-up yt-dz-icon"></i>
                        <p className="yt-dz-text">Drop Video here, or <span className="yt-text-green">click to browse</span></p>
                        <p className="yt-dz-sub">MP4 supported</p>
                    </div>
                )}
            </label>

            {file && !uploading && (
                <div className="mt-3 text-end">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            handleUploadClick();
                        }}
                        className="yt-upload-btn"
                    >
                        <i className="fa-solid fa-cloud-arrow-up me-2"></i> Upload Video
                    </button>
                </div>
            )}

            {uploading && (
                <div className="yt-uploading-state mt-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <svg className="yt-spinner" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="#ef4444" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="yt-uploading-text">Uploading to YouTube... {progress}%</span>
                    </div>
                    <div className="yt-progress-container">
                        <div className="yt-progress-bar" style={{ width: `${progress}%` }}>
                            <div className="yt-progress-glow"></div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .yt-uploader-card {
                    margin-top: 15px;
                    margin-bottom: 10px;
                }
                .yt-uploader-header {
                    margin-bottom: 12px;
                }
                .yt-uploader-title {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #374151;
                    margin: 0;
                }
                .yt-hidden-input {
                    display: none;
                }
                .yt-dropzone {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    min-height: 140px;
                    border: 2px dashed #22c55e;
                    border-radius: 16px;
                    background: #f8fafc;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                }
                .yt-dropzone:hover {
                    background: #f0fdf4;
                }
                .yt-dropzone-active {
                    background: #f0fdf4;
                    border-style: solid;
                }
                .yt-dz-content {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    pointer-events: none;
                }
                .yt-dz-icon {
                    font-size: 38px;
                    color: #94a3b8;
                    margin-bottom: 12px;
                }
                .yt-dz-text {
                    font-size: 1.05rem;
                    font-weight: 500;
                    color: #334155;
                    margin: 0 0 6px;
                }
                .yt-text-green {
                    color: #22c55e;
                    font-weight: 600;
                }
                .yt-dz-sub {
                    font-size: 0.85rem;
                    color: #94a3b8;
                    margin: 0;
                }
                .yt-upload-btn {
                    padding: 9px 20px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: inline-flex;
                    align-items: center;
                }
                .yt-upload-btn:hover {
                    background: #dc2626;
                }
                .yt-uploading-text {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #334155;
                }
                .yt-spinner {
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .yt-progress-container {
                    width: 100%;
                    height: 8px;
                    background: #fee2e2;
                    border-radius: 50px;
                    overflow: hidden;
                }
                .yt-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #ef4444, #f87171);
                    border-radius: 50px;
                    transition: width 0.4s ease-out;
                    position: relative;
                }
                .yt-progress-glow {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
                    animation: shine 2s linear infinite;
                }
                @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
