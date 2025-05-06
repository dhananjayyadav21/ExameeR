import React, { useContext, useEffect, useState } from "react";
import ContentContext from '../context/ContentContext';
import { toast } from 'react-toastify';

const AnnouncementPage = () => {
    const context = useContext(ContentContext);
    const { getAllUser, allUser, sendAnnounceMent } = context;

    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [emailBody, setEmailBody] = useState("");
    const [subject, setSubject] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getAllUser();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setUsers(allUser);
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
            toast.warning("Please select at least one user.", { position: "top-right" });
            return;
        }
        if (!subject.trim()) {
            toast.warning("Subject cannot be empty.", { position: "top-right" });
            return;
        }

        try {
            // const formData = new FormData();
            // formData.append("subject", subject);
            // formData.append("emailBody", emailBody);
            // selectedUserIds.forEach((id) => {
            //     formData.append("userIds", id); // multiple entries with same key
            // });

            const data = {
                subject,
                emailBody,
                userIds: selectedUserIds,
              };

        
            const res = await sendAnnounceMent(data);
            if (res.message === 'success') {
                toast.success("Announcement sent!", { position: "top-right" });
                return
            }
        } catch (err) {
            toast.warning("Error sending announcement.", { position: "top-right" });
            console.error("Announcement Error:", err);
        }
    };

    return (
        <>
            <div className="container">
                <div className="serchContent-heroSection card my-4 shadow-sm">
                    <div className="text-center py-4">
                        <h2 className="card-title">📢 Send New <span className="serchContent-span-section text-info"> Announcement </span></h2>
                        <p className="card-text">
                            "The beautiful thing about learning is that nobody can take it away from you."
                        </p>
                    </div>
                </div>
                <div className="my-4">
                    <div className="bg-white rounded-3 shadow-sm py-5 px-3 px-md-5">
                        {/* Select Users */}
                        <div className="mb-4">
                            <label className="form-label">🎯 Select Users</label>
                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="selectAll"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                                <label className="form-check-label" htmlFor="selectAll">
                                    Select All Users
                                </label>
                            </div>

                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="🔍 Search by name or email"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <div className="border rounded p-3 scrollable" style={{ maxHeight: "200px", background: "#ffffff" }}>
                                {users
                                    .filter(
                                        (user) =>
                                            user?.Email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                                            (user?.Username && user?.Username?.toLowerCase().includes(searchQuery?.toLowerCase()))
                                    )
                                    .map((user) => (
                                        <div className="form-check user-checkbox bg-light" key={user._id}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={user._id}
                                                checked={selectedUserIds?.includes(user._id)}
                                                onChange={() => handleUserSelect(user._id)}
                                            />
                                            <label className="form-check-label" htmlFor={user?._id}>
                                                {user?.Username} ({user?.Email})
                                            </label>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="mb-4">
                            <label className="form-label">✉️ Subject</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter announcement subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        {/* Email Body */}
                        <div className="mb-4">
                            <label className="form-label">📝 Email Body (HTML Supported)</label>
                            <textarea
                                className="form-control"
                                style={{ height: "250px" }}
                                placeholder="<h1>Welcome</h1><p>This is a raw HTML message.</p>"
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                            />
                        </div>

                        <div className="text-center">
                            <button className="btn btn-success" onClick={handleSend}>
                                🚀 Send Announcement
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>

    );
};

export default AnnouncementPage;
