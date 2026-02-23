"use client";
import React, { useContext, useState } from "react";
import DriveUpload from "../../utils/DriveUpload";
import ContentContext from '../../context/ContentContext';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function UploadCoursePage() {
    const router = useRouter();
    const context = useContext(ContentContext);
    const { addCourse } = context

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        mentor: "",
        courseLevel: "",
        duration: "",
        price: "",
        offerPercent: "",
        offerPrice: "",
        startDate: "",
        courseContents: "",
        whyChoose: "",
        benefits: "",
        courseImage: null,
        trialVideo: "",
        category: 'sciTechnology',
        isPublic: true,
        status: 'public',
        lectures: [
            { title: "", videoUrl: "" },
        ],
    });

    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleLectureChange = (index, field, value) => {
        const updatedLectures = [...formData.lectures];
        updatedLectures[index][field] = value;
        setFormData((prev) => ({
            ...prev,
            lectures: updatedLectures,
        }));
    };

    const addLectureField = () => {
        setFormData((prev) => ({
            ...prev,
            lectures: [...prev.lectures, { title: "", videoUrl: "" }],
        }));
    };

    const removeLectureField = (index) => {
        const updatedLectures = formData.lectures.filter((_, idx) => idx !== index);
        setFormData((prev) => ({
            ...prev,
            lectures: updatedLectures,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await DriveUpload(file);
            if (result?.success && result?.fileId) {
                setFormData((prev) => ({
                    ...prev,
                    courseImage: result.fileId,
                }));
                toast.success("Thumbnail uploaded successfully!");
            } else {
                toast.warning("Failed to upload thumbnail.");
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        const { title, mentor, price, courseImage, trialVideo } = formData;

        if (!title || !mentor || !price || !courseImage || !trialVideo) {
            toast.warning("Please fill all required fields marked with *");
            setUploading(false);
            return;
        }

        try {
            const response = await addCourse(formData);
            if (response.success) {
                toast.success("Course uploaded successfully!");
                router.back();
            } else {
                toast.error(response.message || "Failed to upload course.");
            }
        } catch (err) {
            toast.error("Something went wrong during submission.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-xl-10">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-header bg-dark text-white py-4 px-4">
                            <div className="d-flex align-items-center justify-content-center gap-3">
                                <div className="rounded-circle bg-info p-2 d-inline-flex">
                                    <i className="fa-solid fa-graduation-cap fs-4"></i>
                                </div>
                                <h1 className="h4 fw-bold mb-0">Create New Professional Course</h1>
                            </div>
                        </div>
                        <div className="card-body p-4 p-md-5 bg-light">
                            <form onSubmit={handleSubmit} className="row g-4">
                                {/* Basic Info */}
                                <div className="col-12">
                                    <h5 className="fw-bold text-primary mb-3 border-bottom pb-2">Basic Information</h5>
                                </div>

                                <div className="col-md-8">
                                    <label className="form-label fw-bold">Course Title <span className="text-danger">*</span></label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control form-control-lg" placeholder="e.g. Master React.js from Scratch" required />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="form-select form-select-lg">
                                        <option value="sciTechnology">Sci - Technology</option>
                                        <option value="commerce">Commerce</option>
                                        <option value="artscivils">Arts & Civils</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Mentor/Instructor Name <span className="text-danger">*</span></label>
                                    <input type="text" name="mentor" value={formData.mentor} onChange={handleChange} className="form-control" placeholder="Instructor name" required />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Difficulty Level</label>
                                    <input type="text" name="courseLevel" value={formData.courseLevel} onChange={handleChange} className="form-control" placeholder="Beginner, Intermediate..." />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Duration</label>
                                    <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="form-control" placeholder="e.g. 20 Hours" />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Detailed Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="4" placeholder="Describe what students will learn..."></textarea>
                                </div>

                                {/* Pricing */}
                                <div className="col-12 mt-5">
                                    <h5 className="fw-bold text-primary mb-3 border-bottom pb-2">Pricing & Schedule</h5>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Original Price <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text">₹</span>
                                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" required />
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Offer Percent</label>
                                    <div className="input-group">
                                        <input type="number" name="offerPercent" value={formData.offerPercent} onChange={handleChange} className="form-control" />
                                        <span className="input-group-text">% OFF</span>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Offer Price</label>
                                    <div className="input-group">
                                        <span className="input-group-text">₹</span>
                                        <input type="number" name="offerPrice" value={formData.offerPrice} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Start Date</label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-control" />
                                </div>

                                {/* Media */}
                                <div className="col-12 mt-5">
                                    <h5 className="fw-bold text-primary mb-3 border-bottom pb-2">Course Media</h5>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Thumbnail Image <span className="text-danger">*</span></label>
                                    <div className="p-3 border rounded-3 bg-white text-center">
                                        {formData.courseImage ? (
                                            <div className="mb-2 text-success small fw-bold">
                                                <i className="fa-solid fa-check-circle me-1"></i> Image Uploaded
                                            </div>
                                        ) : null}
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Trial Video (YouTube ID) <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text text-danger"><i className="fa-brands fa-youtube"></i></span>
                                        <input type="text" name="trialVideo" value={formData.trialVideo} onChange={handleChange} className="form-control" placeholder="https://youtube.com/..." required />
                                    </div>
                                </div>

                                {/* Curriculum */}
                                <div className="col-12 mt-5">
                                    <h5 className="fw-bold text-primary mb-3 border-bottom pb-2">Course Curriculum (Lectures)</h5>
                                </div>

                                <div className="col-12">
                                    {formData.lectures.map((lecture, index) => (
                                        <div key={index} className="card border-0 shadow-sm mb-3 position-relative p-4">
                                            <div className="row g-3">
                                                <div className="col-md-5">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Lecture Title (e.g. Introduction)"
                                                        value={lecture.title}
                                                        onChange={(e) => handleLectureChange(index, "title", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <input
                                                        type="url"
                                                        className="form-control"
                                                        placeholder="YouTube Video URL"
                                                        value={lecture.videoUrl}
                                                        onChange={(e) => handleLectureChange(index, "videoUrl", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-1 d-flex align-items-center justify-content-center">
                                                    <button type="button" className="btn btn-outline-danger btn-sm rounded-circle" onClick={() => removeLectureField(index)} title="Remove Lecture">
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-outline-primary btn-sm fw-bold px-4 rounded-pill mt-2" onClick={addLectureField}>
                                        <i className="fa-solid fa-plus me-2"></i> Add Another Lecture
                                    </button>
                                </div>

                                {/* Extra Info */}
                                <div className="col-12 mt-5">
                                    <h5 className="fw-bold text-primary mb-3 border-bottom pb-2">Additional Details</h5>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Why Choose This Course?</label>
                                    <textarea name="whyChoose" value={formData.whyChoose} onChange={handleChange} className="form-control" rows="3" placeholder="Unique selling points..."></textarea>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Student Benefits</label>
                                    <textarea name="benefits" value={formData.benefits} onChange={handleChange} className="form-control" rows="3" placeholder="What value will they get?"></textarea>
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label fw-bold">Detailed Course Contents</label>
                                    <textarea name="courseContents" value={formData.courseContents} onChange={handleChange} className="form-control" rows="3" placeholder="Bullet points of topics covered..."></textarea>
                                </div>

                                {/* Settings */}
                                <div className="col-12 mt-4">
                                    <div className="card bg-info bg-opacity-10 border-info border-opacity-25 p-3">
                                        <div className="row align-items-center">
                                            <div className="col-md-4">
                                                <label className="form-label fw-bold mb-0">Publishing Status</label>
                                                <select name="status" value={formData.status} onChange={handleChange} className="form-select mt-1">
                                                    <option value="public">Live & Searchable</option>
                                                    <option value="draft">Draft (Internal Only)</option>
                                                    <option value="archived">Archived</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-check form-switch mt-4">
                                                    <input className="form-check-input" type="checkbox" name="isPublic" id="isPublic" checked={formData.isPublic} onChange={handleChange} />
                                                    <label className="form-check-label fw-bold" htmlFor="isPublic">Public Enrollment</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 text-md-end">
                                                {uploading && (
                                                    <div className="spinner-border text-info" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 d-grid gap-2 d-md-flex justify-content-md-end mt-5 pt-4 border-top">
                                    <button type="button" onClick={() => router.back()} className="btn btn-link text-secondary text-decoration-none px-4">Discard Changes</button>
                                    <button type="submit" disabled={uploading || !formData.courseImage} className="btn btn-primary px-5 py-3 fw-bold shadow-sm">
                                        {uploading ? "Uploading Course..." : "Create Course Listing"}
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
