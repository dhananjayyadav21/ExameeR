"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import DriveUpload from "../../../utils/DriveUpload";
import ContentContext from '../../../context/ContentContext';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Content = () => {
    const router = useRouter();
    const context = useContext(ContentContext);
    const { addCourse, updateCourse, dasCourse } = context;
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

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

    useEffect(() => {
        if (isEditMode && dasCourse) {
            const courseToEdit = dasCourse.find(c => c._id === editId);
            if (courseToEdit) {
                setFormData({
                    title: courseToEdit.title || "",
                    description: courseToEdit.description || "",
                    mentor: courseToEdit.mentor || "",
                    courseLevel: courseToEdit.courseLevel || "",
                    duration: courseToEdit.duration || "",
                    price: courseToEdit.price || "",
                    offerPercent: courseToEdit.offerPercent || "",
                    offerPrice: courseToEdit.offerPrice || "",
                    startDate: courseToEdit.startDate ? courseToEdit.startDate.slice(0, 10) : "",
                    courseContents: courseToEdit.courseContents || "",
                    whyChoose: courseToEdit.whyChoose || "",
                    benefits: courseToEdit.benefits || "",
                    courseImage: courseToEdit.courseImage || null,
                    trialVideo: courseToEdit.trialVideo || "",
                    category: courseToEdit.category || 'sciTechnology',
                    isPublic: courseToEdit.isPublic !== undefined ? courseToEdit.isPublic : true,
                    status: courseToEdit.status || 'public',
                    lectures: courseToEdit.lectures || [{ title: "", videoUrl: "" }],
                });
            }
        }
    }, [isEditMode, editId, dasCourse]);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

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
        setFormData((prev) => ({ ...prev, lectures: updatedLectures }));
    };

    const addLectureField = () => {
        setFormData((prev) => ({
            ...prev,
            lectures: [...prev.lectures, { title: "", videoUrl: "" }],
        }));
    };

    const removeLectureField = (index) => {
        const updatedLectures = formData.lectures.filter((_, idx) => idx !== index);
        setFormData((prev) => ({ ...prev, lectures: updatedLectures }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImageUploading(true);
        try {
            const result = await DriveUpload(file);
            if (result?.success && result?.fileId) {
                setFormData((prev) => ({ ...prev, courseImage: result.fileId }));
                toast.success("Thumbnail uploaded successfully!");
            } else {
                toast.warning("Failed to upload thumbnail.");
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setImageUploading(false);
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
            let response;
            if (isEditMode) {
                response = await updateCourse(formData, editId);
            } else {
                response = await addCourse(formData);
            }

            if (response.success) {
                toast.success(isEditMode ? "Course updated successfully!" : "Course uploaded successfully!");
                router.back();
            } else {
                toast.error(response.message || `Failed to ${isEditMode ? 'update' : 'upload'} course.`);
            }
        } catch (err) {
            toast.error("Something went wrong during submission.");
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
                    <div className="up-header-icon" style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}>
                        <i className="fa-solid fa-graduation-cap"></i>
                    </div>
                    <div>
                        <h1 className="up-header-title">{isEditMode ? 'Edit' : 'Create New'} Course</h1>
                        <p className="up-header-sub">{isEditMode ? 'Update course details, curriculum and pricing' : 'Build a professional course listing with lectures, pricing, and media'}</p>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-xl-10">
                        <form onSubmit={handleSubmit}>

                            {/* ── Section: Basic Info ── */}
                            <div className="up-section-header">
                                <span className="up-section-icon" style={{ background: 'rgba(14,165,233,0.12)', color: '#0ea5e9' }}>
                                    <i className="fa-solid fa-circle-info"></i>
                                </span>
                                <span className="up-section-title">Basic Information</span>
                            </div>
                            <div className="up-card mb-4">
                                <div className="row g-4">
                                    <div className="col-md-8">
                                        <label className="up-label">Course Title <span className="up-req">*</span></label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon"><i className="fa-solid fa-graduation-cap"></i></span>
                                            <input type="text" name="title" value={formData.title} onChange={handleChange}
                                                className="up-input" placeholder="e.g. Master React.js from Scratch" required />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
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
                                        <label className="up-label">Mentor / Instructor <span className="up-req">*</span></label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon"><i className="fa-solid fa-chalkboard-user"></i></span>
                                            <input type="text" name="mentor" value={formData.mentor} onChange={handleChange}
                                                className="up-input" placeholder="Instructor name" required />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="up-label">Difficulty Level</label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon"><i className="fa-solid fa-signal"></i></span>
                                            <input type="text" name="courseLevel" value={formData.courseLevel} onChange={handleChange}
                                                className="up-input" placeholder="Beginner, Advanced..." />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="up-label">Duration</label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon"><i className="fa-solid fa-clock"></i></span>
                                            <input type="text" name="duration" value={formData.duration} onChange={handleChange}
                                                className="up-input" placeholder="e.g. 20 Hours" />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="up-label">Detailed Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange}
                                            className="up-input up-textarea" rows="4"
                                            placeholder="Describe what students will learn, prerequisites, and outcome..."
                                            style={{ paddingLeft: '14px' }} />
                                    </div>
                                </div>
                            </div>

                            {/* ── Section: Pricing ── */}
                            <div className="up-section-header">
                                <span className="up-section-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                </span>
                                <span className="up-section-title">Pricing &amp; Schedule</span>
                            </div>
                            <div className="up-card mb-4">
                                <div className="row g-4">
                                    <div className="col-md-3">
                                        <label className="up-label">Original Price <span className="up-req">*</span></label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon"><i className="fa-solid fa-indian-rupee-sign"></i></span>
                                            <input type="number" name="price" value={formData.price} onChange={handleChange}
                                                className="up-input" placeholder="0" required />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="up-label">Offer Percent</label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon"><i className="fa-solid fa-percent"></i></span>
                                            <input type="number" name="offerPercent" value={formData.offerPercent} onChange={handleChange}
                                                className="up-input" placeholder="0" />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="up-label">Offer Price</label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon"><i className="fa-solid fa-tag"></i></span>
                                            <input type="number" name="offerPrice" value={formData.offerPrice} onChange={handleChange}
                                                className="up-input" placeholder="0" />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="up-label">Start Date</label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon"><i className="fa-solid fa-calendar-check"></i></span>
                                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                                                className="up-input" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Section: Media ── */}
                            <div className="up-section-header">
                                <span className="up-section-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                    <i className="fa-solid fa-photo-film"></i>
                                </span>
                                <span className="up-section-title">Course Media</span>
                            </div>
                            <div className="up-card mb-4">
                                <div className="row g-4">
                                    {/* Thumbnail */}
                                    <div className="col-md-6">
                                        <label className="up-label">Thumbnail Image <span className="up-req">*</span></label>
                                        <input type="file" id="courseThumb" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                        <label htmlFor="courseThumb" className={`up-dropzone ${formData.courseImage ? 'up-dropzone--filled' : ''}`} style={{ minHeight: '120px' }}>
                                            {imageUploading ? (
                                                <><div className="up-spinner" style={{ borderTopColor: '#0ea5e9' }}></div><p className="up-dz-text">Uploading image...</p></>
                                            ) : formData.courseImage ? (
                                                <><i className="fa-solid fa-image" style={{ fontSize: '1.8rem', color: '#0ea5e9' }}></i>
                                                    <p className="up-dz-text" style={{ color: '#0ea5e9' }}>{imageFile?.name || 'Thumbnail uploaded'}</p>
                                                    <p className="up-dz-sub">Click to replace</p></>
                                            ) : (
                                                <><i className="fa-solid fa-image" style={{ fontSize: '1.8rem', color: '#94a3b8' }}></i>
                                                    <p className="up-dz-text">Drop image here, or <span style={{ color: '#0ea5e9' }}>click to browse</span></p>
                                                    <p className="up-dz-sub">JPG, PNG, WEBP · Recommended 16:9</p></>
                                            )}
                                        </label>
                                    </div>

                                    {/* Trial Video */}
                                    <div className="col-md-6">
                                        <label className="up-label">Trial / Preview Video (YouTube ID or URL) <span className="up-req">*</span></label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon"><i className="fa-brands fa-youtube" style={{ color: '#ef4444' }}></i></span>
                                            <input type="text" name="trialVideo" value={formData.trialVideo} onChange={handleChange}
                                                className="up-input" placeholder="https://youtube.com/watch?v=..." required />
                                        </div>
                                        <p className="up-hint mt-2">This will be shown as a free preview to prospective students.</p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Section: Curriculum ── */}
                            <div className="up-section-header">
                                <span className="up-section-icon" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>
                                    <i className="fa-solid fa-list-check"></i>
                                </span>
                                <span className="up-section-title">Course Curriculum</span>
                            </div>
                            <div className="up-card mb-4">
                                <div className="col-12 d-flex flex-column gap-3">
                                    {formData.lectures.map((lecture, index) => (
                                        <div key={index} className="up-lecture-row">
                                            <div className="up-lecture-num">{index + 1}</div>
                                            <div className="up-input-wrap flex-grow-1">
                                                <span className="up-input-icon"><i className="fa-solid fa-play"></i></span>
                                                <input type="text" className="up-input" placeholder="Lecture title (e.g. Introduction)"
                                                    value={lecture.title}
                                                    onChange={(e) => handleLectureChange(index, "title", e.target.value)} />
                                            </div>
                                            <div className="up-input-wrap flex-grow-1" style={{ flex: 1.4 }}>
                                                <span className="up-input-icon"><i className="fa-brands fa-youtube" style={{ color: '#ef4444' }}></i></span>
                                                <input type="url" className="up-input" placeholder="YouTube video URL"
                                                    value={lecture.videoUrl}
                                                    onChange={(e) => handleLectureChange(index, "videoUrl", e.target.value)} />
                                            </div>
                                            {formData.lectures.length > 1 && (
                                                <button type="button" className="up-remove-btn" onClick={() => removeLectureField(index)} title="Remove lecture">
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" className="up-add-lecture-btn" onClick={addLectureField}>
                                        <i className="fa-solid fa-plus me-2"></i>Add Another Lecture
                                    </button>
                                </div>
                            </div>

                            {/* ── Section: Additional Details ── */}
                            <div className="up-section-header">
                                <span className="up-section-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                                    <i className="fa-solid fa-star"></i>
                                </span>
                                <span className="up-section-title">Additional Details</span>
                            </div>
                            <div className="up-card mb-4">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="up-label">Why Choose This Course?</label>
                                        <textarea name="whyChoose" value={formData.whyChoose} onChange={handleChange}
                                            className="up-input up-textarea" rows="3" placeholder="Unique selling points, what makes it special..."
                                            style={{ paddingLeft: '14px' }} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="up-label">Student Benefits</label>
                                        <textarea name="benefits" value={formData.benefits} onChange={handleChange}
                                            className="up-input up-textarea" rows="3" placeholder="What value will they get? Skills gained..."
                                            style={{ paddingLeft: '14px' }} />
                                    </div>
                                    <div className="col-12">
                                        <label className="up-label">Detailed Course Contents</label>
                                        <textarea name="courseContents" value={formData.courseContents} onChange={handleChange}
                                            className="up-input up-textarea" rows="3" placeholder="Bullet points or summary of all topics covered..."
                                            style={{ paddingLeft: '14px' }} />
                                    </div>
                                </div>
                            </div>

                            {/* ── Section: Settings ── */}
                            <div className="up-card mb-5">
                                <div className="row g-4 align-items-center">
                                    <div className="col-md-4">
                                        <label className="up-label">Publishing Status</label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon"><i className="fa-solid fa-circle-dot"></i></span>
                                            <select name="status" value={formData.status} onChange={handleChange} className="up-input up-select">
                                                <option value="public">Live &amp; Searchable</option>
                                                <option value="draft">Draft (Internal Only)</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4 d-flex align-items-end" style={{ paddingBottom: '2px' }}>
                                        <label className="up-toggle-wrap mt-3">
                                            <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} className="up-toggle-input" />
                                            <span className="up-toggle"></span>
                                            <span className="up-toggle-label">Public Enrollment</span>
                                        </label>
                                    </div>
                                    <div className="col-md-4 d-flex gap-3 justify-content-md-end mt-3 mt-md-0">
                                        <button type="button" onClick={() => router.back()} className="up-cancel-btn">{isEditMode ? 'Cancel' : 'Discard'}</button>
                                        <button type="submit" disabled={uploading || !formData.courseImage} className="up-submit-btn">
                                            {uploading
                                                ? <><div className="up-btn-spinner me-2"></div>{isEditMode ? 'Updating...' : 'Creating Course...'}</>
                                                : <><i className={`fa-solid ${isEditMode ? 'fa-pen-to-square' : 'fa-rocket'} me-2`}></i>{isEditMode ? 'Update Course' : 'Create Course'}</>}
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .up-page { min-height: 100vh; background: #f1f5f9; }
                .up-header { position: relative; overflow: hidden; background: linear-gradient(135deg,#06152e 0%,#0a2540 60%,#06152e 100%); padding: 44px 24px; }
                .up-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.2; pointer-events: none; }
                .up-blob1 { width: 320px; height: 320px; background: #0ea5e9; top: -100px; right: -80px; }
                .up-blob2 { width: 260px; height: 260px; background: #06b6d4; bottom: -80px; left: 80px; }
                .up-header-content { position: relative; z-index: 1; display: flex; align-items: center; gap: 20px; max-width: 960px; margin: 0 auto; }
                .up-header-icon { width: 56px; height: 56px; border-radius: 18px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: white; box-shadow: 0 8px 24px rgba(14,165,233,0.4); }
                .up-header-title { font-size: 1.6rem; font-weight: 800; color: white; margin: 0; letter-spacing: -0.02em; }
                .up-header-sub { color: rgba(255,255,255,0.5); font-size: 0.85rem; margin: 4px 0 0; }

                /* Section headers */
                .up-section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
                .up-section-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; flex-shrink: 0; }
                .up-section-title { font-size: 0.9rem; font-weight: 700; color: #1e293b; letter-spacing: 0.01em; }

                .up-card { background: white; border-radius: 18px; padding: 28px; box-shadow: 0 2px 16px rgba(0,0,0,0.055); border: 1px solid #f1f5f9; }
                .up-label { font-size: 0.8rem; font-weight: 700; color: #374151; margin-bottom: 7px; display: block; }
                .up-req { color: #ef4444; }
                .up-input-wrap { position: relative; width: 100%; }
                .up-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.82rem; pointer-events: none; z-index: 1; }
                .up-input { width: 100%; padding: 11px 14px 11px 38px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 0.9rem; color: #0f172a; background: #f8fafc; transition: all 0.2s; outline: none; font-family: inherit; }
                .up-input:focus { border-color: #0ea5e9; background: white; box-shadow: 0 0 0 3px rgba(14,165,233,0.12); }
                .up-textarea { padding: 11px 14px !important; resize: vertical; min-height: 90px; }
                .up-select { appearance: none; cursor: pointer; }
                .up-hint { font-size: 0.75rem; color: #94a3b8; margin: 6px 0 0; }

                /* Drop zone */
                .up-dropzone { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; border: 2px dashed #e2e8f0; border-radius: 14px; padding: 28px 20px; background: #f8fafc; cursor: pointer; text-align: center; transition: all 0.2s; width: 100%; }
                .up-dropzone:hover, .up-dropzone--filled { border-color: #0ea5e9; background: rgba(14,165,233,0.03); }
                .up-dz-text { font-size: 0.9rem; font-weight: 500; color: #374151; margin: 4px 0 0; }
                .up-dz-sub { font-size: 0.75rem; color: #94a3b8; margin: 0; }

                /* Lecture rows */
                .up-lecture-row { display: flex; align-items: center; gap: 10px; }
                .up-lecture-num { width: 28px; height: 28px; border-radius: 8px; background: rgba(99,102,241,0.1); color: #6366f1; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .up-remove-btn { width: 34px; height: 34px; border-radius: 10px; border: 1.5px solid #fecaca; background: #fff5f5; color: #ef4444; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; flex-shrink: 0; transition: all 0.2s; }
                .up-remove-btn:hover { background: #fee2e2; border-color: #ef4444; }
                .up-add-lecture-btn { align-self: flex-start; padding: 9px 20px; border-radius: 10px; border: 1.5px dashed #c7d2fe; background: rgba(99,102,241,0.04); color: #6366f1; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; transition: all 0.2s; }
                .up-add-lecture-btn:hover { border-color: #6366f1; background: rgba(99,102,241,0.08); }

                /* Toggle */
                .up-toggle-wrap { display: flex; align-items: center; gap: 10px; cursor: pointer; }
                .up-toggle-input { display: none; }
                .up-toggle { width: 42px; height: 24px; background: #e2e8f0; border-radius: 50px; position: relative; transition: background 0.2s; flex-shrink: 0; }
                .up-toggle::after { content: ''; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
                .up-toggle-input:checked ~ .up-toggle { background: #0ea5e9; }
                .up-toggle-input:checked ~ .up-toggle::after { transform: translateX(18px); }
                .up-toggle-label { font-size: 0.875rem; font-weight: 600; color: #374151; }

                /* Buttons */
                .up-cancel-btn { padding: 11px 20px; border-radius: 12px; border: 1.5px solid #e2e8f0; background: transparent; color: #64748b; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
                .up-cancel-btn:hover { border-color: #94a3b8; background: #f8fafc; }
                .up-submit-btn { padding: 11px 24px; border-radius: 12px; border: none; background: linear-gradient(135deg,#0ea5e9,#06b6d4); color: white; font-size: 0.92rem; font-weight: 700; display: flex; align-items: center; cursor: pointer; transition: all 0.24s; box-shadow: 0 4px 14px rgba(14,165,233,0.35); white-space: nowrap; }
                .up-submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(14,165,233,0.5); }
                .up-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .up-spinner { width: 26px; height: 26px; border: 2.5px solid rgba(14,165,233,0.15); border-top-color: #0ea5e9; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                .up-btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 576px) { .up-card { padding: 20px 14px; } .up-lecture-row { flex-wrap: wrap; } }
            `}</style>
        </main>
    );
};

export default function UploadCoursePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Content />
        </Suspense>
    );
}
