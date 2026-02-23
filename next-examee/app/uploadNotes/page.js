"use client";
import React, { useContext, useState } from 'react';
import ContentContext from '../../context/ContentContext';
import DriveUpload from '../../utils/DriveUpload';
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";

export default function UploadNotesPage() {
    const context = useContext(ContentContext);
    const { addNote } = context
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        professor: '',
        category: 'sciTechnology',
        tags: '',
        isPublic: true,
        status: 'public',
    });

    const [fileUrl, setFileUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

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

        if (!file || file.type !== 'application/pdf') {
            setUploading(false);
            return toast.warning("Please upload a valid PDF file");
        }

        const data = {
            title: formData.title,
            description: formData.description,
            professor: formData.professor,
            category: formData.category,
            tags: formData.tags.split(',').map(tag => tag.trim()),
            isPublic: formData.isPublic,
            status: formData.status,
            fileUrl: fileUrl
        };

        try {
            if (!data.title || !data.professor || !data.category || !data.status) {
                toast.warning("All required fields must be filled!");
            } else {
                const response = await addNote(data);
                if (response.success) {
                    toast.success("Note uploaded successfully!");
                    router.back();
                } else {
                    toast.error(response.message || "Failed to upload note.");
                }
            }
        } catch (error) {
            toast.error("An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-header bg-primary py-4">
                            <h2 className="h4 text-white fw-bold mb-0 text-center">
                                <i className="fa-solid fa-file-pdf me-2"></i>
                                Upload Study Notes
                            </h2>
                        </div>
                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleSubmit} className="row g-4">
                                <div className="col-12">
                                    <label className="form-label fw-bold">Title <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="form-control form-control-lg"
                                        placeholder="Enter the title of the notes"
                                        required
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="3"
                                        placeholder="Briefly describe what these notes cover"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Professor/Author <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        name="professor"
                                        value={formData.professor}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Name of the lecturer"
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Category (Stream)</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="sciTechnology">Sci - Technology</option>
                                        <option value="commerce">Commerce</option>
                                        <option value="artscivils">Arts & Civils</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Tags</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="e.g. physics, unit-1, lecture-notes"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Initial Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="public">Publish Immediately</option>
                                        <option value="draft">Save as Draft</option>
                                        <option value="archived">Archive</option>
                                    </select>
                                </div>

                                <div className="col-12">
                                    <div className="p-4 border-dashed rounded-3 bg-light text-center border">
                                        <label className="form-label fw-bold d-block mb-3">PDF Attachment <span className="text-danger">*</span></label>
                                        <input
                                            type="file"
                                            id="fileUpload"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                            className="d-none"
                                        />
                                        <label htmlFor="fileUpload" className="btn btn-outline-primary mb-2">
                                            <i className="fa-solid fa-cloud-arrow-up me-2"></i>
                                            {file ? file.name : 'Select PDF File'}
                                        </label>
                                        <p className="text-muted small mb-0">Max file size: 10MB. Only PDF documents allowed.</p>
                                    </div>
                                </div>

                                {uploading && (
                                    <div className="col-12 text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2 text-primary fw-bold">Processing upload...</p>
                                    </div>
                                )}

                                <div className="col-12">
                                    <div className="form-check form-switch mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="isPublic"
                                            id="isPublic"
                                            checked={formData.isPublic}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label fw-bold" htmlFor="isPublic">
                                            Visible to all users
                                        </label>
                                    </div>
                                </div>

                                <div className="col-12 d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="btn btn-light px-4 py-2 border"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading || !fileUrl}
                                        className="btn btn-primary px-5 py-2 fw-bold"
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Notes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .border-dashed {
                    border-style: dashed !important;
                    border-width: 2px !important;
                }
            `}</style>
        </div>
    );
}
