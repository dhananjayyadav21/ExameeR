"use client";
import React, { useContext, useState } from 'react';
import ContentContext from '../../context/ContentContext';
import DriveUpload from '../../utils/DriveUpload';
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";

export default function UploadPYQPage() {
    const context = useContext(ContentContext);
    const { addPYQ } = context;
    const router = useRouter();

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
                const response = await addPYQ(data);
                if (response.success) {
                    toast.success("Question paper added successfully!");
                    router.back();
                } else {
                    toast.error(response.message || "Failed to add question paper.");
                }
            }
        } catch (error) {
            toast.error("An error occurred during submission.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-header bg-warning py-4">
                            <h2 className="h4 text-dark fw-bold mb-0 text-center">
                                <i className="fa-solid fa-file-invoice me-2"></i>
                                Upload Previous Year Question
                            </h2>
                        </div>
                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleSubmit} className="row g-4">
                                <div className="col-12">
                                    <label className="form-label fw-bold font-sm">Paper Title <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        placeholder="e.g. UPSC CSE 2023 GS Paper 1"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold font-sm">Examination Year <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        name="year"
                                        className="form-control"
                                        placeholder="YYYY"
                                        required
                                        value={formData.year}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold font-sm">Subject <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        name="subject"
                                        className="form-control"
                                        placeholder="e.g. General Studies, Mathematics"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold font-sm">Target Stream</label>
                                    <select
                                        name="category"
                                        className="form-select"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="sciTechnology">Sci - Tech</option>
                                        <option value="commerce">Commerce</option>
                                        <option value="artscivils">Arts & Civils</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold font-sm">Status</label>
                                    <select
                                        name="status"
                                        className="form-select"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="public">Published</option>
                                        <option value="draft">Draft</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold font-sm">Keywords / Tags</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        className="form-control"
                                        placeholder="Comma-separated tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <div className="p-4 border-dashed rounded-3 bg-light text-center border">
                                        <label className="form-label fw-bold d-block mb-3 font-sm">Question Paper PDF <span className="text-danger">*</span></label>
                                        <input
                                            type="file"
                                            id="pyqUpload"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                            className="d-none"
                                        />
                                        <label htmlFor="pyqUpload" className="btn btn-warning fw-bold mb-2">
                                            <i className="fa-solid fa-file-pdf me-2"></i>
                                            {file ? file.name : 'Choose PDF File'}
                                        </label>
                                        {uploading && (
                                            <div className="mt-2">
                                                <div className="spinner-border spinner-border-sm text-warning" role="status"></div>
                                                <span className="ms-2 small fw-bold">Syncing with Drive...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-check form-switch mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="isPublic"
                                            id="isPublic"
                                            checked={formData.isPublic}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label fw-bold font-sm" htmlFor="isPublic">
                                            Enable public access
                                        </label>
                                    </div>
                                </div>

                                <div className="col-12 d-grid gap-2 d-md-flex justify-content-md-end mt-4 pt-3 border-top">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="btn btn-light px-4"
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading || !fileUrl}
                                        className="btn btn-warning px-5 fw-bold"
                                    >
                                        {uploading ? 'Processing...' : 'Add Paper'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .border-dashed { border-style: dashed !important; border-width: 2px !important; }
                .font-sm { font-size: 0.9rem; }
            `}</style>
        </div>
    );
}
