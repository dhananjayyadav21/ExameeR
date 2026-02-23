"use client";
import React from 'react';

export default function SettingsPage() {
    return (
        <section id="settings" className="p-0">
            <div className="mb-4">
                <h1 className="h4 fw-bold text-dark">Account Settings</h1>
                <p className="text-secondary">Manage your profile, security, and preferences.</p>
            </div>

            <div className="container-fluid p-0">
                {/* Profile Settings */}
                <div className="card border-0 shadow-sm rounded-4 mb-4" style={{ background: '#1a1a1a' }}>
                    <div className="card-body p-4 text-white">
                        <h2 className="h5 fw-bold mb-4 border-bottom border-secondary pb-3">Profile Settings</h2>

                        <div className="d-flex align-items-center gap-4 mb-4">
                            <div className="position-relative">
                                <img
                                    src="https://wallpapers.com/images/hd/professional-profile-pictures-1350-x-1080-sizz773bu8k11plw.jpg"
                                    alt="Profile"
                                    className="rounded-circle border border-secondary"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                                <button className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle" style={{ width: '32px', height: '32px' }}>
                                    <i className="fa-solid fa-camera"></i>
                                </button>
                            </div>
                            <div>
                                <h6 className="fw-bold mb-1">Profile Picture</h6>
                                <p className="text-muted small mb-2">PNG, JPG or GIF. Max 2MB.</p>
                                <button className="btn btn-sm btn-outline-danger">Remove</button>
                            </div>
                        </div>

                        <form className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label small text-muted">First Name</label>
                                <input type="text" className="form-control form-control-dark bg-dark text-white border-secondary" defaultValue="Instructor" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small text-muted">Last Name</label>
                                <input type="text" className="form-control form-control-dark bg-dark text-white border-secondary" defaultValue="User" />
                            </div>
                            <div className="col-12">
                                <label className="form-label small text-muted">Email Address</label>
                                <input type="email" className="form-control form-control-dark bg-dark text-white border-secondary" defaultValue="instructor@examee.com" readOnly />
                            </div>
                            <div className="col-12">
                                <label className="form-label small text-muted">Institution</label>
                                <input type="text" className="form-control form-control-dark bg-dark text-white border-secondary" defaultValue="Examee Education" />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="card border-0 shadow-sm rounded-4 mb-4" style={{ background: '#1a1a1a' }}>
                    <div className="card-body p-4 text-white">
                        <h2 className="h5 fw-bold mb-4 border-bottom border-secondary pb-3">Security Settings</h2>
                        <form className="row g-3">
                            <div className="col-12">
                                <label className="form-label small text-muted">Current Password</label>
                                <input type="password" architectural className="form-control form-control-dark bg-dark text-white border-secondary" placeholder="••••••••" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small text-muted">New Password</label>
                                <input type="password" architectural className="form-control form-control-dark bg-dark text-white border-secondary" placeholder="••••••••" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small text-muted">Confirm New Password</label>
                                <input type="password" architectural className="form-control form-control-dark bg-dark text-white border-secondary" placeholder="••••••••" />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="card border-0 shadow-sm rounded-4 mb-4" style={{ background: '#1a1a1a' }}>
                    <div className="card-body p-4 text-white">
                        <h2 className="h5 fw-bold mb-4 border-bottom border-secondary pb-3">Notification Preferences</h2>

                        {[
                            { id: 'newCourse', title: 'New Course Notifications', desc: 'Receive notifications when new courses are added' },
                            { id: 'notesUpdate', title: 'Notes Updates', desc: 'Get notified about new study materials' },
                            { id: 'videoAlert', title: 'Video Lecture Alerts', desc: 'Receive alerts for new video content' }
                        ].map((pref, i) => (
                            <div key={pref.id} className={`d-flex justify-content-between align-items-center py-3 ${i < 2 ? 'border-bottom border-secondary' : ''}`}>
                                <div>
                                    <h6 className="fw-bold mb-1">{pref.title}</h6>
                                    <p className="text-muted small mb-0">{pref.desc}</p>
                                </div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id={pref.id} defaultChecked />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save and Cancel Buttons */}
                <div className="d-flex justify-content-end gap-3 mt-4">
                    <button className="btn btn-outline-secondary px-4">Reset</button>
                    <button className="btn btn-primary px-4">Update Profile</button>
                </div>
            </div>

            <style jsx>{`
                .form-control-dark:focus {
                    background-color: #2a2a2a;
                    border-color: #0d6efd;
                    color: white;
                    box-shadow: none;
                }
            `}</style>
        </section>
    );
}
