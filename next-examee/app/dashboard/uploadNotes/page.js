"use client";
import React, { useContext, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ContentContext from '../../../context/ContentContext';
import DriveUpload from '../../../utils/DriveUpload';
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";
import { academicOptions } from '../../../constants/academicOptions';

const Content = () => {
    const context = useContext(ContentContext);
    const { addNote, updateNotes, getNoteById, dashNotes } = context;
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        professor: '',
        category: 'sciTechnology',
        course: '',
        semester: '',
        university: '',
        tags: '',
        isPublic: true,
        status: 'public',
        accessTier: 'free',   // 'free' | 'plus' | 'pro'
    });

    const [fileUrl, setFileUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            if (isEditMode) {
                let noteToEdit = dashNotes.find(n => n._id === editId);

                if (!noteToEdit) {
                    const response = await getNoteById(editId);
                    if (response && response.success) {
                        noteToEdit = response.data;
                    }
                }

                if (noteToEdit) {
                    setFormData({
                        title: noteToEdit.title || '',
                        description: noteToEdit.description || '',
                        professor: noteToEdit.professor || '',
                        category: noteToEdit.category || 'sciTechnology',
                        course: noteToEdit.course || '',
                        semester: noteToEdit.semester || '',
                        university: noteToEdit.university || '',
                        tags: noteToEdit.tags ? (Array.isArray(noteToEdit.tags) ? noteToEdit.tags.join(', ') : noteToEdit.tags) : '',
                        isPublic: noteToEdit.isPublic !== undefined ? noteToEdit.isPublic : true,
                        status: noteToEdit.status || 'public',
                        accessTier: noteToEdit.accessTier || 'free',
                    });
                    setFileUrl(noteToEdit.fileUrl || null);
                }
            }
        };
        fetchNote();
    }, [isEditMode, editId, dashNotes, getNoteById]);

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
                    toast.success("File uploaded to drive successfully!");
                } else {
                    toast.warning("File upload failed, please re-upload.");
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

        if (!isEditMode && (!file || file.type !== 'application/pdf')) {
            setUploading(false);
            return toast.warning("Please upload a valid PDF file");
        }

        if (file && file.type !== 'application/pdf') {
            setUploading(false);
            return toast.warning("The uploaded file must be a PDF");
        }

        const data = {
            title: formData.title,
            description: formData.description,
            professor: formData.professor,
            category: formData.category,
            course: formData.course,
            semester: formData.semester,
            university: formData.university,
            tags: formData.tags.split(',').map(tag => tag.trim()),
            isPublic: formData.isPublic,
            status: formData.status,
            accessTier: formData.accessTier,
            fileUrl: fileUrl
        };

        try {
            if (!data.title || !data.professor || !data.category || !data.status) {
                toast.warning("All required fields must be filled!");
            } else {
                let response;
                if (isEditMode) {
                    response = await updateNotes(data, editId);
                } else {
                    if (!fileUrl) return toast.warning("Please upload a file first");
                    response = await addNote(data);
                }

                if (response.success) {
                    toast.success(isEditMode ? "Note updated successfully!" : "Note uploaded successfully!");
                    router.back();
                } else {
                    toast.error(response.message || `Failed to ${isEditMode ? 'update' : 'upload'} note.`);
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
                <div className="up-header-blob up-blob1"></div>
                <div className="up-header-blob up-blob2"></div>
                <div className="up-header-content">
                    <div className="up-header-icon" style={{ background: 'linear-gradient(135deg,#04bd20,#06d6a0)' }}>
                        <i className="fa-solid fa-file-pdf"></i>
                    </div>
                    <div>
                        <h1 className="up-header-title">{isEditMode ? 'Edit' : 'Upload'} Study Notes</h1>
                        <p className="up-header-sub">{isEditMode ? 'Update document details and content' : 'Share PDF notes with students across the platform'}</p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="up-card">
                            <form onSubmit={handleSubmit} className="row g-4">
                                <div className="col-12">
                                    <label className="up-label">Notes Title <span className="up-req">*</span></label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-heading"></i></span>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange}
                                            className="up-input" placeholder="Enter the title of the notes" required />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="up-label">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange}
                                        className="up-input up-textarea" rows="3" placeholder="Briefly describe what these notes cover" style={{ paddingLeft: '14px' }} />
                                </div>

                                <div className="col-md-6">
                                    <label className="up-label">Professor / Author <span className="up-req">*</span></label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-chalkboard-user"></i></span>
                                        <input type="text" name="professor" value={formData.professor} onChange={handleChange}
                                            className="up-input" placeholder="Lecturer name" required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="up-label">Category / Stream</label>
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
                                    <label className="up-label">Course / Program</label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-graduation-cap"></i></span>
                                        <select name="course" value={formData.course} onChange={handleChange} className="up-input up-select">
                                            <option value="">Select Course</option>
                                            {academicOptions.courses.map(course => (
                                                <option key={course.value} value={course.value}>{course.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="up-label">Semester / Year</label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-clock-rotate-left"></i></span>
                                        <select name="semester" value={formData.semester} onChange={handleChange} className="up-input up-select">
                                            <option value="">Select Semester</option>
                                            {academicOptions.semesters.map(semester => (
                                                <option key={semester.value} value={semester.value}>{semester.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="up-label">University / Board</label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-building-columns"></i></span>
                                        <select name="university" value={formData.university} onChange={handleChange} className="up-input up-select">
                                            <option value="">Select University</option>
                                            {academicOptions.universities.map(university => (
                                                <option key={university.value} value={university.value}>{university.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="up-label">Tags</label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-tags"></i></span>
                                        <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                                            className="up-input" placeholder="e.g. physics, unit-1, lecture-notes" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="up-label">Status</label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-circle-dot"></i></span>
                                        <select name="status" value={formData.status} onChange={handleChange} className="up-input up-select">
                                            <option value="public">Publish Immediately</option>
                                            <option value="draft">Save as Draft</option>
                                            <option value="archived">Archive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="up-label">Access Tier <span style={{ fontSize: '0.7rem', fontWeight: 500, color: '#94a3b8' }}>— who can view this?</span></label>
                                    <div className="up-input-wrap">
                                        <span className="up-input-icon"><i className="fa-solid fa-crown"></i></span>
                                        <select name="accessTier" value={formData.accessTier} onChange={handleChange} className="up-input up-select">
                                            <option value="free">🟢 E0 Free — visible to all</option>
                                            <option value="plus">🟣 Plus — Plus &amp; Pro users</option>
                                            <option value="pro">🟡 Pro — Pro users only</option>
                                        </select>
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div className="col-12">
                                    <label className="up-label">PDF Attachment {isEditMode ? '(Optional)' : <span className="up-req">*</span>}</label>
                                    <input type="file" id="fileUpload" accept="application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                                    <label htmlFor="fileUpload" className={`up-dropzone ${file ? 'up-dropzone--filled' : ''}`}>
                                        {uploading ? (
                                            <><div className="up-spinner"></div><p className="up-dz-text">Uploading to drive...</p></>
                                        ) : file ? (
                                            <><i className="fa-solid fa-file-check" style={{ color: '#04bd20', fontSize: '1.8rem' }}></i>
                                                <p className="up-dz-text" style={{ color: '#04bd20' }}>{file.name}</p>
                                                <p className="up-dz-sub">Click to change file</p></>
                                        ) : (
                                            <><i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '1.8rem', color: '#94a3b8' }}></i>
                                                <p className="up-dz-text">Drop PDF here, or <span style={{ color: '#04bd20' }}>click to browse</span></p>
                                                <p className="up-dz-sub">Max 10MB · PDF only</p></>
                                        )}
                                    </label>
                                </div>

                                <div className="col-12">
                                    <label className="up-toggle-wrap">
                                        <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} className="up-toggle-input" />
                                        <span className="up-toggle"></span>
                                        <span className="up-toggle-label">Visible to all users</span>
                                    </label>
                                </div>

                                <div className="col-12 d-flex gap-3 justify-content-end mt-2">
                                    <button type="button" onClick={() => router.back()} className="up-cancel-btn">Cancel</button>
                                    <button type="submit" disabled={uploading || (!isEditMode && !fileUrl)} className="up-submit-btn">
                                        {uploading
                                            ? <><div className="up-btn-spinner me-2"></div>{isEditMode ? 'Updating...' : 'Uploading...'}</>
                                            : <><i className={`fa-solid ${isEditMode ? 'fa-pen-to-square' : 'fa-cloud-arrow-up'} me-2`}></i>{isEditMode ? 'Update Notes' : 'Upload Notes'}</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .up-page { min-height: 100vh; background: #f8fafc; }
                .up-header { position: relative; overflow: hidden; background: linear-gradient(135deg,#0a1628 0%,#0d3320 60%,#0a1628 100%); padding: 44px 24px; }
                .up-header-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.2; pointer-events: none; }
                .up-blob1 { width: 300px; height: 300px; background: #04bd20; top: -80px; right: -80px; }
                .up-blob2 { width: 250px; height: 250px; background: #06d6a0; bottom: -60px; left: 60px; }
                .up-header-content { position: relative; z-index: 1; display: flex; align-items: center; gap: 20px; max-width: 780px; margin: 0 auto; }
                .up-header-icon { width: 52px; height: 52px; border-radius: 16px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: white; box-shadow: 0 8px 24px rgba(4,189,32,0.35); }
                .up-header-title { font-size: 1.5rem; font-weight: 800; color: white; margin: 0; letter-spacing: -0.02em; }
                .up-header-sub { color: rgba(255,255,255,0.5); font-size: 0.85rem; margin: 4px 0 0; }
                .up-card { background: white; border-radius: 20px; padding: 36px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); border: 1px solid #f1f5f9; }
                .up-label { font-size: 0.8rem; font-weight: 700; color: #374151; margin-bottom: 7px; display: block; }
                .up-req { color: #ef4444; }
                .up-input-wrap { position: relative; }
                .up-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.82rem; pointer-events: none; }
                .up-input { width: 100%; padding: 11px 14px 11px 38px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 0.9rem; color: #0f172a; background: #f8fafc; transition: all 0.2s; outline: none; font-family: inherit; }
                .up-input:focus { border-color: #04bd20; background: white; box-shadow: 0 0 0 3px rgba(4,189,32,0.1); }
                .up-textarea { padding: 11px 14px !important; resize: vertical; min-height: 90px; }
                .up-select { appearance: none; cursor: pointer; }
                .up-dropzone { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; border: 2px dashed #e2e8f0; border-radius: 14px; padding: 32px 20px; background: #f8fafc; cursor: pointer; text-align: center; transition: all 0.2s; }
                .up-dropzone:hover, .up-dropzone--filled { border-color: #04bd20; background: rgba(4,189,32,0.03); }
                .up-dz-text { font-size: 0.9rem; font-weight: 500; color: #374151; margin: 4px 0 0; }
                .up-dz-sub { font-size: 0.76rem; color: #94a3b8; margin: 0; }
                .up-toggle-wrap { display: flex; align-items: center; gap: 10px; cursor: pointer; }
                .up-toggle-input { display: none; }
                .up-toggle { width: 42px; height: 24px; background: #e2e8f0; border-radius: 50px; position: relative; transition: background 0.2s; flex-shrink: 0; }
                .up-toggle::after { content: ''; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: transform 0.2s; }
                .up-toggle-input:checked ~ .up-toggle { background: #04bd20; }
                .up-toggle-input:checked ~ .up-toggle::after { transform: translateX(18px); }
                .up-toggle-label { font-size: 0.875rem; font-weight: 600; color: #374151; }
                .up-cancel-btn { padding: 11px 24px; border-radius: 12px; border: 1.5px solid #e2e8f0; background: transparent; color: #64748b; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .up-cancel-btn:hover { border-color: #94a3b8; background: #f8fafc; }
                .up-submit-btn { padding: 11px 32px; border-radius: 12px; border: none; background: linear-gradient(135deg,#04bd20,#03a61c); color: white; font-size: 0.92rem; font-weight: 700; display: flex; align-items: center; cursor: pointer; transition: all 0.24s; box-shadow: 0 4px 14px rgba(4,189,32,0.35); }
                .up-submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(4,189,32,0.45); }
                .up-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .up-spinner { width: 28px; height: 28px; border: 2px solid rgba(4,189,32,0.2); border-top-color: #04bd20; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                .up-btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 576px) { .up-card { padding: 24px 16px; } }
            `}</style>
        </main>
    );
};

export default function UploadNotesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Content />
        </Suspense>
    );
}


