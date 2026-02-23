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

    useEffect(() => {
        getAllUser();
    }, []);

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
        if (selectedUserIds.length === 0) {
            toast.warning("Please select at least one user.");
            return;
        }
        if (!subject.trim()) {
            toast.warning("Subject cannot be empty.");
            return;
        }

        setLoading(true);
        try {
            const data = {
                subject,
                emailBody,
                userIds: selectedUserIds,
            };

            const res = await sendAnnounceMent(data);
            if (res.success) {
                toast.success("Announcement broadcasted successfully!");
                setSubject("");
                setEmailBody("");
                setSelectedUserIds([]);
                setSelectAll(false);
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
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-xl-9">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
                        <div className="card-body p-0">
                            <div className="bg-info bg-gradient p-5 text-center text-white">
                                <h1 className="display-6 fw-bold mb-2">📢 Global Announcement</h1>
                                <p className="lead opacity-75 mb-0">Broadcast messages to your entire student community instantly.</p>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow rounded-4 p-4 p-md-5">
                        <div className="row g-4">
                            <div className="col-12">
                                <label className="form-label fw-bold d-flex justify-content-between">
                                    <span>🎯 Recipients</span>
                                    <span className="text-primary small">{selectedUserIds.length} users selected</span>
                                </label>

                                <div className="input-group mb-3">
                                    <span className="input-group-text bg-white border-end-0"><i className="fa-solid fa-magnifying-glass text-muted"></i></span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0 ps-0"
                                        placeholder="Search recipients by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="border rounded-4 bg-light overflow-hidden">
                                    <div className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
                                        <div className="form-check mb-0">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="selectAll"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                            <label className="form-check-label fw-bold" htmlFor="selectAll">
                                                Select All Available
                                            </label>
                                        </div>
                                        <span className="badge bg-secondary rounded-pill">{filteredUsers.length} total</span>
                                    </div>
                                    <div className="p-1" style={{ maxHeight: "250px", overflowY: "auto" }}>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <div className={`p-2 px-3 rounded-3 mb-1 d-flex align-items-center hover-bg ${selectedUserIds.includes(user._id) ? 'bg-primary bg-opacity-10' : ''}`} key={user._id}>
                                                    <div className="form-check mb-0">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={user._id}
                                                            checked={selectedUserIds.includes(user._id)}
                                                            onChange={() => handleUserSelect(user._id)}
                                                        />
                                                        <label className="form-check-label ms-2" htmlFor={user._id}>
                                                            <span className="fw-bold d-block">{user.Username || 'Unknown User'}</span>
                                                            <span className="small text-muted">{user.Email}</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-5 text-muted small">No users found matching your search.</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-bold">✉️ Subject Line</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Enter a catchy subject for the email"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-bold">📝 Message Content <small className="text-muted fw-normal ms-2">(HTML Supported)</small></label>
                                <textarea
                                    className="form-control font-monospace"
                                    style={{ height: "300px" }}
                                    placeholder="Write your message here. You can use <b>HTML</b> tags for rich formatting."
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                />
                                <div className="form-text text-muted mt-2">
                                    Tip: Use professional language and check for typos before broadcasting.
                                </div>
                            </div>

                            <div className="col-12 text-center mt-5 pt-3 border-top">
                                <button
                                    className="btn btn-primary btn-lg px-5 fw-bold shadow"
                                    onClick={handleSend}
                                    disabled={loading || selectedUserIds.length === 0}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-paper-plane me-2"></i> Broadcast Announcement
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-bg:hover { background-color: rgba(0,0,0,0.03); cursor: pointer; }
                .font-monospace { font-family: 'Courier New', Courier, monospace; font-size: 0.9rem; }
            `}</style>
        </div>
    );
}
