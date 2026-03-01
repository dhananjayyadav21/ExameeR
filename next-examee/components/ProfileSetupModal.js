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
        Phone: userData?.Phone || "",
        Gender: userData?.Gender || "",
        Location: userData?.Location || "",
        Institution: userData?.Institution || "",
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
        if (!formData.Phone.trim()) newErrors.Phone = "Phone number is required";
        if (!formData.Gender.trim()) newErrors.Gender = "Gender is required";
        if (!formData.Location.trim()) newErrors.Location = "Location is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        const finalCourse = formData.Course === "Other" ? customCourse : formData.Course;
        if (!formData.Institution.trim()) newErrors.Institution = "Institution name is required";
        if (!finalCourse.trim()) newErrors.Course = "Please select your course";
        if (!formData.University.trim()) newErrors.University = "University name is required";
        if (!formData.Semester) newErrors.Semester = "Please select your semester";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };

    const isStep1Complete = formData.FirstName.trim() !== "" &&
        formData.LastName.trim() !== "" &&
        formData.Phone.trim() !== "" &&
        formData.Gender.trim() !== "" &&
        formData.Location.trim() !== "";

    const isStep2Complete = formData.Institution.trim() !== "" &&
        (formData.Course === "Other" ? customCourse.trim() !== "" : formData.Course.trim() !== "") &&
        formData.University.trim() !== "" &&
        formData.Semester !== "";

    const handleSubmit = async () => {
        const step1Valid = validateStep1();
        const step2Valid = validateStep2();

        if (!step1Valid) {
            setStep(1);
            toast.warn("Please complete all personal information fields.");
            return;
        }
        if (!step2Valid) {
            toast.warn("Please complete all academic information fields.");
            return;
        }
        setSaving(true);
        try {
            const finalCourse = formData.Course === "Other" ? customCourse.trim() : formData.Course;
            const payload = {
                FirstName: formData.FirstName.trim(),
                LastName: formData.LastName.trim(),
                Phone: formData.Phone.trim(),
                Gender: formData.Gender.trim(),
                Location: formData.Location.trim(),
                Institution: formData.Institution.trim(),
                Course: finalCourse,
                University: formData.University.trim(),
                Semester: formData.Semester,
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
        <div className="psm-backdrop" style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(6px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
        }}>
            <div className="psm-card">
                {/* Header */}
                <div className="psm-header">
                    <h2 className="psm-title">Complete Your Profile</h2>
                    <p className="psm-subtitle">Help us personalise your learning experience</p>
                </div>

                <div className="psm-step-labels">
                    <span className={`psm-step-dot ${step >= 1 ? 'active' : ''}`}>
                        <i className="fa-solid fa-user"></i> Personal Info
                    </span>
                    <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1', fontSize: '0.6rem', alignSelf: 'center', margin: '0 4px' }}></i>
                    <span className={`psm-step-dot ${step >= 2 ? 'active' : ''}`}>
                        <i className="fa-solid fa-building-columns"></i> Academic Info
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
                            <div className="psm-field-row">
                                <div className={`psm-field ${errors.Phone ? 'psm-field--error' : ''}`}>
                                    <label className="psm-label">
                                        <i className="fa-solid fa-phone me-2"></i>Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        className="psm-input"
                                        placeholder="e.g. +91 9876543210"
                                        value={formData.Phone}
                                        onChange={e => handleChange("Phone", e.target.value)}
                                    />
                                    {errors.Phone && <span className="psm-error">{errors.Phone}</span>}
                                </div>
                                <div className={`psm-field ${errors.Gender ? 'psm-field--error' : ''}`}>
                                    <label className="psm-label">
                                        <i className="fa-solid fa-venus-mars me-2"></i>Gender
                                    </label>
                                    <select
                                        className="psm-input"
                                        value={formData.Gender}
                                        onChange={e => handleChange("Gender", e.target.value)}
                                        style={{ height: "46.5px" }}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.Gender && <span className="psm-error">{errors.Gender}</span>}
                                </div>
                            </div>

                            <div className={`psm-field ${errors.Location ? 'psm-field--error' : ''}`}>
                                <label className="psm-label">
                                    <i className="fa-solid fa-location-dot me-2"></i>Location / City
                                </label>
                                <input
                                    type="text"
                                    className="psm-input"
                                    placeholder="e.g. Mumbai, India"
                                    value={formData.Location}
                                    onChange={e => handleChange("Location", e.target.value)}
                                />
                                {errors.Location && <span className="psm-error">{errors.Location}</span>}
                            </div>
                            <div className="mt-4">
                                <button className="psm-btn-primary" onClick={handleNext}>
                                    Next <i className="fa-solid fa-arrow-right ms-2"></i>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="psm-step">
                            <p className="psm-step-desc">
                                <i className="fa-solid fa-book-open me-2" style={{ color: '#4f46e5' }}></i>
                                This helps us show you the most relevant content.
                            </p>

                            {/* Institution */}
                            <div className={`psm-field ${errors.Institution ? 'psm-field--error' : ''}`}>
                                <label className="psm-label">
                                    <i className="fa-solid fa-building me-2"></i>College / Institution Name
                                </label>
                                <input
                                    type="text"
                                    className="psm-input"
                                    placeholder="e.g. Thakur College of Engineering"
                                    value={formData.Institution}
                                    onChange={e => handleChange("Institution", e.target.value)}
                                />
                                {errors.Institution && <span className="psm-error">{errors.Institution}</span>}
                            </div>

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
                    .psm-card {
                        background: #ffffff;
                        border-radius: 20px;
                        width: 100%;
                        max-width: 580px;
                        max-height: 90vh;
                        display: flex;
                        flex-direction: column;
                        box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1), 0 0 0 1px rgba(226, 232, 240, 0.8);
                        overflow: hidden;
                        animation: slideup 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        position: relative;
                        z-index: 9999999;
                    }
                    .psm-card::before {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0;
                        height: 4px;
                        background: linear-gradient(90deg, #04bd20, #10b981);
                    }
                    @keyframes slideup { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

                    .psm-header {
                        padding: 32px 36px 20px;
                        text-align: left;
                    }
                    .psm-title { color: #0f172a; font-size: 1.6rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }
                    .psm-subtitle { color: #64748b; font-size: 0.95rem; margin: 6px 0 0; }

                    .psm-step-labels {
                        display: flex;
                        gap: 16px;
                        padding: 0 36px 24px;
                        background: #fff;
                        border-bottom: 1px solid #f1f5f9;
                        justify-content: flex-start;
                        align-items: center;
                    }
                    .psm-step-dot {
                        font-size: 0.85rem;
                        font-weight: 600;
                        color: #94a3b8;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transition: color 0.3s;
                    }
                    .psm-step-dot.active { color: #04bd20; }
                    .psm-step-dot i { font-size: 0.9rem; }

                    .psm-body { 
                        padding: 28px 36px 36px; 
                        overflow-y: auto; 
                        flex: 1; 
                    }
                    .psm-body::-webkit-scrollbar { width: 6px; }
                    .psm-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

                    .psm-step-desc {
                        font-size: 0.9rem;
                        color: #475569;
                        margin-bottom: 28px;
                        display: flex;
                        align-items: center;
                        background: #f8fafc;
                        padding: 12px 16px;
                        border-radius: 12px;
                        border: 1px solid #f1f5f9;
                    }

                    .psm-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                    .psm-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
                    .psm-field:last-of-type { margin-bottom: 28px; }
                    
                    .psm-label { font-size: 0.85rem; font-weight: 700; color: #334155; display: flex; align-items: center; }
                    .psm-label i { color: #94a3b8; font-size: 0.9rem; margin-right: 8px; }

                    .psm-input {
                        padding: 12px 16px;
                        border: 2px solid #e2e8f0;
                        border-radius: 12px;
                        font-size: 0.95rem;
                        color: #0f172a;
                        background: #f8fafc;
                        transition: all 0.2s;
                        width: 100%;
                        font-weight: 500;
                    }
                    .psm-input:focus { border-color: #04bd20; background: #fff; outline: none; box-shadow: 0 4px 12px rgba(4,189,32,0.1); }
                    .psm-input::placeholder { color: #cbd5e1; font-weight: 400; }
                    .psm-field--error .psm-input { border-color: #ef4444; background: #fef2f2; }
                    .psm-error { font-size: 0.8rem; color: #ef4444; margin-top: 4px; font-weight: 600; }

                    .psm-course-grid {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        max-height: 160px;
                        overflow-y: auto;
                        padding-right: 4px;
                    }
                    .psm-course-grid::-webkit-scrollbar { width: 4px; }
                    .psm-course-grid::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

                    .psm-semester-grid { display: flex; flex-wrap: wrap; gap: 8px; }

                    .psm-chip {
                        padding: 8px 16px;
                        border-radius: 10px;
                        border: 2px solid #e2e8f0;
                        background: #fff;
                        font-size: 0.85rem;
                        font-weight: 600;
                        color: #475569;
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .psm-chip:hover { border-color: #cbd5e1; background: #f8fafc; }
                    .psm-chip--selected { border-color: #04bd20; background: #f0fdf4; color: #04bd20; }
                    .psm-chip--sm { padding: 6px 14px; font-size: 0.8rem; }

                    .psm-btn-primary {
                        width: 100%;
                        padding: 16px;
                        background: linear-gradient(135deg, #04bd20 0%, #03a61c 100%);
                        color: white;
                        border: none;
                        border-radius: 14px;
                        font-size: 1rem;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 8px 20px -6px rgba(4,189,32,0.4);
                    }
                    .psm-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 24px -6px rgba(4,189,32,0.5); }
                    .psm-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

                    .psm-btn-row { display: flex; gap: 16px; }
                    .psm-btn-back {
                        padding: 16px 24px;
                        background: #f1f5f9;
                        color: #475569;
                        border: none;
                        border-radius: 14px;
                        font-size: 0.95rem;
                        font-weight: 700;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        transition: all 0.2s;
                    }
                    .psm-btn-back:hover { background: #e2e8f0; color: #0f172a; }
                    .psm-btn-row .psm-btn-primary { flex: 1; }

                    @media (max-width: 480px) {
                        .psm-header { padding: 24px 24px 16px; }
                        .psm-step-labels { padding: 0 24px 20px; }
                        .psm-body { padding: 24px 24px 24px; }
                        .psm-field-row { grid-template-columns: 1fr; gap: 0; }
                    }
                `}</style>
            </div>
        </div>
    );
}
