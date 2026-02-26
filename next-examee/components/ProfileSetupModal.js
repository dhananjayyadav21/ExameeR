"use client";
import React, { useState } from "react";
import { useContext } from "react";
import ContentContext from "@/context/ContentContext";
import { toast } from "react-toastify";

const COURSES = [
    "BSc IT", "BSc CS", "BSc", "BCom", "BCom (Accounting & Finance)",
    "BCom (Financial Markets)", "BA", "BMS", "BCA", "BBA",
    "MSc IT", "MSc CS", "MCom", "MA", "MBA", "MCA",
    "BTech", "MTech", "BE", "ME", "BPharm", "MPharm",
    "MBBS", "BDS", "Nursing", "LLB", "CA", "CS", "Other"
];

const SEMESTERS = [
    "Semester 1", "Semester 2", "Semester 3", "Semester 4",
    "Semester 5", "Semester 6", "Semester 7", "Semester 8",
    "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"
];

export default function ProfileSetupModal({ userData, onComplete }) {
    const context = useContext(ContentContext);
    const { updateProfile } = context;

    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        FirstName: userData?.FirstName || "",
        LastName: userData?.LastName || "",
        Course: userData?.Course || "",
        University: userData?.University || "",
        Semester: userData?.Semester || "",
    });
    const [customCourse, setCustomCourse] = useState("");
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.FirstName.trim()) newErrors.FirstName = "First name is required";
        if (!formData.LastName.trim()) newErrors.LastName = "Last name is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        const finalCourse = formData.Course === "Other" ? customCourse : formData.Course;
        if (!finalCourse.trim()) newErrors.Course = "Please select your course";
        if (!formData.University.trim()) newErrors.University = "University name is required";
        if (!formData.Semester) newErrors.Semester = "Please select your semester";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };

    const handleSubmit = async () => {
        if (!validateStep2()) return;
        setSaving(true);
        try {
            const finalCourse = formData.Course === "Other" ? customCourse.trim() : formData.Course;
            const payload = {
                FirstName: formData.FirstName.trim(),
                LastName: formData.LastName.trim(),
                Course: finalCourse,
                University: formData.University.trim(),
                Semester: formData.Semester,
                Username: userData?.Username,
            };
            const res = await updateProfile(payload);
            if (res?.success) {
                toast.success("🎉 Profile set up successfully! Welcome aboard!");
                onComplete();
            } else {
                toast.error(res?.message || "Failed to save profile.");
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const progress = step === 1 ? 50 : 100;

    return (
        <div className="psm-backdrop">
            <div className="psm-card">
                {/* Header */}
                <div className="psm-header">
                    <div className="psm-logo-wrap">
                        <i className="fa-solid fa-graduation-cap psm-logo-icon"></i>
                    </div>
                    <div className="psm-header-text">
                        <h2 className="psm-title">Complete Your Profile</h2>
                        <p className="psm-subtitle">Help us personalise your learning experience</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="psm-progress-track">
                    <div className="psm-progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="psm-step-labels">
                    <span className={`psm-step-dot ${step >= 1 ? 'active' : ''}`}>
                        <i className="fa-solid fa-user"></i> Personal Info
                    </span>
                    <span className={`psm-step-dot ${step >= 2 ? 'active' : ''}`}>
                        <i className="fa-solid fa-university"></i> Academic Info
                    </span>
                </div>

                {/* Form Body */}
                <div className="psm-body">
                    {step === 1 ? (
                        <div className="psm-step">
                            <p className="psm-step-desc">
                                <i className="fa-solid fa-hand-wave me-2" style={{ color: '#f59e0b' }}></i>
                                Welcome! Tell us your name so we can greet you properly.
                            </p>
                            <div className="psm-field-row">
                                <div className={`psm-field ${errors.FirstName ? 'psm-field--error' : ''}`}>
                                    <label className="psm-label">
                                        <i className="fa-solid fa-user me-2"></i>First Name
                                    </label>
                                    <input
                                        type="text"
                                        className="psm-input"
                                        placeholder="e.g. Rahul"
                                        value={formData.FirstName}
                                        onChange={e => handleChange("FirstName", e.target.value)}
                                        autoFocus
                                    />
                                    {errors.FirstName && <span className="psm-error">{errors.FirstName}</span>}
                                </div>
                                <div className={`psm-field ${errors.LastName ? 'psm-field--error' : ''}`}>
                                    <label className="psm-label">
                                        <i className="fa-solid fa-user me-2"></i>Last Name
                                    </label>
                                    <input
                                        type="text"
                                        className="psm-input"
                                        placeholder="e.g. Sharma"
                                        value={formData.LastName}
                                        onChange={e => handleChange("LastName", e.target.value)}
                                    />
                                    {errors.LastName && <span className="psm-error">{errors.LastName}</span>}
                                </div>
                            </div>
                            <button className="psm-btn-primary" onClick={handleNext}>
                                Next <i className="fa-solid fa-arrow-right ms-2"></i>
                            </button>
                        </div>
                    ) : (
                        <div className="psm-step">
                            <p className="psm-step-desc">
                                <i className="fa-solid fa-book-open me-2" style={{ color: '#4f46e5' }}></i>
                                This helps us show you the most relevant content.
                            </p>

                            {/* Course */}
                            <div className={`psm-field ${errors.Course ? 'psm-field--error' : ''}`}>
                                <label className="psm-label">
                                    <i className="fa-solid fa-graduation-cap me-2"></i>Course / Programme
                                </label>
                                <div className="psm-course-grid">
                                    {COURSES.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            className={`psm-chip ${formData.Course === c ? 'psm-chip--selected' : ''}`}
                                            onClick={() => handleChange("Course", c)}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                                {formData.Course === "Other" && (
                                    <input
                                        type="text"
                                        className="psm-input mt-2"
                                        placeholder="Type your course name..."
                                        value={customCourse}
                                        onChange={e => setCustomCourse(e.target.value)}
                                        autoFocus
                                    />
                                )}
                                {errors.Course && <span className="psm-error">{errors.Course}</span>}
                            </div>

                            {/* University */}
                            <div className={`psm-field ${errors.University ? 'psm-field--error' : ''}`}>
                                <label className="psm-label">
                                    <i className="fa-solid fa-building-columns me-2"></i>University / College
                                </label>
                                <input
                                    type="text"
                                    className="psm-input"
                                    placeholder="e.g. Mumbai University"
                                    value={formData.University}
                                    onChange={e => handleChange("University", e.target.value)}
                                    list="university-list"
                                />
                                <datalist id="university-list">
                                    {["Mumbai University", "Pune University", "Delhi University", "Bangalore University",
                                        "Osmania University", "Anna University", "Calcutta University", "Madras University",
                                        "Mysore University", "Gujarat University", "Rajasthan University"].map(u => (
                                            <option key={u} value={u} />
                                        ))}
                                </datalist>
                                {errors.University && <span className="psm-error">{errors.University}</span>}
                            </div>

                            {/* Semester */}
                            <div className={`psm-field ${errors.Semester ? 'psm-field--error' : ''}`}>
                                <label className="psm-label">
                                    <i className="fa-solid fa-calendar-days me-2"></i>Current Semester / Year
                                </label>
                                <div className="psm-semester-grid">
                                    {SEMESTERS.map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            className={`psm-chip psm-chip--sm ${formData.Semester === s ? 'psm-chip--selected' : ''}`}
                                            onClick={() => handleChange("Semester", s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                                {errors.Semester && <span className="psm-error">{errors.Semester}</span>}
                            </div>

                            <div className="psm-btn-row">
                                <button className="psm-btn-back" onClick={() => setStep(1)}>
                                    <i className="fa-solid fa-arrow-left me-2"></i>Back
                                </button>
                                <button className="psm-btn-primary" onClick={handleSubmit} disabled={saving}>
                                    {saving ? (
                                        <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Saving...</>
                                    ) : (
                                        <><i className="fa-solid fa-rocket me-2"></i>Start Learning!</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <style jsx>{`
                    .psm-backdrop {
                        position: fixed;
                        inset: 0;
                        background: rgba(10, 14, 30, 0.75);
                        backdrop-filter: blur(8px);
                        z-index: 9999;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 16px;
                        animation: fadein 0.3s ease;
                    }
                    @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }

                    .psm-card {
                        background: #fff;
                        border-radius: 24px;
                        width: 100%;
                        max-width: 560px;
                        box-shadow: 0 30px 80px rgba(0,0,0,0.2);
                        overflow: hidden;
                        animation: slidein 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    @keyframes slidein { from { opacity: 0; transform: translateY(30px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

                    .psm-header {
                        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                        padding: 28px 32px;
                        display: flex;
                        align-items: center;
                        gap: 16px;
                    }
                    .psm-logo-wrap {
                        width: 52px;
                        height: 52px;
                        background: linear-gradient(135deg, #04bd20 0%, #029d1a 100%);
                        border-radius: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        box-shadow: 0 8px 20px rgba(4,189,32,0.3);
                    }
                    .psm-logo-icon { color: white; font-size: 1.4rem; }
                    .psm-title { color: #fff; font-size: 1.2rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }
                    .psm-subtitle { color: rgba(255,255,255,0.55); font-size: 0.8rem; margin: 4px 0 0; }

                    .psm-progress-track {
                        height: 4px;
                        background: #f1f5f9;
                    }
                    .psm-progress-fill {
                        height: 100%;
                        background: linear-gradient(90deg, #04bd20, #10b981);
                        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .psm-step-labels {
                        display: flex;
                        gap: 8px;
                        padding: 12px 24px;
                        background: #f8fafc;
                        border-bottom: 1px solid #f1f5f9;
                    }
                    .psm-step-dot {
                        font-size: 0.72rem;
                        font-weight: 700;
                        padding: 5px 12px;
                        border-radius: 20px;
                        color: #94a3b8;
                        background: #e2e8f0;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        transition: all 0.3s;
                    }
                    .psm-step-dot.active { background: #f0fdf4; color: #04bd20; }

                    .psm-body { padding: 28px 32px 32px; }

                    .psm-step-desc {
                        font-size: 0.88rem;
                        color: #64748b;
                        background: #f8fafc;
                        border-radius: 10px;
                        padding: 12px 16px;
                        margin-bottom: 24px;
                        border-left: 3px solid #e2e8f0;
                    }

                    .psm-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
                    .psm-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
                    .psm-field:last-of-type { margin-bottom: 24px; }
                    .psm-label { font-size: 0.8rem; font-weight: 700; color: #374151; display: flex; align-items: center; }

                    .psm-input {
                        padding: 12px 14px;
                        border: 1.5px solid #e2e8f0;
                        border-radius: 12px;
                        font-size: 0.9rem;
                        color: #0f172a;
                        outline: none;
                        transition: all 0.2s;
                        background: #fafafa;
                    }
                    .psm-input:focus { border-color: #04bd20; background: #fff; box-shadow: 0 0 0 4px rgba(4,189,32,0.08); }
                    .psm-field--error .psm-input { border-color: #f87171; }
                    .psm-error { font-size: 0.75rem; color: #ef4444; margin-top: 2px; }

                    .psm-course-grid {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                        max-height: 160px;
                        overflow-y: auto;
                        padding: 4px;
                    }
                    .psm-course-grid::-webkit-scrollbar { width: 4px; }
                    .psm-course-grid::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

                    .psm-semester-grid { display: flex; flex-wrap: wrap; gap: 8px; }

                    .psm-chip {
                        padding: 7px 14px;
                        border-radius: 20px;
                        border: 1.5px solid #e2e8f0;
                        background: #fff;
                        font-size: 0.8rem;
                        font-weight: 600;
                        color: #64748b;
                        cursor: pointer;
                        transition: all 0.2s;
                        white-space: nowrap;
                    }
                    .psm-chip:hover { border-color: #04bd20; color: #04bd20; background: #f0fdf4; }
                    .psm-chip--selected { border-color: #04bd20; background: #f0fdf4; color: #04bd20; }
                    .psm-chip--sm { padding: 5px 12px; font-size: 0.76rem; }

                    .psm-btn-primary {
                        width: 100%;
                        padding: 14px;
                        background: linear-gradient(135deg, #04bd20 0%, #029d1a 100%);
                        color: white;
                        border: none;
                        border-radius: 14px;
                        font-size: 0.95rem;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 8px 20px rgba(4,189,32,0.25);
                    }
                    .psm-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(4,189,32,0.35); filter: brightness(1.05); }
                    .psm-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

                    .psm-btn-row { display: flex; gap: 12px; }
                    .psm-btn-back {
                        padding: 14px 22px;
                        background: #f1f5f9;
                        color: #64748b;
                        border: none;
                        border-radius: 14px;
                        font-size: 0.88rem;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        white-space: nowrap;
                    }
                    .psm-btn-back:hover { background: #e2e8f0; color: #374151; }
                    .psm-btn-row .psm-btn-primary { flex: 1; width: auto; }

                    @media (max-width: 480px) {
                        .psm-card { border-radius: 20px; }
                        .psm-header { padding: 22px 20px; }
                        .psm-body { padding: 20px; }
                        .psm-field-row { grid-template-columns: 1fr; }
                    }
                `}</style>
            </div>
        </div>
    );
}
