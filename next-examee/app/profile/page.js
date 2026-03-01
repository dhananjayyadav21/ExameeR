"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as GlobalUrls from "../../utils/GlobalURL"
import Footer from "../../components/Footer";
import ContentContext from '@/context/ContentContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import DriveUpload from '@/utils/DriveUpload';

import StudentLayout from "../../components/Home/StudentLayout";

export default function ProfilePage({ setProgress = () => { } }) {
    const router = useRouter();
    const context = useContext(ContentContext);
    const { userData, getUser: refreshUser, updateProfile } = context;
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        institution: '',
        course: '',
        university: '',
        semester: '',
        profile: '',
        about: '',
        phone: '',
        gender: '',
        location: ''
    });

    const [notifications, setNotifications] = useState({
        newCourse: true,
        studyMaterial: true,
        videoUploads: false
    });

    const handleNotificationToggle = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    useEffect(() => {
        const init = async () => {
            setProgress(0);
            await refreshUser();
            setProgress(100);
        };
        init();
    }, []);

    useEffect(() => {
        if (userData) {
            setUser(userData);
            setProfileData({
                firstName: userData.FirstName || '',
                lastName: userData.LastName || '',
                username: userData.Username || '',
                institution: userData.Institution || '',
                course: userData.Course || '',
                university: userData.University || '',
                semester: userData.Semester || '',
                profile: userData.Profile || '',
                about: userData.About || '',
                phone: userData.Phone || '',
                gender: userData.Gender || '',
                location: userData.Location || ''
            });
        }
    }, [userData]);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const result = await DriveUpload(file);
            if (result?.success && result?.fileId) {
                setProfileData(prev => ({ ...prev, profile: result.fileId }));
                toast.success("New avatar selected! Save to apply.");
            } else {
                toast.error("Failed to upload avatar.");
            }
        } catch (error) {
            toast.error("An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        const res = await updateProfile({
            FirstName: profileData.firstName,
            LastName: profileData.lastName,
            Username: profileData.username,
            Institution: profileData.institution,
            Course: profileData.course,
            University: profileData.university,
            Semester: profileData.semester,
            Profile: profileData.profile,
            About: profileData.about,
            Phone: profileData.phone,
            Gender: profileData.gender,
            Location: profileData.location
        });

        if (res?.success) {
            toast.success("Profile updated!");
            setIsEditing(false);
        } else {
            toast.error(res?.message || "Update failed");
        }
        setSaving(false);
    };

    return (
        <StudentLayout title="Profile">
            {!user ? (
                <div className="ps-loader container-fluid d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                    <div className="ps-spinner"></div>
                    <p className="mt-4 text-muted fw-medium animate-pulse">Building your profile...</p>
                </div>
            ) : (
                <div className="container-fluid px-0 pb-5">
                    {/* Hero Section with Cover */}
                    <div className="ps-hero mb-4">
                        <div className="ps-cover"></div>
                        <div className="ps-hero-content px-4">
                            <div className="ps-avatar-wrapper shadow-lg">
                                <img
                                    src={profileData.profile ? (profileData.profile.startsWith('http') ? profileData.profile : `https://lh3.googleusercontent.com/d/${profileData.profile}`) : "/assets/img/Avtar.jpg"}
                                    alt="Avatar"
                                    className="ps-avatar"
                                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (profileData.firstName || 'User') + "&background=04bd20&color=fff"; }}
                                />
                                {isEditing && (
                                    <label className="ps-avatar-edit">
                                        <i className={`fa-solid ${uploading ? 'fa-spinner fa-spin' : 'fa-camera'}`}></i>
                                        <input type="file" className="d-none" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                                    </label>
                                )}
                            </div>
                            <div className="ps-hero-text">
                                <h1 className="ps-user-name mb-0">
                                    {(user?.FirstName || user?.LastName) ? `${user.FirstName} ${user.LastName}`.trim() : user?.Username}
                                    {user?.isVerified && <i className="fa-solid fa-circle-check text-green ms-2 fs-5"></i>}
                                </h1>
                                <p className="ps-user-handle mb-0 text-muted">@{user?.Username}</p>
                            </div>
                            <div className="ms-auto pt-4">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`ps-btn-toggle ${isEditing ? 'ps-btn-toggle--cancel' : 'ps-btn-toggle--edit'}`}
                                >
                                    {isEditing ? (
                                        <><i className="fa-solid fa-xmark me-2"></i>Cancel</>
                                    ) : (
                                        <><i className="fa-solid fa-pen-to-square me-2"></i>Edit Profile</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 px-2">
                        {/* Profile Info Card */}
                        <div className="col-lg-4">
                            <div className="ps-card h-100">
                                <div className="ps-card-header mb-4">
                                    <h3 className="ps-card-title"><i className="fa-solid fa-address-card me-2 text-green"></i>Biographical</h3>
                                </div>
                                <div className="ps-bio-section">
                                    <label className="ps-label-small">BIO / ABOUT</label>
                                    {isEditing ? (
                                        <textarea
                                            name="about"
                                            className="ps-input-classic"
                                            rows="4"
                                            placeholder="Tell us about yourself..."
                                            value={profileData.about}
                                            onChange={handleProfileChange}
                                        />
                                    ) : (
                                        <p className="ps-text-content">{profileData.about || "No bio added yet. Tell the world who you are."}</p>
                                    )}
                                </div>
                                <div className="ps-stats-bar mt-auto pt-4 border-top">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="ps-stat">
                                            <span className="ps-label-small">MEMBER SINCE</span>
                                            <span className="ps-stat-value">{new Date(user?.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="ps-stat text-end">
                                            <span className="ps-label-small">ACCOUNT TYPE</span>
                                            <span className="ps-stat-value text-green">{user?.Role || "Student"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Details Panel */}
                        <div className="col-lg-8">
                            <div className="ps-card mb-4">
                                <div className="ps-card-header mb-4 pb-2 border-bottom">
                                    <h3 className="ps-card-title"><i className="fa-solid fa-user-gear me-2 text-green"></i>Account Details</h3>
                                </div>
                                <div className="row g-4">
                                    {[
                                        { label: 'First Name', value: profileData.firstName, icon: 'fa-signature', name: 'firstName' },
                                        { label: 'Last Name', value: profileData.lastName, icon: 'fa-signature', name: 'lastName' },
                                        { label: 'Username', value: profileData.username, icon: 'fa-at', name: 'username', disabled: true },
                                        { label: 'Institution', value: profileData.institution, icon: 'fa-building', name: 'institution' },
                                        { label: 'University', value: profileData.university, icon: 'fa-building-columns', name: 'university' },
                                        { label: 'Course', value: profileData.course, icon: 'fa-graduation-cap', name: 'course' },
                                        { label: 'Semester', value: profileData.semester, icon: 'fa-calendar-days', name: 'semester' },
                                        { label: 'Phone', value: profileData.phone, icon: 'fa-phone', name: 'phone' },
                                        { label: 'Location', value: profileData.location, icon: 'fa-location-dot', name: 'location' },
                                    ].map((field, idx) => (
                                        <div key={idx} className="col-md-6 border-bottom pb-3 border-light-subtle">
                                            <label className="ps-label-small text-muted mb-1">{field.label}</label>
                                            {isEditing && !field.disabled ? (
                                                <div className="position-relative">
                                                    <i className={`fa-solid ${field.icon} ps-field-icon`}></i>
                                                    <input
                                                        type="text"
                                                        name={field.name}
                                                        className="ps-input-modern"
                                                        value={field.value}
                                                        onChange={handleProfileChange}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="ps-field-value d-flex align-items-center gap-2">
                                                    <i className={`fa-solid ${field.icon} text-muted opacity-50`} style={{ width: '16px' }}></i>
                                                    <span className={field.value ? "text-dark fw-medium" : "text-muted italic"}>
                                                        {field.value || "Not specified"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div className="col-md-6 pb-3">
                                        <label className="ps-label-small text-muted mb-1">Gender</label>
                                        {isEditing ? (
                                            <select
                                                name="gender"
                                                className="ps-input-modern"
                                                value={profileData.gender}
                                                onChange={handleProfileChange}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        ) : (
                                            <div className="ps-field-value d-flex align-items-center gap-2">
                                                <i className="fa-solid fa-venus-mars text-muted opacity-50" style={{ width: '16px' }}></i>
                                                <span className={profileData.gender ? "text-dark fw-medium" : "text-muted italic"}>
                                                    {profileData.gender || "Not specified"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6 pb-3">
                                        <label className="ps-label-small text-muted mb-1">Email (Primary)</label>
                                        <div className="ps-field-value d-flex align-items-center gap-2 bg-light-subtle p-2 rounded-2" style={{ border: '1px dashed #e2e8f0' }}>
                                            <i className="fa-solid fa-envelope text-muted opacity-50" style={{ width: '16px' }}></i>
                                            <span className="text-muted small">{user?.Email}</span>
                                            <i className="fa-solid fa-lock ms-auto text-muted fs-7" title="Email cannot be changed"></i>
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="mt-5 d-flex gap-3">
                                        <button
                                            className="ps-btn ps-btn-primary ms-auto"
                                            onClick={handleSave}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <><span className="spinner-border spinner-border-sm me-2"></span>Saving Changes...</>
                                            ) : (
                                                <><i className="fa-solid fa-check me-2"></i>Save Final Changes</>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Settings & Preferences */}
                            <div className="ps-card">
                                <div className="ps-card-header mb-4">
                                    <h3 className="ps-card-title"><i className="fa-solid fa-sliders me-2 text-green"></i>Preferences</h3>
                                </div>
                                <div className="ps-pref-list">
                                    {[
                                        { key: 'newCourse', label: 'Push Notifications', sub: 'Instant alerts for new courses and announcements.', icon: 'fa-bell', color: '#0ea5e9' },
                                        { key: 'studyMaterial', label: 'Email Digest', sub: 'Weekly summary of new notes and study material.', icon: 'fa-envelope-open-text', color: '#16a34a' },
                                        { key: 'videoUploads', label: 'Video Alerts', sub: 'Notifications when new lectures are uploaded.', icon: 'fa-circle-play', color: '#8b5cf6' },
                                    ].map((pref) => (
                                        <div key={pref.key} className="ps-pref-item">
                                            <div className="ps-pref-icon" style={{ backgroundColor: `${pref.color}10`, color: pref.color }}>
                                                <i className={`fa-solid ${pref.icon}`}></i>
                                            </div>
                                            <div className="ps-pref-text">
                                                <h4 className="ps-pref-title mb-0">{pref.label}</h4>
                                                <p className="ps-pref-sub text-muted mb-0">{pref.sub}</p>
                                            </div>
                                            <div className="ps-pref-action ms-auto">
                                                <div className="form-check form-switch ps-0 fs-4">
                                                    <input
                                                        className="form-check-input ps-switch"
                                                        type="checkbox"
                                                        role="switch"
                                                        checked={notifications[pref.key]}
                                                        onChange={() => handleNotificationToggle(pref.key)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="ps-btn-simple mt-4 w-100" onClick={() => toast.success('Preferences updated locally')}>
                                    Update My Preferences
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .ps-loader { animation: fadeIn 0.5s ease; }
                .ps-spinner { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top-color: #04bd20; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                
                .ps-hero { position: relative; border-radius: 20px; overflow: hidden; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                .ps-cover { height: 140px; background: linear-gradient(135deg, #04bd20 0%, #03a61c 50%, #10b981 100%); }
                .ps-hero-content { display: flex; align-items: flex-end; gap: 20px; margin-top: -50px; padding-bottom: 24px; }
                
                .ps-avatar-wrapper { position: relative; width: 120px; height: 120px; border-radius: 24px; background: #fff; padding: 5px; z-index: 2; border: 1px solid #e2e8f0; }
                .ps-avatar { width: 100%; height: 100%; border-radius: 20px; object-fit: cover; }
                .ps-avatar-edit { position: absolute; bottom: -8px; right: -8px; width: 36px; height: 36px; border-radius: 10px; border: 3px solid #fff; background: #0ea5e9; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                .ps-avatar-edit:hover { transform: scale(1.1); }
                
                .ps-hero-text { margin-bottom: 8px; }
                .ps-user-name { font-size: 1.6rem; font-weight: 600; color: #0f172a; letter-spacing: -0.01em; }
                .ps-user-handle { font-size: 0.9rem; font-weight: 400; color: #64748b; }
                
                .ps-btn-toggle { border: none; border-radius: 12px; padding: 10px 20px; font-weight: 500; font-size: 0.85rem; display: flex; align-items: center; transition: all 0.2s; }
                .ps-btn-toggle--edit { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }
                .ps-btn-toggle--edit:hover { background: #e2e8f0; color: #0f172a; }
                .ps-btn-toggle--cancel { background: #fef2f2; color: #ef4444; }
                .ps-btn-toggle--cancel:hover { background: #fee2e2; }
                
                .ps-card { background: #fff; border-radius: 20px; padding: 24px; border: 1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
                .ps-card-title { font-size: 1rem; font-weight: 600; color: #0f172a; margin: 0; }
                .ps-label-small { display: block; font-size: 0.68rem; font-weight: 600; color: #94a3b8; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 4px; }
                
                .ps-text-content { font-size: 0.88rem; font-weight: 300; color: #475569; line-height: 1.6; }
                
                .ps-input-classic { width: 100%; padding: 12px 14px; border-radius: 12px; border: 2px solid #f1f5f9; background: #f8fafc; font-size: 0.88rem; transition: all 0.2s; color: #334155; font-weight: 400; }
                .ps-input-classic:focus { outline: none; border-color: #04bd20; background: #fff; }
                
                .ps-input-modern { width: 100%; padding: 8px 0; border: none; border-bottom: 2px solid #f1f5f9; background: transparent; font-size: 0.88rem; font-weight: 400; color: #0f172a; transition: border-color 0.2s; }
                .ps-input-modern:focus { outline: none; border-color: #04bd20; }
                .ps-field-icon { position: absolute; right: 0; top: 10px; color: #cbd5e1; font-size: 0.8rem; }
                .ps-field-value span { font-size: 0.88rem; font-weight: 400; }
                
                .ps-stat-value { font-size: 0.88rem; font-weight: 600; color: #0f172a; }
                
                .ps-btn { display: inline-flex; align-items: center; border: none; border-radius: 12px; padding: 12px 24px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .ps-btn-primary { background: linear-gradient(135deg, #04bd20 0%, #03a61c 100%); color: #fff; box-shadow: 0 8px 16px -4px rgba(4,189,32,0.3); }
                .ps-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 24px -4px rgba(4,189,32,0.4); }
                
                .ps-btn-simple { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px; color: #475569; font-weight: 600; font-size: 0.8rem; transition: all 0.2s; }
                
                .ps-pref-item { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f8fafc; }
                .ps-pref-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
                .ps-pref-title { font-size: 0.9rem; font-weight: 600; color: #0f172a; }
                .ps-pref-sub { font-size: 0.78rem; font-weight: 300; }
                
                .ps-switch { width: 2.6em !important; height: 1.4em; border-radius: 20px; cursor: pointer; border: 2px solid #e2e8f0 !important; }
                .ps-switch:checked { background-color: #04bd20; border-color: #04bd20 !important; }
                .ps-switch:focus { box-shadow: none; }
                
                @media (max-width: 768px) {
                    .ps-cover { height: 100px; }
                    .ps-hero-content { flex-direction: column; align-items: center; text-align: center; margin-top: -50px; }
                    .ps-hero-text { margin-bottom: 16px; }
                    .ps-avatar-wrapper { width: 120px; height: 120px; border-radius: 20px; }
                    .ps-btn-toggle { width: 100%; justify-content: center; }
                    .ps-hero-text h1 { font-size: 1.5rem; }
                }
            `}</style>
        </StudentLayout>
    );
}
