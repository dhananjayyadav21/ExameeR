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
        profile: '',
        about: '',
        phone: '',
        gender: '',
        location: ''
    });

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
                <div className="text-center py-5 my-5">
                    <div className="spinner-grow me-2 text-success" role="status"></div>
                    <div className="spinner-grow me-2 text-success" role="status"></div>
                    <div className="spinner-grow text-success" role="status"></div>
                    <p className="text-muted mt-4 fw-medium">Fetching your profile details...</p>
                </div>
            ) : (
                <div className="container-fluid px-0">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div>
                            <h2 className="fw-black mb-1" style={{ fontSize: '1.8rem' }}>My Account</h2>
                            <p className="text-muted small mb-0">Manage your profile and account settings</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`btn ${isEditing ? 'btn-outline-danger' : 'btn-green'} rounded-pill px-4 shadow-sm`}
                            style={!isEditing ? { background: '#04bd20', color: '#fff', border: 'none' } : {}}
                        >
                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </button>
                    </div>

                    <div className="row g-4">
                        {/* Profile Card */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 text-center p-4 p-lg-5 h-100">
                                {/* Avatar */}
                                <div className="position-relative d-inline-block mx-auto mb-3">
                                    <div className="position-relative">
                                        <img
                                            src={profileData.profile ? (profileData.profile.startsWith('http') ? profileData.profile : `https://lh3.googleusercontent.com/d/${profileData.profile}`) : "/assets/img/Avtar.jpg"}
                                            alt="Avatar"
                                            className="rounded-circle shadow-sm"
                                            style={{ width: '110px', height: '110px', objectFit: 'cover', border: '4px solid #04bd20', opacity: uploading ? 0.5 : 1 }}
                                            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (profileData.firstName || 'User') + "&background=04bd20&color=fff"; }}
                                        />
                                        {isEditing && (
                                            <label className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center cursor-pointer"
                                                style={{ width: '32px', height: '32px', background: '#0ea5e9', border: '2px solid #fff', cursor: 'pointer' }}>
                                                <i className={`fa-solid ${uploading ? 'fa-spinner fa-spin' : 'fa-camera'} text-white`} style={{ fontSize: '0.8rem' }}></i>
                                                <input type="file" className="d-none" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                                            </label>
                                        )}
                                        {!isEditing && (
                                            <span className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: '28px', height: '28px', background: '#04bd20', border: '2px solid #fff' }}>
                                                <i className="fa-solid fa-check text-white" style={{ fontSize: '0.65rem' }}></i>
                                            </span>
                                        )}
                                    </div>
                                    {uploading && <div className="small text-green mt-1 fw-medium">Uploading...</div>}
                                </div>

                                <h5 className="fw-semibold text-dark mb-1" style={{ fontSize: '1.1rem' }}>
                                    {(user?.FirstName || user?.LastName) ? `${user.FirstName} ${user.LastName}`.trim() : user?.Username}
                                </h5>
                                <p className="text-muted small mb-3">@{user?.Username}</p>

                                {user?.isVerified ? (
                                    <span className="badge rounded-pill mx-auto mb-3 px-3 py-2" style={{ background: 'rgba(4,189,32,0.12)', color: '#039419', fontSize: '0.82rem' }}>
                                        <i className="fas fa-check-circle me-1"></i> Verified Account
                                    </span>
                                ) : (
                                    <span className="badge bg-danger-subtle text-danger rounded-pill mx-auto mb-3 px-3 py-2">
                                        <i className="fas fa-times-circle me-1"></i> Not Verified
                                    </span>
                                )}

                                <hr className="my-3 opacity-50" />

                                <div className="text-start small">
                                    <div className="mb-3">
                                        <p className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>Role</p>
                                        <p className="fw-medium text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                                            <i className="fa-solid fa-user-tag text-green"></i>
                                            {user?.Role || 'Student'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>About</p>
                                        <p className="text-dark mb-0" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>{user?.About || 'One lesson at a time, one step closer to greatness.'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Panel */}
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 mb-4">
                                <h6 className="fw-semibold text-dark mb-4 d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                                    <i className="fa-solid fa-circle-info text-green"></i> Account Information
                                </h6>
                                <div className="row g-3">
                                    {[
                                        { label: 'First Name', value: profileData.firstName, icon: 'fa-user', name: 'firstName' },
                                        { label: 'Last Name', value: profileData.lastName, icon: 'fa-user', name: 'lastName' },
                                        { label: 'Username', value: profileData.username, icon: 'fa-at', name: 'username' },
                                        { label: 'Institution', value: profileData.institution, icon: 'fa-building', name: 'institution' },
                                        { label: 'Phone Number', value: profileData.phone, icon: 'fa-phone', name: 'phone' },
                                        { label: 'Location', value: profileData.location, icon: 'fa-location-dot', name: 'location' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="col-sm-6">
                                            <div className="bg-light rounded-3 p-3 transition-all">
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <i className={`fa-solid ${item.icon} text-green`} style={{ fontSize: '0.8rem' }}></i>
                                                    <span className="text-muted fw-semibold text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>{item.label}</span>
                                                </div>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name={item.name}
                                                        className="form-control form-control-sm border-0 bg-white shadow-sm"
                                                        value={item.value}
                                                        onChange={handleProfileChange}
                                                    />
                                                ) : (
                                                    <p className="fw-medium text-dark mb-0" style={{ fontSize: '0.85rem' }}>{item.value || 'Not Set'}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* About field is special as it's a textarea */}
                                    <div className="col-12">
                                        <div className="bg-light rounded-3 p-3">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <i className="fa-solid fa-pen-nib text-green" style={{ fontSize: '0.8rem' }}></i>
                                                <span className="text-muted fw-semibold text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>About / Bio</span>
                                            </div>
                                            {isEditing ? (
                                                <textarea
                                                    name="about"
                                                    className="form-control form-control-sm border-0 bg-white shadow-sm"
                                                    rows="3"
                                                    value={profileData.about}
                                                    onChange={handleProfileChange}
                                                />
                                            ) : (
                                                <p className="text-dark mb-0" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>{profileData.about || 'One lesson at a time.'}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Gender is a select */}
                                    <div className="col-sm-6">
                                        <div className="bg-light rounded-3 p-3">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <i className="fa-solid fa-venus-mars text-green" style={{ fontSize: '0.8rem' }}></i>
                                                <span className="text-muted fw-semibold text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>Gender</span>
                                            </div>
                                            {isEditing ? (
                                                <select
                                                    name="gender"
                                                    className="form-select form-select-sm border-0 bg-white shadow-sm"
                                                    value={profileData.gender}
                                                    onChange={handleProfileChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            ) : (
                                                <p className="fw-medium text-dark mb-0" style={{ fontSize: '0.85rem' }}>{profileData.gender || 'Not Set'}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Read-only fields */}
                                    {[
                                        { label: 'Email Address', value: user?.Email, icon: 'fa-envelope' },
                                        { label: 'Account Role', value: user?.Role || 'Student', icon: 'fa-user-shield' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="col-sm-6">
                                            <div className="bg-light rounded-3 p-3" style={{ opacity: 0.8 }}>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <i className={`fa-solid ${item.icon} text-muted`} style={{ fontSize: '0.8rem' }}></i>
                                                    <span className="text-muted fw-semibold text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>{item.label}</span>
                                                </div>
                                                <p className="fw-medium text-muted mb-0" style={{ fontSize: '0.85rem' }}>{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {isEditing && (
                                    <div className="mt-4 d-flex justify-content-end">
                                        <button
                                            className="btn btn-green rounded-pill px-5 fw-bold shadow-sm"
                                            style={{ background: '#04bd20', color: '#fff', border: 'none' }}
                                            onClick={handleSave}
                                            disabled={saving}
                                        >
                                            {saving ? 'Saving...' : 'Save Profile Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Quick Links */}
                            <div className="card border-0 shadow-sm rounded-4 p-4">
                                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-rocket text-green"></i> Quick Links
                                </h6>
                                <div className="row g-3">
                                    {[
                                        { href: '/myLearning', icon: 'fa-graduation-cap', label: 'My Learning', color: 'success' },
                                        { href: '/notes', icon: 'fa-file-lines', label: 'Browse Notes', color: 'primary' },
                                        { href: '/video', icon: 'fa-circle-play', label: 'Video Lectures', color: 'warning' },
                                        { href: '/cource', icon: 'fa-book', label: 'All Courses', color: 'info' },
                                    ].map((link, idx) => (
                                        <div key={idx} className="col-6 col-md-3">
                                            <a href={link.href} className="card border-0 bg-light text-decoration-none rounded-3 p-3 text-center d-block quick-link">
                                                <i className={`fa-solid ${link.icon} text-${link.color} fs-4 mb-2 d-block`}></i>
                                                <span className="small fw-medium text-dark">{link.label}</span>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </StudentLayout>
    );
}

