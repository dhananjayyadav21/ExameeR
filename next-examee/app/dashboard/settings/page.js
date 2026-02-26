"use client";
import React, { useState, useContext, useEffect } from 'react';
import ContentContext from '@/context/ContentContext';
import { toast } from 'react-toastify';
import DriveUpload from '@/utils/DriveUpload';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const context = useContext(ContentContext);
    const { userData, getUser, updateProfile, updatePassword, deleteAccount } = context;
    const router = useRouter();

    const [notifications, setNotifications] = useState({ newCourse: true, notesUpdate: true, videoAlert: true });
    const [profileData, setProfileData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        institution: '',
        profile: '',
        about: '',
        phone: '',
        gender: '',
        location: ''
    });
    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            await getUser();
            setLoading(false);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (userData) {
            setProfileData({
                username: userData.Username || '',
                firstName: userData.FirstName || '',
                lastName: userData.LastName || '',
                institution: userData.Institution || '',
                profile: userData.Profile || 'https://wallpapers.com/images/hd/professional-profile-pictures-1350-x-1080-sizz773bu8k11plw.jpg',
                about: userData.About || '',
                phone: userData.Phone || '',
                gender: userData.Gender || '',
                location: userData.Location || ''
            });
            if (userData.NotificationPrefs) {
                setNotifications(userData.NotificationPrefs);
            }
        }
    }, [userData]);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const result = await DriveUpload(file);
            if (result?.success && result?.fileId) {
                setProfileData(prev => ({ ...prev, profile: result.fileId }));
                toast.success("Avatar uploaded successfully!");
            } else {
                toast.error("Failed to upload avatar.");
            }
        } catch (error) {
            toast.error("An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        console.log("SETTINGS_PAGE_SAVE_TRIGGERED", profileData);
        setSaving(true);
        const res = await updateProfile({
            Username: profileData.username,
            FirstName: profileData.firstName,
            LastName: profileData.lastName,
            Institution: profileData.institution,
            Profile: profileData.profile,
            NotificationPrefs: notifications,
            About: profileData.about,
            Phone: profileData.phone,
            Gender: profileData.gender,
            Location: profileData.location
        });
        if (res?.success) {
            toast.success(res.message || "Profile updated successfully!");
        } else {
            toast.error(res?.message || "Failed to update profile.");
        }
        setSaving(false);
    };

    const handleUpdatePassword = async () => {
        if (!passwords.current || !passwords.next || !passwords.confirm) {
            return toast.warning("All password fields are required");
        }
        if (passwords.next !== passwords.confirm) {
            return toast.error("New passwords do not match");
        }
        if (passwords.next.length < 8) {
            return toast.warning("Password must be at least 8 characters");
        }

        setSaving(true);
        const res = await updatePassword({
            currentPassword: passwords.current,
            newPassword: passwords.next
        });
        if (res?.success) {
            toast.success("Password updated successfully!");
            setPasswords({ current: '', next: '', confirm: '' });
        } else {
            toast.error(res?.message || "Failed to update password.");
        }
        setSaving(false);
    };

    const handleDeleteAccount = async () => {
        const res = await deleteAccount();
        if (res?.success) {
            toast.success("Account deleted successfully");
            localStorage.removeItem('token');
            router.push('/auth/login');
        } else {
            toast.error(res?.message || "Failed to delete account");
        }
        setShowDeleteModal(false);
    };

    const toggleNotif = (key) => setNotifications(p => ({ ...p, [key]: !p[key] }));

    const notifPrefs = [
        { id: 'newCourse', label: 'New Course Notifications', desc: 'Get notified when new courses are published', icon: 'fa-graduation-cap', color: '#0ea5e9' },
        { id: 'notesUpdate', label: 'Study Material Alerts', desc: 'Receive alerts when new notes or PDFs are added', icon: 'fa-file-pdf', color: '#04bd20' },
        { id: 'videoAlert', label: 'Video Lecture Uploads', desc: 'Be notified of newly uploaded video lectures', icon: 'fa-circle-play', color: '#8b5cf6' },
    ];

    if (loading && !userData) {
        return <div className="p-5 text-center">Loading settings...</div>;
    }

    return (
        <section className="st-page">
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                heading="Delete Account?"
                subHeading="This action is permanent and cannot be undone. All your data will be cleared."
            />

            {/* Header */}
            <div className="st-header">
                <div>
                    <h1 className="st-title">
                        {userData?.FirstName ? `${userData.FirstName}'s Settings` : 'Account Settings'}
                    </h1>
                    <p className="st-sub">Manage your profile, security, and notification preferences</p>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column */}
                <div className="col-lg-8">

                    {/* Profile Card */}
                    <div className="st-card mb-4">
                        <div className="st-card-head">
                            <div className="st-card-icon" style={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9' }}>
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <div>
                                <div className="st-card-title">Profile Information</div>
                                <div className="st-card-sub">Update your public profile details</div>
                            </div>
                        </div>

                        {/* Avatar row */}
                        <div className="st-avatar-row">
                            <div className="st-avatar-wrap">
                                {uploading ? (
                                    <div className="st-avatar st-avatar-loading d-flex align-items-center justify-content-center">
                                        <div className="spinner-border spinner-border-sm text-primary"></div>
                                    </div>
                                ) : (
                                    <img
                                        src={profileData.profile ? (profileData.profile.startsWith('http') ? profileData.profile : `https://lh3.googleusercontent.com/d/${profileData.profile}`) : "/assets/img/Avtar.jpg"}
                                        alt="Profile"
                                        className="st-avatar"
                                    />
                                )}
                                <input type="file" id="avatarInput" hidden onChange={handleAvatarUpload} accept="image/*" />
                                <label htmlFor="avatarInput" className="st-avatar-cam"><i className="fa-solid fa-camera"></i></label>
                            </div>
                            <div>
                                <div className="st-avatar-label">Profile Picture</div>
                                <div className="st-avatar-hint">PNG, JPG or GIF · Max 2MB</div>
                                <button className="st-remove-btn" onClick={() => setProfileData({ ...profileData, profile: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' })}>Remove Photo</button>
                            </div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-12">
                                <label className="st-label">Username <span className="st-readonly-tag">Public ID</span></label>
                                <div className="st-input-wrap">
                                    <span className="st-input-icon"><i className="fa-solid fa-at"></i></span>
                                    <input type="text" name="username" className="st-input" value={profileData.username} onChange={handleProfileChange} placeholder="johndoe" />
                                </div>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="st-label">First Name</label>
                                <div className="st-input-wrap">
                                    <span className="st-input-icon"><i className="fa-solid fa-user"></i></span>
                                    <input type="text" name="firstName" className="st-input" value={profileData.firstName} onChange={handleProfileChange} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="st-label">Last Name</label>
                                <div className="st-input-wrap">
                                    <span className="st-input-icon"><i className="fa-solid fa-user"></i></span>
                                    <input type="text" name="lastName" className="st-input" value={profileData.lastName} onChange={handleProfileChange} />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="st-label">Email Address <span className="st-readonly-tag">Read only</span></label>
                                <div className="st-input-wrap">
                                    <span className="st-input-icon"><i className="fa-solid fa-envelope"></i></span>
                                    <input type="email" className="st-input" value={userData?.Email || ''} readOnly style={{ background: '#f8fafc', color: '#94a3b8', cursor: 'not-allowed' }} />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="st-label">Institution / Organization</label>
                                <div className="st-input-wrap">
                                    <span className="st-input-icon"><i className="fa-solid fa-building"></i></span>
                                    <input type="text" name="institution" className="st-input" value={profileData.institution} onChange={handleProfileChange} />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="st-label">Bio / About</label>
                                <div className="st-input-wrap">
                                    <span className="st-input-icon"><i className="fa-solid fa-pen-nib"></i></span>
                                    <textarea name="about" className="st-input" rows="3" value={profileData.about} onChange={handleProfileChange} placeholder="Tell us about yourself..." style={{ height: 'auto', paddingTop: '12px' }}></textarea>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="st-label">Phone Number</label>
                                <div className="st-input-wrap">
                                    <span className="st-input-icon"><i className="fa-solid fa-phone"></i></span>
                                    <input type="text" name="phone" className="st-input" value={profileData.phone} onChange={handleProfileChange} placeholder="+91 00000 00000" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="st-label">Gender</label>
                                <div className="st-input-wrap">
                                    <span className="st-input-icon"><i className="fa-solid fa-venus-mars"></i></span>
                                    <select name="gender" className="st-input" value={profileData.gender} onChange={handleProfileChange}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="st-label">Location</label>
                                <div className="st-input-wrap">
                                    <span className="st-input-icon"><i className="fa-solid fa-location-dot"></i></span>
                                    <input type="text" name="location" className="st-input" value={profileData.location} onChange={handleProfileChange} placeholder="City, Country" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 d-flex justify-content-end">
                            <button className="st-save-btn" onClick={handleSaveProfile} disabled={saving}>
                                {saving ? 'Saving...' : <><i className="fa-solid fa-floppy-disk me-2"></i>Save Profile</>}
                            </button>
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="st-card mb-4">
                        <div className="st-card-head">
                            <div className="st-card-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                <i className="fa-solid fa-shield-halved"></i>
                            </div>
                            <div>
                                <div className="st-card-title">Password &amp; Security</div>
                                <div className="st-card-sub">Set a unique password to protect your account</div>
                            </div>
                        </div>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="st-label">Current Password</label>
                                <div className="st-input-wrap">
                                    <span className="st-input-icon"><i className="fa-solid fa-lock"></i></span>
                                    <input type="password" name="current" className="st-input" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} placeholder="••••••••" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="st-label">New Password</label>
                                <div className="st-input-wrap">
                                    <span className="st-input-icon"><i className="fa-solid fa-key"></i></span>
                                    <input type="password" name="next" className="st-input" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} placeholder="••••••••" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="st-label">Confirm New Password</label>
                                <div className="st-input-wrap">
                                    <span className="st-input-icon"><i className="fa-solid fa-key"></i></span>
                                    <input type="password" name="confirm" className="st-input" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="••••••••" />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="st-password-tips">
                                    <span className="st-tip"><i className={`fa-solid ${passwords.next.length >= 8 ? 'fa-check' : 'fa-circle'} me-1`} style={{ color: passwords.next.length >= 8 ? '#04bd20' : '#94a3b8' }}></i>Min 8 characters</span>
                                    <span className="st-tip text-muted">Use a strong password to stay safe</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 d-flex justify-content-end">
                            <button className="st-save-btn btn-danger" onClick={handleUpdatePassword} disabled={saving} style={{ background: 'linear-gradient(135deg,#f43f5e,#e11d48)' }}>
                                {saving ? 'Updating...' : <><i className="fa-solid fa-key me-2"></i>Update Password</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-lg-4">

                    {/* Notifications Card */}
                    <div className="st-card mb-4">
                        <div className="st-card-head">
                            <div className="st-card-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                                <i className="fa-solid fa-bell"></i>
                            </div>
                            <div>
                                <div className="st-card-title">Notifications</div>
                                <div className="st-card-sub">Control what alerts you receive</div>
                            </div>
                        </div>
                        <div className="st-notif-list">
                            {notifPrefs.map((pref, i) => (
                                <div key={pref.id} className={`st-notif-item ${i < notifPrefs.length - 1 ? 'st-notif-border' : ''}`}>
                                    <div className="st-notif-icon" style={{ background: `${pref.color}18`, color: pref.color }}>
                                        <i className={`fa-solid ${pref.icon}`}></i>
                                    </div>
                                    <div className="st-notif-body">
                                        <div className="st-notif-label">{pref.label}</div>
                                        <div className="st-notif-desc">{pref.desc}</div>
                                    </div>
                                    <label className="st-toggle-wrap">
                                        <input type="checkbox" className="st-toggle-input" checked={notifications[pref.id]} onChange={() => toggleNotif(pref.id)} />
                                        <span className="st-toggle" style={notifications[pref.id] ? { background: pref.color } : {}}></span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button className="st-save-btn w-100 mt-3" onClick={handleSaveProfile} disabled={saving}>
                            Save Preferences
                        </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="st-card st-danger-card">
                        <div className="st-danger-head">
                            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ef4444' }}></i>
                            <span>Danger Zone</span>
                        </div>
                        <p className="st-danger-desc">Permanently delete your account and all associated data. This action cannot be undone.</p>
                        <button className="st-danger-btn" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="st-footer">
                <button className="st-reset-btn" onClick={() => getUser()}>Refersh Info</button>
            </div>

            <style jsx>{`
                .st-page { min-height: 100vh; }
                .st-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
                .st-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0; }
                .st-sub { font-size: 0.8rem; color: #94a3b8; margin: 3px 0 0; }
                .st-save-toast { background: rgba(4,189,32,0.1); color: #04bd20; border: 1px solid rgba(4,189,32,0.2); border-radius: 10px; padding: 10px 18px; font-size: 0.82rem; font-weight: 600; display: flex; align-items: center; animation: fadeIn 0.3s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

                .st-card { background: white; border-radius: 18px; padding: 24px; border: 1px solid #f1f5f9; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
                .st-card-head { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid #f1f5f9; }
                .st-card-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
                .st-card-title { font-size: 0.9rem; font-weight: 700; color: #1e293b; }
                .st-card-sub { font-size: 0.75rem; color: #94a3b8; margin-top: 2px; }

                /* Avatar */
                .st-avatar-row { display: flex; align-items: center; gap: 16px; margin-bottom: 22px; padding: 16px; background: #f8fafc; border-radius: 12px; }
                .st-avatar-wrap { position: relative; flex-shrink: 0; }
                .st-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .st-avatar-cam { position: absolute; bottom: 0; right: 0; width: 28px; height: 28px; background: #0ea5e9; color: white; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; cursor: pointer; }
                .st-avatar-label { font-size: 0.85rem; font-weight: 700; color: #1e293b; }
                .st-avatar-hint { font-size: 0.72rem; color: #94a3b8; margin: 2px 0 8px; }
                .st-remove-btn { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #ef4444; font-size: 0.75rem; font-weight: 600; padding: 4px 12px; border-radius: 7px; cursor: pointer; transition: all 0.2s; }
                .st-remove-btn:hover { background: rgba(239,68,68,0.15); }

                /* Inputs */
                .st-label { font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
                .st-readonly-tag { background: #f1f5f9; color: #94a3b8; font-size: 0.68rem; font-weight: 600; padding: 2px 7px; border-radius: 5px; }
                .st-input-wrap { position: relative; }
                .st-input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.8rem; pointer-events: none; }
                .st-input { width: 100%; padding: 10px 13px 10px 36px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.875rem; color: #0f172a; background: #f8fafc; outline: none; transition: all 0.2s; font-family: inherit; }
                .st-input:focus { border-color: #0ea5e9; background: white; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }

                /* Password tips */
                .st-password-tips { display: flex; flex-wrap: wrap; gap: 10px; }
                .st-tip { font-size: 0.75rem; color: #64748b; font-weight: 500; }

                /* Notifications */
                .st-notif-list { display: flex; flex-direction: column; gap: 4px; }
                .st-notif-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; }
                .st-notif-border { border-bottom: 1px solid #f1f5f9; }
                .st-notif-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0; }
                .st-notif-body { flex: 1; min-width: 0; }
                .st-notif-label { font-size: 0.82rem; font-weight: 700; color: #1e293b; }
                .st-notif-desc { font-size: 0.7rem; color: #94a3b8; margin-top: 1px; }
                .st-toggle-wrap { cursor: pointer; flex-shrink: 0; }
                .st-toggle-input { display: none; }
                .st-toggle { display: block; width: 40px; height: 22px; background: #e2e8f0; border-radius: 50px; position: relative; transition: background 0.2s; }
                .st-toggle::after { content: ''; position: absolute; left: 3px; top: 3px; width: 16px; height: 16px; background: white; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
                .st-toggle-input:checked ~ .st-toggle::after { transform: translateX(18px); }

                /* Danger */
                .st-danger-card { border-color: rgba(239,68,68,0.15) !important; }
                .st-danger-head { display: flex; align-items: center; gap: 8px; font-size: 0.88rem; font-weight: 700; color: #ef4444; margin-bottom: 10px; }
                .st-danger-desc { font-size: 0.78rem; color: #94a3b8; margin-bottom: 14px; line-height: 1.5; }
                .st-danger-btn { width: 100%; padding: 10px; background: rgba(239,68,68,0.07); border: 1.5px solid rgba(239,68,68,0.2); color: #ef4444; font-size: 0.85rem; font-weight: 700; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
                .st-danger-btn:hover { background: rgba(239,68,68,0.12); }

                /* Footer */
                .st-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #f1f5f9; }
                .st-reset-btn { padding: 11px 24px; border-radius: 11px; border: 1.5px solid #e2e8f0; background: transparent; color: #64748b; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .st-reset-btn:hover { border-color: #94a3b8; background: #f8fafc; }
                .st-save-btn { padding: 11px 28px; border-radius: 11px; border: none; background: linear-gradient(135deg,#0ea5e9,#6366f1); color: white; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(14,165,233,0.3); }
                .st-save-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(14,165,233,0.45); }
            `}</style>
        </section>
    );
}
