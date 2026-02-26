"use client";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import ContentContext from '../../../context/ContentContext';
import * as GlobalUrls from "../../../utils/GlobalURL";
import { toast } from "react-toastify";

export default function StudentManagementPage() {
    const context = useContext(ContentContext);
    const { getStudentsByRole, studentsByRole, changeStudentStatus, deleteStudent } = context;

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [isloading, setIsloading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [modalStudent, setModalStudent] = useState(null);
    const [editData, setEditData] = useState({ Username: '', Email: '', isVerified: false, Status: 'active' });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentStudents = studentsByRole.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(studentsByRole.length / itemsPerPage);

    useEffect(() => { getStudentsByRole(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true);
        try {
            const res = await getStudentsByRole(`${GlobalUrls.GETSTUDENTSBYROLE_URL}?search=${search}&status=${status}`);
            if (res.success === false) toast.warning(res.message || "No matching students found");
        } catch (error) { console.error(error); }
        finally { setIsloading(false); }
    };

    const handleStatusChange = async (student) => {
        const res = await changeStudentStatus(student._id);
        getStudentsByRole();
        toast.success(res.message || "Student status updated!");
    };

    const handleEditClick = (student) => {
        setModalStudent(student);
        setEditData({
            Username: student.Username,
            Email: student.Email,
            isVerified: student.isVerified,
            Status: student.Status || 'active'
        });
        setShowEditModal(true);
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        const res = await context.updateStudent(editData, modalStudent._id);
        if (res.success) {
            toast.success(res.message);
            setShowEditModal(false);
            getStudentsByRole();
        } else {
            toast.error(res.message || "Failed to update student");
        }
    };

    const deleteStudentConfirm = async (student) => {
        setShowModal(false);
        const res = await deleteStudent(student._id);
        getStudentsByRole();
        toast.success(res.message || "Student deleted successfully!");
    };

    const activeCount = studentsByRole.filter(s => s?.Status === 'active').length;
    const inactiveCount = studentsByRole.length - activeCount;

    return (
        <div className="dc-page">
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={() => deleteStudentConfirm(modalStudent)}
                heading={`Delete "${modalStudent?.Username}"?`} subHeading="This will remove all associated records." />

            {/* Header */}
            <div className="dc-header">
                <div>
                    <h1 className="dc-title">Student Management</h1>
                    <p className="dc-sub">{studentsByRole.length} registered · <span style={{ color: '#04bd20' }}>{activeCount} active</span> · <span style={{ color: '#ef4444' }}>{inactiveCount} inactive</span></p>
                </div>
            </div>

            {/* Search */}
            <div className="dc-search-card">
                <form onSubmit={handleSubmit} className="row g-3 align-items-end">
                    <div className="col-md-8">
                        <label className="dc-label">Search Students</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-search"></i></span>
                            <input type="text" className="dc-input" placeholder="Name, email, or ID..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <label className="dc-label">Status</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-circle-dot"></i></span>
                            <select className="dc-input dc-select" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="dc-search-btn w-100" disabled={isloading}>
                            {isloading ? <div className="dc-spinner"></div> : <><i className="fa-solid fa-filter me-2"></i>Filter</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Table */}
            {isloading ? (
                <div className="dc-loading"><div className="dc-spinner-lg"></div><p>Loading students...</p></div>
            ) : (
                <div className="dc-table-card">
                    <div className="dc-table-header">
                        <span className="dc-table-title"><i className="fa-solid fa-users me-2" style={{ color: '#6366f1' }}></i>All Students</span>
                        <span className="dc-pill">{studentsByRole.length} total</span>
                    </div>
                    <div className="table-responsive">
                        <table className="dc-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '30%' }}>Student</th>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Verified</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentStudents && currentStudents.length > 0 ? currentStudents.map((student) => (
                                    <tr key={student._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div className="dc-avatar">
                                                    <img
                                                        src={student?.Profile ? (student.Profile.startsWith('http') ? student.Profile : `https://lh3.googleusercontent.com/d/${student.Profile}`) : "/assets/img/Avtar.jpg"}
                                                        alt={student?.Username}
                                                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${student?.Username || 'User'}&background=6366f1&color=fff`; }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="dc-student-name">{student?.Username}</div>
                                                    <div className="dc-student-role">Student</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="dc-id-tag">{(student?.ExmeeUserId || "—").slice(0, 8)}</span></td>
                                        <td className="dc-td-muted">{student?.Email}</td>
                                        <td>
                                            {student?.isVerified
                                                ? <span className="dc-verify-yes"><i className="fa-solid fa-circle-check me-1"></i>Verified</span>
                                                : <span className="dc-verify-no"><i className="fa-solid fa-circle-xmark me-1"></i>Pending</span>}
                                        </td>
                                        <td>
                                            <span className="dc-status-pill" style={student?.Status === 'active'
                                                ? { background: 'rgba(4,189,32,0.1)', color: '#04bd20' }
                                                : { background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                                {student?.Status || 'inactive'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div className="dc-actions">
                                                <button className="dc-action-btn dc-edit" title="Edit" onClick={() => handleEditClick(student)}>
                                                    <i className="fa-solid fa-edit"></i>
                                                </button>
                                                <button
                                                    className={`dc-action-btn ${student?.Status === 'active' ? 'dc-block' : 'dc-unblock'}`}
                                                    onClick={() => handleStatusChange(student)}
                                                    title={student?.Status === 'active' ? 'Block' : 'Unblock'}>
                                                    <i className={`fa-solid ${student?.Status === 'active' ? 'fa-lock' : 'fa-unlock'}`}></i>
                                                </button>
                                                <button className="dc-action-btn dc-del" title="Delete" onClick={() => { setModalStudent(student); setShowModal(true); }}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="dc-empty-row">
                                            <i className="fa-solid fa-users"></i>
                                            <p>No students found matching your criteria.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="dc-table-footer">
                            <span className="dc-page-info">Page {currentPage} of {totalPages}</span>
                            <div className="dc-pages">
                                <button className="dc-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>

                                {(() => {
                                    const pages = [];
                                    const showLimit = 2; // Pages to show on each side of current

                                    for (let i = 1; i <= totalPages; i++) {
                                        // Always show first, last, and pages around current
                                        if (i === 1 || i === totalPages || (i >= currentPage - showLimit && i <= currentPage + showLimit)) {
                                            pages.push(
                                                <button
                                                    key={i}
                                                    className={`dc-page-btn ${currentPage === i ? 'dc-page-active' : ''}`}
                                                    onClick={() => setCurrentPage(i)}
                                                >
                                                    {i}
                                                </button>
                                            );
                                        } else if (i === currentPage - showLimit - 1 || i === currentPage + showLimit + 1) {
                                            // Add ellipses points
                                            pages.push(<span key={`ellipsis-${i}`} className="dc-page-ellipsis">...</span>);
                                        }
                                    }
                                    return pages;
                                })()}

                                <button className="dc-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {/* Edit Modal */}
            {showEditModal && (
                <div className="edit-modal-overlay">
                    <div className="edit-modal-card">
                        <div className="edit-modal-header">
                            <h3>Edit Student Profile</h3>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <form onSubmit={handleUpdateStudent} className="edit-modal-body">
                            <div className="mb-3">
                                <label className="dc-label">Username</label>
                                <input type="text" className="dc-input" value={editData.Username} onChange={e => setEditData({ ...editData, Username: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="dc-label">Email Address</label>
                                <input type="email" className="dc-input" value={editData.Email} onChange={e => setEditData({ ...editData, Email: e.target.value })} required />
                            </div>
                            <div className="row g-3 mb-4">
                                <div className="col-6">
                                    <label className="dc-label">Account Status</label>
                                    <select className="dc-input dc-select" value={editData.Status} onChange={e => setEditData({ ...editData, Status: e.target.value })}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="dc-label">Verified</label>
                                    <select className="dc-input dc-select" value={editData.isVerified ? "true" : "false"} onChange={e => setEditData({ ...editData, isVerified: e.target.value === "true" })}>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                            </div>
                            <div className="edit-modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="submit" className="btn-save">Update Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .dc-page { min-height: 100vh; }
                .dc-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
                .dc-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0; }
                .dc-sub { font-size: 0.8rem; color: #94a3b8; margin: 3px 0 0; }
                .dc-search-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 24px; }
                .dc-label { font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 6px; display: block; }
                .dc-input-wrap { position: relative; }
                .dc-input-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.8rem; pointer-events: none; }
                .dc-input { width: 100%; padding: 10px 13px 10px 34px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.875rem; color: #0f172a; background: #f8fafc; outline: none; transition: all 0.2s; font-family: inherit; }
                .dc-input:focus { border-color: #6366f1; background: white; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
                .dc-select { appearance: none; cursor: pointer; }
                .dc-search-btn { padding: 10px 16px; background: #0f172a; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .dc-search-btn:hover { background: #1e293b; }
                .dc-search-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .dc-loading { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; color: #94a3b8; gap: 12px; }
                .dc-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                .dc-spinner-lg { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #6366f1; border-radius: 50%; animation: spin 0.7s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .dc-table-card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; }
                .dc-table-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
                .dc-table-title { font-size: 0.88rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; }
                .dc-pill { background: #f1f5f9; color: #64748b; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 50px; }
                .dc-table { width: 100%; border-collapse: collapse; }
                .dc-table thead tr { background: #f8fafc; }
                .dc-table th { padding: 10px 16px; font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
                .dc-table td { padding: 12px 16px; border-bottom: 1px solid #f8fafc; font-size: 0.85rem; vertical-align: middle; }
                .dc-table tbody tr:hover { background: #f8fafc; }
                .dc-avatar { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 2px solid #e2e8f0; }
                .dc-avatar img { width: 100%; height: 100%; object-fit: cover; }
                .dc-student-name { font-weight: 600; color: #1e293b; font-size: 0.875rem; }
                .dc-student-role { font-size: 0.72rem; color: #94a3b8; }
                .dc-id-tag { background: #f1f5f9; color: #475569; font-size: 0.72rem; font-weight: 600; font-family: monospace; padding: 3px 8px; border-radius: 6px; }
                .dc-td-muted { color: #64748b; font-size: 0.82rem; }
                .dc-verify-yes { display: inline-flex; align-items: center; font-size: 0.75rem; font-weight: 600; color: #04bd20; }
                .dc-verify-no { display: inline-flex; align-items: center; font-size: 0.75rem; font-weight: 600; color: #f59e0b; }
                .dc-status-pill { font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.04em; }
                .dc-actions { display: flex; gap: 5px; justify-content: flex-end; }
                .dc-action-btn { width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; cursor: pointer; transition: all 0.15s; background: transparent; }
                .dc-edit { border-color: #bfdbfe; color: #3b82f6; }
                .dc-edit:hover { background: #eff6ff; }
                .dc-block { border-color: #fed7aa; color: #f97316; }
                .dc-block:hover { background: #fff7ed; }
                .dc-unblock { border-color: #a7f3d0; color: #10b981; }
                .dc-unblock:hover { background: #ecfdf5; }
                .dc-del { border-color: #fecaca; color: #ef4444; }
                .dc-del:hover { background: #fff5f5; }
                .dc-empty-row { text-align: center; padding: 48px 20px; color: #94a3b8; }
                .dc-empty-row i { font-size: 2.5rem; color: #e2e8f0; display: block; margin-bottom: 8px; }
                .dc-empty-row p { font-size: 0.85rem; margin: 0; }
                .dc-table-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid #f1f5f9; flex-wrap: wrap; gap: 8px; }
                .dc-page-info { font-size: 0.78rem; color: #94a3b8; }
                .dc-pages { display: flex; gap: 4px; }
                .dc-page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; color: #374151; font-size: 0.8rem; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
                .dc-page-btn:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; }
                .dc-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .dc-page-active { background: #6366f1 !important; border-color: #6366f1 !important; color: white !important; }
                .dc-page-ellipsis { color: #94a3b8; font-size: 0.8rem; font-weight: 700; width: 32px; display: flex; align-items: center; justify-content: center; user-select: none; }

                /* Edit Modal Styles */
                .edit-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .edit-modal-card { background: white; border-radius: 16px; width: 100%; max-width: 480px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; animation: slideUp 0.3s ease; }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                
                .edit-modal-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; background: #fcfdfd; }
                .edit-modal-header h3 { margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a; }
                .close-btn { background: none; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; transition: color 0.15s; }
                .close-btn:hover { color: #ef4444; }

                .edit-modal-body { padding: 24px; }
                .edit-modal-footer { display: flex; gap: 12px; margin-top: 8px; }
                .btn-cancel { flex: 1; padding: 12px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: white; color: #64748b; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .btn-cancel:hover { background: #f8fafc; color: #0f172a; }
                .btn-save { flex: 2; padding: 12px; border-radius: 10px; border: none; background: #0f172a; color: white; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .btn-save:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(15,23,42,0.2); }
            `}</style>
        </div>
    );
}
