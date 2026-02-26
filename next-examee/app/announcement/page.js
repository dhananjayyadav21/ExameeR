"use client";
import React, { useContext, useEffect, useState } from "react";
import ContentContext from '../../context/ContentContext';
import { toast } from 'react-toastify';

export default function AnnouncementPage() {
    const context = useContext(ContentContext);
    const { getAllUser, allUser, sendAnnounceMent } = context;

    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [emailBody, setEmailBody] = useState("");
    const [subject, setSubject] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => { getAllUser(); }, []);

    useEffect(() => {
        setUsers(allUser || []);
        setSelectedUserIds([]);
        setSelectAll(false);
    }, [allUser]);

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUserIds([]);
        } else {
            setSelectedUserIds(users.map((u) => u._id));
        }
        setSelectAll(!selectAll);
    };

    const handleUserSelect = (id) => {
        setSelectedUserIds((prev) =>
            prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
        );
    };

    const handleSend = async () => {
        if (selectedUserIds.length === 0) { toast.warning("Please select at least one recipient."); return; }
        if (!subject.trim()) { toast.warning("Subject cannot be empty."); return; }
        if (!emailBody.trim()) { toast.warning("Message body cannot be empty."); return; }

        setLoading(true);
        try {
            const res = await sendAnnounceMent({ subject, emailBody, userIds: selectedUserIds });
            if (res.success) {
                toast.success("Announcement broadcasted successfully!");
                setSubject(""); setEmailBody(""); setSelectedUserIds([]); setSelectAll(false);
            } else {
                toast.error(res.message || "Failed to send announcement.");
            }
        } catch (err) {
            toast.error("An error occurred while sending.");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user?.Email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.Username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="bg-light min-vh-100">
            {/* Announcement Banner - Dark Theme */}
            <div className="position-relative overflow-hidden py-5" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)' }}>
                <div className="position-absolute top-0 end-0 w-50 h-100 opacity-10 d-none d-lg-block">
                    <i className="fa-solid fa-bullhorn position-absolute" style={{ fontSize: '20rem', right: '-5rem', top: '-2rem', transform: 'rotate(-10deg)' }}></i>
                </div>
                <div className="container px-4 position-relative z-1 py-lg-4">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <nav aria-label="breadcrumb" className="mb-4">
                                <ol className="breadcrumb small text-uppercase fw-semibold mb-0" style={{ letterSpacing: '0.1em', fontSize: '0.7rem' }}>
                                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.6)' }}>Home</a></li>
                                    <li className="breadcrumb-item active text-green" aria-current="page">Announcements</li>
                                </ol>
                            </nav>
                            <h1 className="display-6 fw-semibold mb-3 text-white" style={{ fontSize: '1.9rem' }}>
                                <i className="fa-solid fa-bullhorn text-green me-3"></i>
                                Global <span className="text-green">Broadcast</span>
                            </h1>
                            <p className="lead mb-4 pe-lg-5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                Send important announcements, updates, and notifications to your entire student community instantly.
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <div className="d-flex align-items-center gap-2 small px-3 py-2 rounded-pill" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                    <i className="fa-solid fa-users text-green"></i>
                                    <span className="text-white fw-medium">{users.length} Students in system</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small px-3 py-2 rounded-pill" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                    <i className="fa-solid fa-envelope text-primary"></i>
                                    <span className="text-white fw-normal" style={{ fontSize: '0.8rem' }}>{selectedUserIds.length} Recipients selected</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-5 px-4">
                <div className="row g-4 justify-content-center">
                    <div className="col-xl-10">
                        <div className="row g-4">
                            {/* Recipients Panel */}
                            <div className="col-lg-5">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-header bg-white border-0 pt-4 px-4 pb-3">
                                        <h6 className="fw-semibold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                                            <i className="fa-solid fa-users text-green"></i>
                                            Select Recipients
                                        </h6>
                                        <p className="small text-muted mb-0 mt-1">{selectedUserIds.length} of {users.length} selected</p>
                                    </div>

                                    {/* Search */}
                                    <div className="px-4 pb-3">
                                        <div className="input-group rounded-3 overflow-hidden border">
                                            <span className="input-group-text bg-white border-0">
                                                <i className="fa-solid fa-magnifying-glass text-muted small"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control border-0 shadow-none"
                                                placeholder="Search by name or email..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Select All */}
                                    <div className="px-4 pb-2">
                                        <div className="bg-light rounded-3 p-3 d-flex justify-content-between align-items-center">
                                            <div className="form-check mb-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="selectAll"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                    style={{ accentColor: '#04bd20' }}
                                                />
                                                <label className="form-check-label fw-normal small" htmlFor="selectAll" style={{ fontSize: '0.8rem' }}>Select All</label>
                                            </div>
                                            <span className="badge rounded-pill bg-light text-muted border">{filteredUsers.length} shown</span>
                                        </div>
                                    </div>

                                    {/* User List */}
                                    <div className="px-4 pb-4" style={{ maxHeight: '340px', overflowY: 'auto' }}>
                                        <div className="d-flex flex-column gap-2">
                                            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                                <div
                                                    key={user._id}
                                                    onClick={() => handleUserSelect(user._id)}
                                                    className={`d-flex align-items-center gap-3 rounded-3 p-3 cursor-pointer user-row ${selectedUserIds.includes(user._id) ? 'selected-row' : ''}`}
                                                >
                                                    <div className="rounded-circle bg-green-soft d-flex align-items-center justify-content-center fw-bold text-green flex-shrink-0" style={{ width: '38px', height: '38px', fontSize: '0.85rem' }}>
                                                        {(user.Username || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <p className="fw-semibold text-dark mb-0 text-truncate small" style={{ fontSize: '0.85rem' }}>{user.Username || 'Unknown User'}</p>
                                                        <p className="text-muted mb-0 text-truncate" style={{ fontSize: '0.75rem' }}>{user.Email}</p>
                                                    </div>
                                                    {selectedUserIds.includes(user._id) && (
                                                        <i className="fa-solid fa-circle-check text-green flex-shrink-0"></i>
                                                    )}
                                                </div>
                                            )) : (
                                                <div className="text-center py-4 text-muted small">
                                                    <i className="fa-solid fa-user-slash mb-2 d-block fs-4 opacity-25"></i>
                                                    No users match your search.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Compose Panel */}
                            <div className="col-lg-7">
                                <div className="card border-0 shadow-sm rounded-4">
                                    <div className="card-header bg-white border-0 pt-4 px-4 pb-3">
                                        <h6 className="fw-semibold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                                            <i className="fa-solid fa-pen-to-square text-green"></i>
                                            Compose Announcement
                                        </h6>
                                        <p className="small text-muted mb-0 mt-1">HTML tags are supported in the message body.</p>
                                    </div>

                                    <div className="px-4 pb-4">
                                        <div className="mb-4">
                                            <label className="form-label fw-medium small text-dark" style={{ fontSize: '0.8rem' }}>Subject Line</label>
                                            <input
                                                type="text"
                                                className="form-control rounded-3"
                                                placeholder="Enter a clear, concise subject..."
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold small text-dark d-flex align-items-center justify-content-between">
                                                <span>Message Body</span>
                                                <span className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>HTML Supported</span>
                                            </label>
                                            <textarea
                                                className="form-control font-mono rounded-3"
                                                style={{ height: '260px', resize: 'none' }}
                                                placeholder="<p>Write your <b>announcement</b> here...</p>"
                                                value={emailBody}
                                                onChange={(e) => setEmailBody(e.target.value)}
                                            ></textarea>
                                            <p className="small text-muted mt-2 mb-0">
                                                <i className="fa-solid fa-circle-info me-1"></i>
                                                Use professional language. Double-check before broadcasting.
                                            </p>
                                        </div>

                                        {/* Summary Bar */}
                                        {selectedUserIds.length > 0 && (
                                            <div className="alert-green rounded-3 p-3 mb-4 d-flex align-items-center gap-3">
                                                <i className="fa-solid fa-paper-plane text-green fs-5"></i>
                                                <div>
                                                    <p className="fw-bold text-dark mb-0 small">Ready to broadcast</p>
                                                    <p className="text-muted mb-0" style={{ fontSize: '0.78rem' }}>
                                                        This message will be sent to <strong>{selectedUserIds.length}</strong> recipient{selectedUserIds.length > 1 ? 's' : ''}.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            className="btn btn-green w-100 fw-semibold rounded-3 py-3 d-flex align-items-center justify-content-center gap-2"
                                            style={{ fontSize: '0.92rem' }}
                                            onClick={handleSend}
                                            disabled={loading || selectedUserIds.length === 0}
                                        >
                                            {loading ? (
                                                <><span className="spinner-border spinner-border-sm" role="status"></span> Broadcasting...</>
                                            ) : (
                                                <><i className="fa-solid fa-bullhorn"></i> Broadcast Announcement ({selectedUserIds.length})</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .text-green { color: #04bd20 !important; }
                .bg-green-soft { background-color: rgba(4, 189, 32, 0.1) !important; }
                .btn-green { background: #04bd20; color: white; border: none; transition: all 0.3s; }
                .btn-green:hover { background: #03a61c; color: white; }
                .btn-green:disabled { background: #adb5bd !important; color: white !important; cursor: not-allowed; }
                .user-row { transition: all 0.2s; cursor: pointer; border: 1px solid transparent; }
                .user-row:hover { background: #f8f9fa; border-color: #e2e8f0; }
                .selected-row { background: rgba(4, 189, 32, 0.07) !important; border-color: rgba(4, 189, 32, 0.2) !important; }
                .alert-green { background: rgba(4, 189, 32, 0.08); border: 1px solid rgba(4, 189, 32, 0.2); }
                .font-mono { font-family: 'Courier New', Courier, monospace; font-size: 0.88rem; }
                .cursor-pointer { cursor: pointer; }
            `}</style>
        </main>
    );
}
