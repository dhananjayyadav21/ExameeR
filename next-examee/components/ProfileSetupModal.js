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
        <div className="psm-overlay">
            <div className="psm-container">
                {/* Visual Side Decoration (Modern Touch) */}
                <div className="psm-side-panel d-none d-md-block">
                    <div className="psm-panel-content">
                        <div className="psm-logo mb-4">
                            <img src="/assets/img/brandlog.png" alt="Examee" style={{ height: '30px', filter: 'brightness(0) invert(1)' }} />
                        </div>
                        <h3 className="text-white fw-bold mb-3" style={{ fontSize: '1.4rem' }}>Welcome to<br />Examee!</h3>
                        <p className="text-white-50 small mb-4">Complete your profile to unlock personalized learning paths and expert resources.</p>

                        <div className="psm-perks">
                            <div className="psm-perk">
                                <i className="fa-solid fa-bolt"></i>
                                <span>Curated Notes</span>
                            </div>
                            <div className="psm-perk">
                                <i className="fa-solid fa-circle-play"></i>
                                <span>Expert Videos</span>
                            </div>
                            <div className="psm-perk">
                                <i className="fa-solid fa-chart-line"></i>
                                <span>Goal Tracking</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="psm-form-panel">
                    {/* Header with Progress */}
                    <div className="psm-header">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h4 className="psm-title">Setup Profile</h4>
                            <span className="psm-badge">Step {step} of 2</span>
                        </div>
                        <div className="psm-progress-bg">
                            <div className="psm-progress-bar" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <div className="psm-body">
                        {step === 1 ? (
                            <div className="animate-fade-in">
                                <h5 className="fw-bold text-dark mb-4">Personal Information</h5>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="psm-input-group">
                                            <label>First Name</label>
                                            <input
                                                type="text"
                                                className={`psm-input ${errors.FirstName ? 'error' : ''}`}
                                                value={formData.FirstName}
                                                onChange={e => handleChange("FirstName", e.target.value)}
                                                placeholder="e.g. Aryan"
                                            />
                                            {errors.FirstName && <span className="error-text">{errors.FirstName}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="psm-input-group">
                                            <label>Last Name</label>
                                            <input
                                                type="text"
                                                className={`psm-input ${errors.LastName ? 'error' : ''}`}
                                                value={formData.LastName}
                                                onChange={e => handleChange("LastName", e.target.value)}
                                                placeholder="e.g. Verma"
                                            />
                                            {errors.LastName && <span className="error-text">{errors.LastName}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="psm-input-group">
                                            <label>Contact Number</label>
                                            <input
                                                type="tel"
                                                className={`psm-input ${errors.Phone ? 'error' : ''}`}
                                                value={formData.Phone}
                                                onChange={e => handleChange("Phone", e.target.value)}
                                                placeholder="+91 XXXXX XXXXX"
                                            />
                                            {errors.Phone && <span className="error-text">{errors.Phone}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="psm-input-group">
                                            <label>Gender</label>
                                            <select
                                                className={`psm-input ${errors.Gender ? 'error' : ''}`}
                                                value={formData.Gender}
                                                onChange={e => handleChange("Gender", e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.Gender && <span className="error-text">{errors.Gender}</span>}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="psm-input-group">
                                            <label>Current Location / City</label>
                                            <div className="psm-icon-input">
                                                <i className="fa-solid fa-location-dot"></i>
                                                <input
                                                    type="text"
                                                    className={`psm-input ps-5 ${errors.Location ? 'error' : ''}`}
                                                    value={formData.Location}
                                                    onChange={e => handleChange("Location", e.target.value)}
                                                    placeholder="e.g. Mumbai, India"
                                                />
                                            </div>
                                            {errors.Location && <span className="error-text">{errors.Location}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <button className="psm-btn-next" onClick={handleNext}>
                                        Continue <i className="fa-solid fa-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <h5 className="fw-bold text-dark mb-4">Academic Details</h5>

                                <div className="psm-input-group mb-4">
                                    <label>College / Institution Name</label>
                                    <input
                                        type="text"
                                        className={`psm-input ${errors.Institution ? 'error' : ''}`}
                                        value={formData.Institution}
                                        onChange={e => handleChange("Institution", e.target.value)}
                                        placeholder="Enter your college name"
                                    />
                                    {errors.Institution && <span className="error-text">{errors.Institution}</span>}
                                </div>

                                <div className="psm-input-group mb-4">
                                    <label>University</label>
                                    <input
                                        type="text"
                                        className={`psm-input ${errors.University ? 'error' : ''}`}
                                        value={formData.University}
                                        onChange={e => handleChange("University", e.target.value)}
                                        placeholder="e.g. Mumbai University"
                                    />
                                    {errors.University && <span className="error-text">{errors.University}</span>}
                                </div>

                                <div className="psm-input-group mb-4">
                                    <label>Select Your Course</label>
                                    <div className="psm-chip-cloud">
                                        {COURSES.slice(0, 10).map(c => (
                                            <button
                                                key={c}
                                                className={`psm-chip ${formData.Course === c ? 'active' : ''}`}
                                                onClick={() => handleChange("Course", c)}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                        {formData.Course !== "Other" && COURSES.length > 10 && <button className="psm-chip" onClick={() => handleChange("Course", "Other")}>More...</button>}
                                    </div>
                                    {formData.Course === "Other" && (
                                        <input
                                            type="text"
                                            className="psm-input mt-3"
                                            placeholder="Specify your course"
                                            value={customCourse}
                                            onChange={e => setCustomCourse(e.target.value)}
                                        />
                                    )}
                                    {errors.Course && <span className="error-text">{errors.Course}</span>}
                                </div>

                                <div className="psm-input-group mb-4">
                                    <label>Current Semester</label>
                                    <select
                                        className={`psm-input ${errors.Semester ? 'error' : ''}`}
                                        value={formData.Semester}
                                        onChange={e => handleChange("Semester", e.target.value)}
                                    >
                                        <option value="">Select Semester</option>
                                        {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    {errors.Semester && <span className="error-text">{errors.Semester}</span>}
                                </div>

                                <div className="d-flex gap-3 mt-5">
                                    <button className="psm-btn-outline" onClick={() => setStep(1)}>
                                        <i className="fa-solid fa-arrow-left me-2"></i>Back
                                    </button>
                                    <button className="psm-btn-next flex-grow-1" onClick={handleSubmit} disabled={saving}>
                                        {saving ? (
                                            <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                                        ) : (
                                            <><i className="fa-solid fa-rocket me-2"></i>Start Exploring</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .psm-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(8px);
                    z-index: 1000000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                
                .psm-container {
                    width: 100%;
                    max-width: 900px;
                    height: auto;
                    max-height: 90vh;
                    background: #fff;
                    border-radius: 30px;
                    overflow: hidden;
                    display: flex;
                    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.25);
                    animation: modalEntry 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                @keyframes modalEntry {
                    from { transform: translateY(40px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }

                .psm-side-panel {
                    flex: 0 0 350px;
                    background: linear-gradient(150deg, #04bd20 0%, #03a61c 100%);
                    position: relative;
                    padding: 60px 40px;
                }
                
                .psm-side-panel::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: url("https://www.transparenttextures.com/patterns/cubes.png");
                    opacity: 0.1;
                }
                
                .psm-panel-content { position: relative; z-index: 2; }
                
                .psm-perks { display: grid; gap: 12px; }
                .psm-perk { 
                    display: flex; 
                    align-items: center; 
                    gap: 12px; 
                    background: rgba(255,255,255,0.08); 
                    padding: 8px 14px; 
                    border-radius: 10px; 
                    color: #fff;
                    font-size: 0.8rem;
                    font-weight: 400;
                }
                .psm-perk i { color: #fff; font-size: 0.9rem; width: 18px; text-align: center; opacity: 0.8; }

                .psm-form-panel {
                    flex: 1;
                    padding: 40px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }
                
                .psm-header { margin-bottom: 32px; }
                .psm-title { font-size: 1.35rem; font-weight: 600; color: #0f172a; margin: 0; letter-spacing: -0.01em; }
                .psm-badge { 
                    font-size: 0.72rem; 
                    font-weight: 500; 
                    color: #04bd20; 
                    background: #f0fdf4; 
                    padding: 4px 10px; 
                    border-radius: 50px; 
                    border: 1px solid rgba(4,189,32,0.15);
                }
                
                .psm-progress-bg { height: 5px; background: #f1f5f9; border-radius: 10px; margin-top: 12px; overflow: hidden; }
                .psm-progress-bar { height: 100%; background: #04bd20; border-radius: 10px; transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1); }

                .psm-input-group { display: flex; flex-direction: column; gap: 6px; }
                .psm-input-group label { font-size: 0.8rem; font-weight: 500; color: #64748b; margin-left: 1px; }
                
                .psm-input {
                    padding: 11px 16px;
                    border: 1px solid #e2e8f0;
                    background: #fff;
                    border-radius: 12px;
                    font-size: 0.88rem;
                    font-weight: 400;
                    color: #1e293b;
                    transition: all 0.2s;
                }
                .psm-input:focus { outline: none; border-color: #04bd20; box-shadow: 0 4px 12px rgba(4,189,32,0.06); }
                .psm-input.error { border-color: #ef4444; background: #fff1f2; }
                .error-text { font-size: 0.72rem; color: #ef4444; font-weight: 500; margin-top: 1px; margin-left: 2px; }
                
                .psm-icon-input { position: relative; }
                .psm-icon-input i { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.85rem; }

                .psm-chip-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
                .psm-chip {
                    padding: 7px 14px;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    background: #fff;
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .psm-chip:hover { border-color: #04bd20; color: #04bd20; background: #f0fdf4; }
                .psm-chip.active { background: #04bd20; color: #fff; border-color: #04bd20; }

                .psm-btn-next {
                    padding: 14px 28px;
                    background: #0f172a;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-weight: 500;
                    font-size: 0.88rem;
                    transition: all 0.3s;
                    box-shadow: 0 8px 20px -5px rgba(15, 23, 42, 0.2);
                }
                .psm-btn-next:hover:not(:disabled) { background: #000; transform: translateY(-1px); box-shadow: 0 12px 25px -5px rgba(15, 23, 42, 0.3); }
                
                .psm-btn-outline {
                    padding: 14px 24px;
                    background: #fff;
                    color: #64748b;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-weight: 500;
                    font-size: 0.88rem;
                    transition: all 0.2s;
                }
                .psm-btn-outline:hover { background: #f8fafc; color: #1e293b; border-color: #cbd5e1; }

                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }

                @media (max-width: 768px) {
                    .psm-container { max-width: 500px; }
                    .psm-form-panel { padding: 35px 25px; }
                }
            `}</style>
        </div>
    );
}
