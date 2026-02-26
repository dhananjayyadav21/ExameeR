"use client";
import React, { useContext, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ContentContext from '../../context/ContentContext';
import DriveUpload from '../../utils/DriveUpload';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";

const Content = () => {
    const context = useContext(ContentContext);
    const { addPYQ, updatePYQ, dashPYQ } = context;
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    const [formData, setFormData] = useState({
        title: '',
        year: '',
        subject: '',
        category: 'sciTechnology',
        tags: '',
        isPublic: true,
        status: 'public',
    });

    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEditMode && dashPYQ) {
            const pyqToEdit = dashPYQ.find(p => p._id === editId);
            if (pyqToEdit) {
                setFormData({
                    title: pyqToEdit.title || '',
                    year: pyqToEdit.year || '',
                    subject: pyqToEdit.subject || '',
                    category: pyqToEdit.category || 'sciTechnology',
                    tags: pyqToEdit.tags ? pyqToEdit.tags.join(', ') : '',
                    isPublic: pyqToEdit.isPublic !== undefined ? pyqToEdit.isPublic : true,
                    status: pyqToEdit.status || 'public',
                });
                setFileUrl(pyqToEdit.fileUrl || null);
            }
        }
    }, [isEditMode, editId, dashPYQ]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = async (e) => {
        setUploading(true);
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            try {
                const result = await DriveUpload(selectedFile);
                if (result && result.success && result.fileId) {
                    setFileUrl(result.fileId);
                    toast.success("Question paper uploaded to drive successfully!");
                } else {
                    toast.warning("File upload failed, please try again.");
                }
            } catch (ex) {
                toast.error(ex.message);
            }
        }
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        if (!file || file.type !== 'application/pdf') {
            setUploading(false);
            return toast.warning("Please upload a valid PDF question paper.");
        }
        const data = {
            title: formData.title,
            year: formData.year,
            subject: formData.subject,
            category: formData.category,
            tags: formData.tags.split(',').map(tag => tag.trim()),
            isPublic: formData.isPublic,
            status: formData.status,
            fileUrl: fileUrl
        };
        try {
            if (!data.title || !data.year || !data.subject || !data.category || !data.status) {
                toast.warning("All required fields must be filled!");
            } else {
                let response;
                if (isEditMode) {
                    response = await updatePYQ(data, editId);
                } else {
                    if (!fileUrl) return toast.warning("Please upload a file first");
                    response = await addPYQ(data);
                }

                if (response.success) {
                    toast.success(isEditMode ? "Question paper updated successfully!" : "Question paper added successfully!");
                    router.back();
                } else {
                    toast.error(response.message || `Failed to ${isEditMode ? 'update' : 'add'} question paper.`);
                }
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <main className="up-page">
            {/* Page Header */}
            <div className="up-header">
                <div className="up-blob up-blob1"></div>
                <div className="up-blob up-blob2"></div>
                <div className="up-header-content">
                    <div className="up-header-icon" style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}>
                        <i className="fa-solid fa-file-invoice"></i>
                    </div>
                    <div>
                        <h1 className="up-header-title">{isEditMode ? 'Edit' : 'Upload'} Question Paper</h1>
                        <p className="up-header-sub">{isEditMode ? 'Update document details and content' : 'Add previous year question papers for students to practice'}</p>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="up-card">
                            <form onSubmit={handleSubmit} className="row g-4">

                                {/* Title */}
                                <div className="col-12">
                                    <label className="up-label">Paper Title <span className="up-req">*</span></label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-heading"></i></span>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange}
                                            className="up-input" placeholder="e.g. UPSC CSE 2023 GS Paper 1" required />
                                    </div>
                                </div>

                                {/* Year | Subject */}
                                <div className="col-md-6">
                                    <label className="up-label">Examination Year <span className="up-req">*</span></label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-calendar-days"></i></span>
                                        <input type="number" name="year" value={formData.year} onChange={handleChange}
                                            className="up-input" placeholder="YYYY" required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="up-label">Subject <span className="up-req">*</span></label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-book-open"></i></span>
                                        <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                                            className="up-input" placeholder="e.g. General Studies, Mathematics" required />
                                    </div>
                                </div>

                                {/* Category | Status */}
                                <div className="col-md-6">
                                    <label className="up-label">Target Stream</label>
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
                                            <option value="public">Published</option>
                                            <option value="draft">Draft</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="col-12">
                                    <label className="up-label">Keywords / Tags</label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-tags"></i></span>
                                        <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                                            className="up-input" placeholder="Comma-separated: upsc, geography, 2023" />
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div className="col-12">
                                    <label className="up-label">Question Paper PDF {isEditMode ? '(Optional)' : <span className="up-req">*</span>}</label>
                                    <input type="file" id="pyqUpload" accept="application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                                    <label htmlFor="pyqUpload" className={`up-dropzone ${file ? 'up-dropzone--filled' : ''}`} style={file ? { '--dz-accent': '#f59e0b' } : {}}>
                                        {uploading ? (
                                            <><div className="up-spinner" style={{ borderTopColor: '#f59e0b' }}></div><p className="up-dz-text">Uploading to drive...</p></>
                                        ) : file ? (
                                            <><i className="fa-solid fa-file-check" style={{ color: '#f59e0b', fontSize: '1.8rem' }}></i>
                                                <p className="up-dz-text" style={{ color: '#d97706' }}>{file.name}</p>
                                                <p className="up-dz-sub">Click to change file</p></>
                                        ) : (
                                            <><i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '1.8rem', color: '#94a3b8' }}></i>
                                                <p className="up-dz-text">Drop PDF here, or <span style={{ color: '#f59e0b' }}>click to browse</span></p>
                                                <p className="up-dz-sub">Max 10MB · PDF only</p></>
                                        )}
                                    </label>
                                </div>

                                {/* Toggle */}
                                <div className="col-12">
                                    <label className="up-toggle-wrap">
                                        <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} className="up-toggle-input" />
                                        <span className="up-toggle" style={formData.isPublic ? { background: '#f59e0b' } : {}}></span>
                                        <span className="up-toggle-label">Enable public access for all students</span>
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="col-12 d-flex gap-3 justify-content-end mt-2">
                                    <button type="button" onClick={() => router.back()} className="up-cancel-btn">Go Back</button>
                                    <button type="submit" disabled={uploading || (!isEditMode && !fileUrl)} className="up-submit-btn" style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}>
                                        {uploading
                                            ? <><div className="up-btn-spinner me-2"></div>{isEditMode ? 'Updating...' : 'Processing...'}</>
                                            : <><i className={`fa-solid ${isEditMode ? 'fa-pen-to-square' : 'fa-circle-plus'} me-2`}></i>{isEditMode ? 'Update Paper' : 'Add Question Paper'}</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .up-page { min-height: 100vh; background: #f8fafc; }
                .up-header { position: relative; overflow: hidden; background: linear-gradient(135deg,#1a0f00 0%,#2d1a00 60%,#1a0f00 100%); padding: 44px 24px; }
                .up-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.25; pointer-events: none; }
                .up-blob1 { width: 300px; height: 300px; background: #f59e0b; top: -80px; right: -80px; }
                .up-blob2 { width: 250px; height: 250px; background: #f97316; bottom: -60px; left: 60px; }
                .up-header-content { position: relative; z-index: 1; display: flex; align-items: center; gap: 20px; max-width: 780px; margin: 0 auto; }
                .up-header-icon { width: 52px; height: 52px; border-radius: 16px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: white; box-shadow: 0 8px 24px rgba(245,158,11,0.4); }
                .up-header-title { font-size: 1.5rem; font-weight: 800; color: white; margin: 0; letter-spacing: -0.02em; }
                .up-header-sub { color: rgba(255,255,255,0.5); font-size: 0.85rem; margin: 4px 0 0; }
                .up-card { background: white; border-radius: 20px; padding: 36px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); border: 1px solid #f1f5f9; }
                .up-label { font-size: 0.8rem; font-weight: 700; color: #374151; margin-bottom: 7px; display: block; }
                .up-req { color: #ef4444; }
                .up-input-wrap { position: relative; }
                .up-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.82rem; pointer-events: none; }
                .up-input { width: 100%; padding: 11px 14px 11px 38px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 0.9rem; color: #0f172a; background: #f8fafc; transition: all 0.2s; outline: none; font-family: inherit; }
                .up-input:focus { border-color: #f59e0b; background: white; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); }
                .up-select { appearance: none; cursor: pointer; }
                .up-dropzone { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; border: 2px dashed #e2e8f0; border-radius: 14px; padding: 32px 20px; background: #f8fafc; cursor: pointer; text-align: center; transition: all 0.2s; }
                .up-dropzone:hover, .up-dropzone--filled { border-color: #f59e0b; background: rgba(245,158,11,0.03); }
                .up-dz-text { font-size: 0.9rem; font-weight: 500; color: #374151; margin: 4px 0 0; }
                .up-dz-sub { font-size: 0.76rem; color: #94a3b8; margin: 0; }
                .up-toggle-wrap { display: flex; align-items: center; gap: 10px; cursor: pointer; }
                .up-toggle-input { display: none; }
                .up-toggle { width: 42px; height: 24px; background: #e2e8f0; border-radius: 50px; position: relative; transition: background 0.2s; flex-shrink: 0; }
                .up-toggle::after { content: ''; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
                .up-toggle-input:checked ~ .up-toggle { background: #f59e0b; }
                .up-toggle-input:checked ~ .up-toggle::after { transform: translateX(18px); }
                .up-toggle-label { font-size: 0.875rem; font-weight: 600; color: #374151; }
                .up-cancel-btn { padding: 11px 24px; border-radius: 12px; border: 1.5px solid #e2e8f0; background: transparent; color: #64748b; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .up-cancel-btn:hover { border-color: #94a3b8; background: #f8fafc; }
                .up-submit-btn { padding: 11px 28px; border-radius: 12px; border: none; color: white; font-size: 0.92rem; font-weight: 700; display: flex; align-items: center; cursor: pointer; transition: all 0.24s; box-shadow: 0 4px 14px rgba(245,158,11,0.35); }
                .up-submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,158,11,0.5); }
                .up-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .up-spinner { width: 28px; height: 28px; border: 2px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                .up-btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 576px) { .up-card { padding: 24px 16px; } }
            `}</style>
        </main>
    );
};

export default function UploadPYQPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Content />
        </Suspense>
    );
}
