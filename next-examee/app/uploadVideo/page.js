"use client";
import React, { useContext, useState } from 'react';
import ContentContext from '../../context/ContentContext';
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";

export default function UploadVideoPage() {
    const context = useContext(ContentContext);
    const { addVideo } = context;
    const router = useRouter();

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
                const response = await addVideo(data);
                if (response.success) {
                    toast.success("Video lecture uploaded successfully!");
                    router.back();
                } else {
                    toast.error(response.message || "Failed to upload video.");
                }
            }
        } catch (error) {
            toast.error("An error occurred during video submission.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-header bg-info py-4">
                            <h2 className="h4 text-white fw-bold mb-0 text-center">
                                <i className="fa-solid fa-circle-play me-2"></i>
                                Upload Video Lecture
                            </h2>
                        </div>
                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleSubmit} className="row g-4">
                                <div className="col-12">
                                    <label className="form-label fw-bold">Video Title <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control form-control-lg"
                                        placeholder="Enter descriptive title for the video"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Video Source URL <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><i className="fa-solid fa-link"></i></span>
                                        <input
                                            type="text"
                                            name="fileUrl"
                                            className="form-control"
                                            placeholder="YouTube ID or direct video link"
                                            required
                                            value={formData.fileUrl}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <p className="text-muted small mt-1 mb-0">For YouTube, just paste the video ID or full URL.</p>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Description</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="4"
                                        placeholder="What is this video lecture about?"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Category</label>
                                    <select
                                        name="category"
                                        className="form-select"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="sciTechnology">Sci - Technology</option>
                                        <option value="commerce">Commerce</option>
                                        <option value="artscivils">Arts & Civils</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Status</label>
                                    <select
                                        name="status"
                                        className="form-select"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="public">Live on Site</option>
                                        <option value="draft">Save to Drafts</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Search Keywords</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        className="form-control"
                                        placeholder="e.g. physics, thermodynamics, lecture-1"
                                        value={formData.tags}
                                        onChange={handleChange}
                                    />
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
                                        <label className="form-check-label fw-bold" htmlFor="isPublic">
                                            Make this video public for all students
                                        </label>
                                    </div>
                                </div>

                                <div className="col-12 d-grid gap-2 d-md-flex justify-content-md-end mt-4 pt-3 border-top">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="btn btn-light px-4 border"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="btn btn-info px-5 fw-bold text-white"
                                    >
                                        {uploading ? 'Uploading...' : 'Publish Video'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
