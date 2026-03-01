"use client";
import React, { useContext, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ContentContext from '../../../context/ContentContext';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import YoutubeUploader from '../../../components/dashboard/YoutubeUploader';
import PageLoader from "../../../components/PageLoader";

const Content = () => {
    const context = useContext(ContentContext);
    const { addVideo, updateVideo, dasVideo } = context;
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'sciTechnology',
        tags: '',
        fileUrl: '',
        isPublic: true,
        status: 'public',
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEditMode && dasVideo) {
            const videoToEdit = dasVideo.find(v => v._id === editId);
            if (videoToEdit) {
                setFormData({
                    title: videoToEdit.title || '',
                    description: videoToEdit.description || '',
                    category: videoToEdit.category || 'sciTechnology',
                    tags: videoToEdit.tags ? videoToEdit.tags.join(', ') : '',
                    fileUrl: videoToEdit.fileUrl || '',
                    isPublic: videoToEdit.isPublic !== undefined ? videoToEdit.isPublic : true,
                    status: videoToEdit.status || 'public',
                });
            }
        }
    }, [isEditMode, editId, dasVideo]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        const data = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            tags: formData.tags.split(',').map(tag => tag.trim()),
            isPublic: formData.isPublic,
            status: formData.status,
            fileUrl: formData.fileUrl
        };
        try {
            if (!data.fileUrl) {
                toast.warning("Please provide a valid video URL.");
            } else if (!data.title || !data.category || !data.status) {
                toast.warning("Title and Category are required!");
            } else {
                let response;
                if (isEditMode) {
                    response = await updateVideo(data, editId);
                } else {
                    response = await addVideo(data);
                }

                if (response.success) {
                    toast.success(isEditMode ? "Video lecture updated successfully!" : "Video lecture uploaded successfully!");
                    router.back();
                } else {
                    toast.error(response.message || `Failed to ${isEditMode ? 'update' : 'upload'} video.`);
                }
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setUploading(false);
        }
    };

    // Simple YouTube ID extractor
    const extractYoutubeId = (url) => {
        const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    };
    const previewId = formData.fileUrl ? extractYoutubeId(formData.fileUrl) : null;

    return (
        <main className="up-page">
            {/* Page Header */}
            <div className="up-header">
                <div className="up-blob up-blob1"></div>
                <div className="up-blob up-blob2"></div>
                <div className="up-header-content">
                    <div className="up-header-icon" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                        <i className="fa-solid fa-circle-play"></i>
                    </div>
                    <div>
                        <h1 className="up-header-title">{isEditMode ? 'Edit' : 'Upload'} Video Lecture</h1>
                        <p className="up-header-sub">{isEditMode ? 'Update video details and link' : 'Publish a video lesson with a YouTube URL or embed link'}</p>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <div className="up-card">
                            <form onSubmit={handleSubmit} className="row g-4">

                                {/* Title */}
                                <div className="col-12">
                                    <label className="up-label">Video Title <span className="up-req">*</span></label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-heading"></i></span>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange}
                                            className="up-input" placeholder="Enter a descriptive title for the video" required />
                                    </div>
                                </div>

                                {/* Video URL */}
                                <div className="col-12">
                                    <label className="up-label">Video Source URL <span className="up-req">*</span></label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-brands fa-youtube" style={{ color: '#ef4444' }}></i></span>
                                        <input type="text" name="fileUrl" value={formData.fileUrl} onChange={handleChange}
                                            className="up-input" placeholder="https://www.youtube.com/watch?v=... or YouTube Video ID" required />
                                    </div>
                                    <p className="up-hint">Paste the full YouTube URL or just the video ID (11 characters)</p>
                                    <YoutubeUploader
                                        defaultTitle={formData.title}
                                        defaultDescription={formData.description}
                                        onUploadSuccess={(url) => setFormData(prev => ({ ...prev, fileUrl: url }))}
                                    />
                                </div>

                                {/* YouTube Preview */}
                                {previewId && (
                                    <div className="col-12">
                                        <div className="up-preview">
                                            <div className="up-preview-header">
                                                <i className="fa-brands fa-youtube" style={{ color: '#ef4444' }}></i>
                                                <span>Video Preview</span>
                                                <span className="up-preview-badge">Live</span>
                                            </div>
                                            <div className="up-preview-embed">
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${previewId}`}
                                                    title="Video Preview"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    style={{ border: 'none', width: '100%', height: '100%' }}
                                                ></iframe>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                <div className="col-12">
                                    <label className="up-label">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange}
                                        className="up-input up-textarea" rows="3"
                                        placeholder="What is this video lecture about? Topics covered, prerequisites..." style={{ paddingLeft: '14px' }} />
                                </div>

                                {/* Category | Status */}
                                <div className="col-md-6">
                                    <label className="up-label">Category</label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-layer-group"></i></span>
                                        <select name="category" value={formData.category} onChange={handleChange} className="up-input up-select">
                                            <option value="sciTechnology">Sci - Technology</option>
                                            <option value="commerce">Commerce</option>
                                            <option value="artscivils">Arts &amp; Civils</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="up-label">Status</label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-circle-dot"></i></span>
                                        <select name="status" value={formData.status} onChange={handleChange} className="up-input up-select">
                                            <option value="public">Live on Site</option>
                                            <option value="draft">Save to Drafts</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="col-12">
                                    <label className="up-label">Search Keywords</label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-tags"></i></span>
                                        <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                                            className="up-input" placeholder="e.g. physics, thermodynamics, lecture-1" />
                                    </div>
                                </div>

                                {/* Toggle */}
                                <div className="col-12">
                                    <label className="up-toggle-wrap">
                                        <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} className="up-toggle-input" />
                                        <span className="up-toggle"></span>
                                        <span className="up-toggle-label">Make this video public for all students</span>
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="col-12 d-flex gap-3 justify-content-end mt-2">
                                    <button type="button" onClick={() => router.back()} className="up-cancel-btn">Cancel</button>
                                    <button type="submit" disabled={uploading} className="up-submit-btn">
                                        {uploading
                                            ? <><div className="up-btn-spinner me-2"></div>{isEditMode ? 'Updating...' : 'Publishing...'}</>
                                            : <><i className={`fa-solid ${isEditMode ? 'fa-pen-to-square' : 'fa-circle-play'} me-2`}></i>{isEditMode ? 'Update Video' : 'Publish Video'}</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .up-page { min-height: 100vh; background: #f8fafc; }
                .up-header { position: relative; overflow: hidden; background: linear-gradient(135deg,#0f0a2e 0%,#1a1040 60%,#0f0a2e 100%); padding: 44px 24px; }
                .up-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.25; pointer-events: none; }
                .up-blob1 { width: 300px; height: 300px; background: #6366f1; top: -80px; right: -80px; }
                .up-blob2 { width: 250px; height: 250px; background: #8b5cf6; bottom: -60px; left: 60px; }
                .up-header-content { position: relative; z-index: 1; display: flex; align-items: center; gap: 20px; max-width: 860px; margin: 0 auto; }
                .up-header-icon { width: 52px; height: 52px; border-radius: 16px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: white; box-shadow: 0 8px 24px rgba(99,102,241,0.45); }
                .up-header-title { font-size: 1.5rem; font-weight: 800; color: white; margin: 0; letter-spacing: -0.02em; }
                .up-header-sub { color: rgba(255,255,255,0.5); font-size: 0.85rem; margin: 4px 0 0; }
                .up-card { background: white; border-radius: 20px; padding: 36px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); border: 1px solid #f1f5f9; }
                .up-label { font-size: 0.8rem; font-weight: 700; color: #374151; margin-bottom: 7px; display: block; }
                .up-req { color: #ef4444; }
                .up-input-wrap { position: relative; }
                .up-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.82rem; pointer-events: none; }
                .up-input { width: 100%; padding: 11px 14px 11px 38px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 0.9rem; color: #0f172a; background: #f8fafc; transition: all 0.2s; outline: none; font-family: inherit; }
                .up-input:focus { border-color: #6366f1; background: white; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
                .up-textarea { padding: 11px 14px !important; resize: vertical; min-height: 90px; }
                .up-select { appearance: none; cursor: pointer; }
                .up-hint { font-size: 0.75rem; color: #94a3b8; margin: 6px 0 0; }

                /* Preview */
                .up-preview { border: 1.5px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
                .up-preview-header { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: #f8fafc; border-bottom: 1px solid #f1f5f9; font-size: 0.82rem; font-weight: 600; color: #374151; }
                .up-preview-badge { margin-left: auto; background: rgba(239,68,68,0.1); color: #ef4444; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 50px; }
                .up-preview-embed { position: relative; padding-bottom: 50%; height: 0; }
                .up-preview-embed iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }

                /* Toggle */
                .up-toggle-wrap { display: flex; align-items: center; gap: 10px; cursor: pointer; }
                .up-toggle-input { display: none; }
                .up-toggle { width: 42px; height: 24px; background: #e2e8f0; border-radius: 50px; position: relative; transition: background 0.2s; flex-shrink: 0; }
                .up-toggle::after { content: ''; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
                .up-toggle-input:checked ~ .up-toggle { background: #6366f1; }
                .up-toggle-input:checked ~ .up-toggle::after { transform: translateX(18px); }
                .up-toggle-label { font-size: 0.875rem; font-weight: 600; color: #374151; }

                /* Buttons */
                .up-cancel-btn { padding: 11px 24px; border-radius: 12px; border: 1.5px solid #e2e8f0; background: transparent; color: #64748b; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .up-cancel-btn:hover { border-color: #94a3b8; background: #f8fafc; }
                .up-submit-btn { padding: 11px 28px; border-radius: 12px; border: none; background: linear-gradient(135deg,#6366f1,#8b5cf6); color: white; font-size: 0.92rem; font-weight: 700; display: flex; align-items: center; cursor: pointer; transition: all 0.24s; box-shadow: 0 4px 14px rgba(99,102,241,0.35); }
                .up-submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.5); }
                .up-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .up-btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 576px) { .up-card { padding: 24px 16px; } }
            `}</style>
        </main>
    );
};

export default function UploadVideoPage() {
    return (
        <Suspense fallback={<PageLoader text="Loading editor..." subtext="Preparing video upload interface" />}>
            <Content />
        </Suspense>
    );
}
