"use client";
import React, { useState, useEffect, useContext } from "react";
import ContentContext from '../../context/ContentContext';
import StudentLayout from '../../components/Home/StudentLayout';

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
        <StudentLayout title="Global Broadcast">
            <div className="container-fluid px-0">
                <div className="mb-4">
                    <h2 className="fw-black mb-1" style={{ fontSize: '1.8rem' }}>Global Broadcast</h2>
                    <p className="text-muted small">Send important announcements to your student community.</p>
                </div>

                <div className="row g-4">
                    {/* Recipients Section */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                            <div className="p-4 bg-light border-bottom">
                                <h6 className="fw-bold mb-1"><i className="fa-solid fa-users text-success me-2"></i>Select Recipients</h6>
                                <p className="smaller text-muted mb-0">{selectedUserIds.length} of {users.length} selected</p>
                            </div>

                            <div className="p-3 border-bottom">
                                <div className="input-group input-group-sm rounded-pill border">
                                    <span className="input-group-text bg-white border-0"><i className="fa-solid fa-magnifying-glass text-muted opacity-50"></i></span>
                                    <input
                                        type="text"
                                        className="form-control border-0 shadow-none ps-0"
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                                <div className="form-check mb-0">
                                    <input className="form-check-input" type="checkbox" id="selectAll" checked={selectAll} onChange={handleSelectAll} style={{ cursor: 'pointer' }} />
                                    <label className="form-check-label smaller fw-bold" htmlFor="selectAll" style={{ cursor: 'pointer' }}>Select All</label>
                                </div>
                                <span className="badge rounded-pill bg-white text-muted border smaller px-3 py-1">{filteredUsers.length} users</span>
                            </div>

                            <div className="users-list custom-scrollbar" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        className={`px-4 py-3 d-flex align-items-center gap-3 transition-all cursor-pointer border-bottom border-light ${selectedUserIds.includes(user._id) ? 'bg-success bg-opacity-5' : ''}`}
                                        onClick={() => handleUserSelect(user._id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${selectedUserIds.includes(user._id) ? 'bg-success text-white' : 'bg-light text-muted fw-bold'}`}
                                            style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>
                                            {(user.Username || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="mb-0 text-truncate smaller fw-bold">{user.Username}</p>
                                            <p className="mb-0 text-truncate text-muted" style={{ fontSize: '0.65rem' }}>{user.Email}</p>
                                        </div>
                                        {selectedUserIds.includes(user._id) && (
                                            <i className="fa-solid fa-circle-check text-success smaller"></i>
                                        )}
                                    </div>
                                )) : (
                                    <div className="p-5 text-center text-muted">
                                        <i className="fa-solid fa-user-slash fs-2 opacity-25 mb-3 d-block"></i>
                                        <span className="smaller">No users found</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                            <h6 className="fw-bold mb-4"><i className="fa-solid fa-pen-to-square text-success me-2"></i>Compose Message</h6>

                            <div className="mb-4">
                                <label className="smaller text-muted fw-bold mb-2 uppercase ls-wide">Subject Line</label>
                                <input
                                    type="text"
                                    className="form-control rounded-3 border-light bg-light py-2"
                                    placeholder="Announcement Title"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="smaller text-muted fw-bold mb-2 d-flex justify-content-between">
                                    <span className="uppercase ls-wide">Message Body</span>
                                    <span className="opacity-50">HTML Supported</span>
                                </label>
                                <textarea
                                    className="form-control rounded-3 border-light bg-light font-mono"
                                    style={{ height: '300px', resize: 'none' }}
                                    placeholder="<p>Write your announcement message here...</p>"
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                ></textarea>
                            </div>

                            {selectedUserIds.length > 0 && (
                                <div className="alert alert-success border-0 rounded-4 p-3 mb-4 d-flex align-items-center gap-3">
                                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <i className="fa-solid fa-paper-plane small"></i>
                                    </div>
                                    <div>
                                        <p className="smaller fw-bold mb-0">Ready to send</p>
                                        <p className="mb-0" style={{ fontSize: '0.7rem' }}>Sending to <strong>{selectedUserIds.length}</strong> recipients.</p>
                                    </div>
                                </div>
                            )}

                            <button
                                className="btn btn-primary-green w-100 rounded-pill py-3 fw-bold mt-auto"
                                onClick={handleSend}
                                disabled={loading || selectedUserIds.length === 0}
                            >
                                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Broadcasting...</> : <><i className="fa-solid fa-bullhorn me-2"></i>Broadcast Announcement</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </StudentLayout>
    );
}


