"use client";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import ContentContext from '../../../context/ContentContext';
import * as GlobalUrls from "../../../utils/GlobalURL";
import { toast } from "react-toastify";

export default function UsersManagementPage() {
    const context = useContext(ContentContext);
    const { getStudentsByRole, studentsByRole, changeStudentStatus, deleteStudent } = context;

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [roleFilter, setRoleFilter] = useState(""); // "" = All, "Student", "Instructor"
    const [loggedInRole, setLoggedInRole] = useState("");
    const [isloading, setIsloading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [modalUser, setModalUser] = useState(null);
    const [editData, setEditData] = useState({ Username: '', Email: '', FirstName: '', LastName: '', isVerified: false, Status: 'active' });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentUsers = studentsByRole.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(studentsByRole.length / itemsPerPage);

    const fetchUsers = (searchVal = search, statusVal = status, roleVal = roleFilter) => {
        const params = new URLSearchParams();
        if (searchVal) params.set('search', searchVal);
        if (statusVal) params.set('status', statusVal);
        if (roleVal) params.set('role', roleVal);
        const url = `${GlobalUrls.GETSTUDENTSBYROLE_URL}?${params.toString()}`;
        return getStudentsByRole(url);
    };

    useEffect(() => {
        const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : '';
        setLoggedInRole(role);
        // Instructors default to their students; Admins see all
        const defaultRole = role === 'Instructor' ? 'Student' : '';
        setRoleFilter(defaultRole);
        fetchUsers("", "", defaultRole);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true);
        try {
            const res = await fetchUsers(search, status, roleFilter);
            setCurrentPage(1);
            if (res?.success === false) toast.warning(res.message || "No matching users found");
        } catch (err) { console.error(err); }
        finally { setIsloading(false); }
    };

    const handleReset = () => {
        setSearch(""); setStatus(""); setRoleFilter("");
        fetchUsers("", "", "");
        setCurrentPage(1);
    };

    const handleStatusChange = async (user) => {
        const res = await changeStudentStatus(user._id);
        fetchUsers();
        toast.success(res?.message || "Status updated!");
    };

    const handleEditClick = (user) => {
        setModalUser(user);
        setEditData({
            Username: user.Username,
            Email: user.Email,
            FirstName: user.FirstName || '',
            LastName: user.LastName || '',
            isVerified: user.isVerified,
            Status: user.Status || 'active'
        });
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await context.updateStudent(editData, modalUser._id);
        if (res.success) {
            toast.success(res.message);
            setShowEditModal(false);
            fetchUsers();
        } else {
            toast.error(res.message || "Failed to update user");
        }
    };

    const deleteConfirm = async (user) => {
        setShowModal(false);
        const res = await deleteStudent(user._id);
        fetchUsers();
        toast.success(res?.message || "User deleted successfully!");
    };

    const studentCount = studentsByRole.filter(u => u?.Role === 'Student').length;
    const instructorCount = studentsByRole.filter(u => u?.Role === 'Instructor').length;
    const activeCount = studentsByRole.filter(u => u?.Status === 'active').length;
    const inactiveCount = studentsByRole.length - activeCount;

    const getRoleColor = (role) => role === 'Instructor' ? '#7c3aed' : '#6366f1';
    const getRoleBg = (role) => role === 'Instructor' ? '#f3e8ff' : '#ede9fe';
    const getRoleIcon = (role) => role === 'Instructor' ? 'fa-chalkboard-user' : 'fa-user-graduate';

    return (
        <div className="um-page">
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => deleteConfirm(modalUser)}
                heading={`Delete "${modalUser?.Username}"?`}
                subHeading="This will permanently remove the user and all associated data."
            />

            {/* Header */}
            <div className="um-header">
                <div>
                    <h1 className="um-title">
                        <i className="fa-solid fa-users me-2" style={{ color: '#6366f1' }}></i>
                        User Management
                    </h1>
                    <p className="um-sub">
                        {studentsByRole.length} total ·{' '}
                        <span style={{ color: '#6366f1' }}>{studentCount} students</span> ·{' '}
                        <span style={{ color: '#7c3aed' }}>{instructorCount} instructors</span> ·{' '}
                        <span style={{ color: '#04bd20' }}>{activeCount} active</span> ·{' '}
                        <span style={{ color: '#ef4444' }}>{inactiveCount} inactive</span>
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="um-stats">
                <div className="um-stat" onClick={() => { setRoleFilter(""); fetchUsers("", "", ""); setCurrentPage(1); }} style={{ cursor: 'pointer' }}>
                    <div className="um-stat-icon" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                        <i className="fa-solid fa-users"></i>
                    </div>
                    <div>
                        <div className="um-stat-num">{studentsByRole.length}</div>
                        <div className="um-stat-lbl">All Users</div>
                    </div>
                </div>
                <div className="um-stat" onClick={() => { setRoleFilter("Student"); fetchUsers(search, status, "Student"); setCurrentPage(1); }} style={{ cursor: 'pointer' }}>
                    <div className="um-stat-icon" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}>
                        <i className="fa-solid fa-user-graduate"></i>
                    </div>
                    <div>
                        <div className="um-stat-num">{studentCount}</div>
                        <div className="um-stat-lbl">Students</div>
                    </div>
                </div>
                <div className="um-stat" onClick={() => { setRoleFilter("Instructor"); fetchUsers(search, status, "Instructor"); setCurrentPage(1); }} style={{ cursor: 'pointer' }}>
                    <div className="um-stat-icon" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                        <i className="fa-solid fa-chalkboard-user"></i>
                    </div>
                    <div>
                        <div className="um-stat-num">{instructorCount}</div>
                        <div className="um-stat-lbl">Instructors</div>
                    </div>
                </div>
                <div className="um-stat">
                    <div className="um-stat-icon" style={{ background: 'rgba(4,189,32,0.1)', color: '#04bd20' }}>
                        <i className="fa-solid fa-circle-check"></i>
                    </div>
                    <div>
                        <div className="um-stat-num">{activeCount}</div>
                        <div className="um-stat-lbl">Active</div>
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="um-filter-card">
                <form onSubmit={handleSubmit} className="um-filter-row">
                    {/* Search */}
                    <div className="um-field um-field--grow">
                        <label className="um-label">Search</label>
                        <div className="um-input-wrap">
                            <i className="fa-solid fa-search um-icon"></i>
                            <input
                                type="text"
                                className="um-input"
                                placeholder="Name, email, username..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div className="um-field">
                        <label className="um-label">View</label>
                        <div className="um-input-wrap">
                            <i className="fa-solid fa-user-tag um-icon"></i>
                            <select className="um-input um-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                                {loggedInRole !== 'Instructor' && <option value="">All Roles</option>}
                                <option value="Student">🎓 Students</option>
                                <option value="Instructor">👨‍🏫 Instructors</option>
                            </select>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="um-field">
                        <label className="um-label">Status</label>
                        <div className="um-input-wrap">
                            <i className="fa-solid fa-circle-dot um-icon"></i>
                            <select className="um-input um-select" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="um-field um-field--btns">
                        <label className="um-label">&nbsp;</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="submit" className="um-btn um-btn--primary" disabled={isloading}>
                                {isloading
                                    ? <span className="um-spinner"></span>
                                    : <><i className="fa-solid fa-filter me-2"></i>Filter</>
                                }
                            </button>
                            <button type="button" className="um-btn um-btn--reset" onClick={handleReset}>
                                <i className="fa-solid fa-rotate-left"></i>
                            </button>
                        </div>
                    </div>
                </form>

                {/* Active filters badges */}
                {(roleFilter || status || search) && (
                    <div className="um-active-filters">
                        <span className="um-filter-label">Active filters:</span>
                        {roleFilter && (
                            <span className="um-filter-tag">
                                {roleFilter === 'Instructor' ? '👨‍🏫' : '🎓'} {roleFilter}
                                <button onClick={() => { setRoleFilter(""); fetchUsers(search, status, ""); }}>×</button>
                            </span>
                        )}
                        {status && (
                            <span className="um-filter-tag">
                                ● {status}
                                <button onClick={() => { setStatus(""); fetchUsers(search, "", roleFilter); }}>×</button>
                            </span>
                        )}
                        {search && (
                            <span className="um-filter-tag">
                                🔍 "{search}"
                                <button onClick={() => { setSearch(""); fetchUsers("", status, roleFilter); }}>×</button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            {isloading ? (
                <div className="um-loading">
                    <div className="um-spinner-lg"></div>
                    <p>Loading users...</p>
                </div>
            ) : (
                <div className="um-table-card">
                    <div className="um-table-header">
                        <span className="um-table-title">
                            <i className="fa-solid fa-users me-2" style={{ color: '#6366f1' }}></i>
                            {roleFilter ? `All ${roleFilter}s` : 'All Users'}
                            {status && <span className="um-tbl-badge">{status}</span>}
                        </span>
                        <span className="um-pill">{studentsByRole.length} results</span>
                    </div>

                    <div className="table-responsive">
                        <table className="um-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '30%' }}>User</th>
                                    <th>Role</th>
                                    <th>Email</th>
                                    <th>Verified</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers && currentUsers.length > 0 ? currentUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="um-user-cell">
                                                <div className="um-avatar">
                                                    <img
                                                        src={user?.Profile
                                                            ? (user.Profile.startsWith('http') ? user.Profile : `https://lh3.googleusercontent.com/d/${user.Profile}`)
                                                            : "/assets/img/Avtar.jpg"}
                                                        alt={user?.Username}
                                                        onError={(e) => {
                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${user?.Username || 'User'}&background=${user?.Role === 'Instructor' ? '7c3aed' : '6366f1'}&color=fff`;
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="um-user-name">
                                                        {user?.FirstName ? `${user.FirstName} ${user.LastName}` : user?.Username}
                                                    </div>
                                                    <div className="um-user-uname">@{user?.Username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="um-role-badge" style={{
                                                background: getRoleBg(user?.Role),
                                                color: getRoleColor(user?.Role)
                                            }}>
                                                <i className={`fa-solid ${getRoleIcon(user?.Role)} me-1`}></i>
                                                {user?.Role}
                                            </span>
                                        </td>
                                        <td className="um-td-muted">{user?.Email}</td>
                                        <td>
                                            {user?.isVerified
                                                ? <span className="um-verified"><i className="fa-solid fa-circle-check me-1"></i>Verified</span>
                                                : <span className="um-pending"><i className="fa-solid fa-clock me-1"></i>Pending</span>
                                            }
                                        </td>
                                        <td>
                                            <span className="um-status-pill" style={user?.Status === 'active'
                                                ? { background: 'rgba(4,189,32,0.1)', color: '#04bd20' }
                                                : { background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                                {user?.Status || 'inactive'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div className="um-actions">
                                                <button className="um-act-btn um-edit" title="Edit" onClick={() => handleEditClick(user)}>
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button
                                                    className={`um-act-btn ${user?.Status === 'active' ? 'um-block' : 'um-unblock'}`}
                                                    title={user?.Status === 'active' ? 'Block' : 'Unblock'}
                                                    onClick={() => handleStatusChange(user)}>
                                                    <i className={`fa-solid ${user?.Status === 'active' ? 'fa-lock' : 'fa-unlock'}`}></i>
                                                </button>
                                                <button className="um-act-btn um-del" title="Delete"
                                                    onClick={() => { setModalUser(user); setShowModal(true); }}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="um-empty">
                                            <i className="fa-solid fa-users-slash"></i>
                                            <p>No users found. Try adjusting your filters.</p>
                                            <button className="um-btn um-btn--reset" style={{ margin: '0 auto' }} onClick={handleReset}>
                                                <i className="fa-solid fa-rotate-left me-2"></i>Clear Filters
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="um-table-footer">
                            <span className="um-page-info">
                                Showing {indexOfFirst + 1}–{Math.min(indexOfLast, studentsByRole.length)} of {studentsByRole.length}
                            </span>
                            <div className="um-pages">
                                <button className="um-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(i => i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2)
                                    .map((page, idx, arr) => (
                                        <React.Fragment key={page}>
                                            {idx > 0 && arr[idx - 1] !== page - 1 && <span className="um-ellipsis">…</span>}
                                            <button
                                                className={`um-page-btn ${currentPage === page ? 'um-page-active' : ''}`}
                                                onClick={() => setCurrentPage(page)}
                                            >{page}</button>
                                        </React.Fragment>
                                    ))}
                                <button className="um-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="um-modal-overlay">
                    <div className="um-modal-card">
                        <div className="um-modal-header">
                            <div className="um-modal-user">
                                <div className="um-avatar um-avatar--lg">
                                    <img
                                        src={modalUser?.Profile ? (modalUser.Profile.startsWith('http') ? modalUser.Profile : `https://lh3.googleusercontent.com/d/${modalUser.Profile}`) : "/assets/img/Avtar.jpg"}
                                        alt={modalUser?.Username}
                                        onError={e => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${modalUser?.Username}&background=6366f1&color=fff`; }}
                                    />
                                </div>
                                <div>
                                    <h3 className="um-modal-title">Edit User</h3>
                                    <span className="um-role-badge" style={{ background: getRoleBg(modalUser?.Role), color: getRoleColor(modalUser?.Role), fontSize: '0.7rem' }}>
                                        <i className={`fa-solid ${getRoleIcon(modalUser?.Role)} me-1`}></i>
                                        {modalUser?.Role}
                                    </span>
                                </div>
                            </div>
                            <button className="um-close-btn" onClick={() => setShowEditModal(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="um-modal-body">
                            <div className="mb-3">
                                <label className="um-label">Username</label>
                                <input type="text" className="um-input" style={{ paddingLeft: '13px' }} value={editData.Username}
                                    onChange={e => setEditData({ ...editData, Username: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="um-label">Email Address</label>
                                <input type="email" className="um-input" style={{ paddingLeft: '13px' }} value={editData.Email}
                                    onChange={e => setEditData({ ...editData, Email: e.target.value })} required />
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-6">
                                    <label className="um-label">First Name</label>
                                    <input type="text" className="um-input" style={{ paddingLeft: '13px' }} value={editData.FirstName}
                                        onChange={e => setEditData({ ...editData, FirstName: e.target.value })} />
                                </div>
                                <div className="col-6">
                                    <label className="um-label">Last Name</label>
                                    <input type="text" className="um-input" style={{ paddingLeft: '13px' }} value={editData.LastName}
                                        onChange={e => setEditData({ ...editData, LastName: e.target.value })} />
                                </div>
                            </div>
                            <div className="row g-3 mb-4">
                                <div className="col-6">
                                    <label className="um-label">Account Status</label>
                                    <select className="um-input um-select" style={{ paddingLeft: '13px' }} value={editData.Status}
                                        onChange={e => setEditData({ ...editData, Status: e.target.value })}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="um-label">Verified</label>
                                    <select className="um-input um-select" style={{ paddingLeft: '13px' }}
                                        value={editData.isVerified ? "true" : "false"}
                                        onChange={e => setEditData({ ...editData, isVerified: e.target.value === "true" })}>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                            </div>
                            <div className="um-modal-footer">
                                <button type="button" className="um-btn um-btn--cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="submit" className="um-btn um-btn--save">
                                    <i className="fa-solid fa-save me-2"></i>Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .um-page { min-height: 100vh; }

                /* Header */
                .um-header { margin-bottom: 20px; }
                .um-title { font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0; display: flex; align-items: center; }
                .um-sub { font-size: 0.8rem; color: #94a3b8; margin: 5px 0 0; }

                /* Stats */
                .um-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
                .um-stat { background: white; border-radius: 14px; padding: 16px; border: 1px solid #f1f5f9; box-shadow: 0 1px 6px rgba(0,0,0,0.04); display: flex; align-items: center; gap: 14px; transition: box-shadow 0.2s, transform 0.2s; }
                .um-stat:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }
                .um-stat-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
                .um-stat-num { font-size: 1.5rem; font-weight: 800; color: #0f172a; line-height: 1; }
                .um-stat-lbl { font-size: 0.7rem; color: #94a3b8; font-weight: 600; margin-top: 3px; }

                /* Filter Card */
                .um-filter-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #f1f5f9; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 20px; }
                .um-filter-row { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
                .um-field { display: flex; flex-direction: column; }
                .um-field--grow { flex: 1; min-width: 160px; }
                .um-field--btns { min-width: 100px; }
                .um-label { font-size: 0.72rem; font-weight: 700; color: #374151; margin-bottom: 5px; letter-spacing: 0.02em; }
                .um-input-wrap { position: relative; }
                .um-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.78rem; pointer-events: none; }
                .um-input { width: 100%; padding: 10px 13px 10px 32px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.875rem; color: #0f172a; background: #f8fafc; outline: none; transition: all 0.2s; font-family: inherit; }
                .um-input:focus { border-color: #6366f1; background: white; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
                .um-select { appearance: none; cursor: pointer; }

                .um-btn { padding: 10px 18px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; transition: all 0.2s; white-space: nowrap; }
                .um-btn--primary { background: #6366f1; color: white; flex: 1; }
                .um-btn--primary:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
                .um-btn--primary:disabled { opacity: 0.6; cursor: not-allowed; }
                .um-btn--reset { background: #f1f5f9; color: #64748b; padding: 10px 14px; }
                .um-btn--reset:hover { background: #e2e8f0; color: #374151; }
                .um-btn--cancel { flex: 1; background: #f1f5f9; color: #64748b; }
                .um-btn--cancel:hover { background: #e2e8f0; }
                .um-btn--save { flex: 2; background: #6366f1; color: white; }
                .um-btn--save:hover { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
                .um-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }

                /* Active filter tags */
                .um-active-filters { display: flex; align-items: center; gap: 8px; margin-top: 14px; padding-top: 14px; border-top: 1px solid #f1f5f9; flex-wrap: wrap; }
                .um-filter-label { font-size: 0.72rem; font-weight: 600; color: #94a3b8; }
                .um-filter-tag { display: inline-flex; align-items: center; gap: 6px; background: #f1f5f9; color: #374151; font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
                .um-filter-tag button { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 0.9rem; line-height: 1; padding: 0; margin-left: 2px; }
                .um-filter-tag button:hover { color: #ef4444; }

                /* Loading */
                .um-loading { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; color: #94a3b8; gap: 12px; }
                .um-spinner-lg { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Table */
                .um-table-card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden; }
                .um-table-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
                .um-table-title { font-size: 0.88rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px; }
                .um-tbl-badge { background: #f1f5f9; color: #64748b; font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
                .um-pill { background: #f1f5f9; color: #64748b; font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 50px; }
                .um-table { width: 100%; border-collapse: collapse; }
                .um-table thead tr { background: #f8fafc; }
                .um-table th { padding: 10px 16px; font-size: 0.68rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
                .um-table td { padding: 12px 16px; border-bottom: 1px solid #f8fafc; font-size: 0.85rem; vertical-align: middle; }
                .um-table tbody tr:last-child td { border-bottom: none; }
                .um-table tbody tr:hover { background: #fafbff; }

                /* User cell */
                .um-user-cell { display: flex; align-items: center; gap: 10px; }
                .um-avatar { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 2px solid #e2e8f0; }
                .um-avatar--lg { width: 42px; height: 42px; }
                .um-avatar img { width: 100%; height: 100%; object-fit: cover; }
                .um-user-name { font-weight: 600; color: #1e293b; font-size: 0.875rem; }
                .um-user-uname { font-size: 0.7rem; color: #94a3b8; }

                /* Role badge */
                .um-role-badge { display: inline-flex; align-items: center; font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
                .um-td-muted { color: #64748b; font-size: 0.82rem; }
                .um-verified { display: inline-flex; align-items: center; font-size: 0.75rem; font-weight: 600; color: #04bd20; }
                .um-pending { display: inline-flex; align-items: center; font-size: 0.75rem; font-weight: 600; color: #f59e0b; }
                .um-status-pill { font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.04em; }

                /* Actions */
                .um-actions { display: flex; gap: 5px; justify-content: flex-end; }
                .um-act-btn { width: 30px; height: 30px; border-radius: 8px; border: 1.5px solid; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; cursor: pointer; transition: all 0.15s; background: transparent; }
                .um-edit { border-color: #bfdbfe; color: #3b82f6; }
                .um-edit:hover { background: #eff6ff; }
                .um-block { border-color: #fed7aa; color: #f97316; }
                .um-block:hover { background: #fff7ed; }
                .um-unblock { border-color: #a7f3d0; color: #10b981; }
                .um-unblock:hover { background: #ecfdf5; }
                .um-del { border-color: #fecaca; color: #ef4444; }
                .um-del:hover { background: #fff5f5; }

                /* Empty */
                .um-empty { text-align: center; padding: 60px 20px; color: #94a3b8; }
                .um-empty i { font-size: 3rem; color: #e2e8f0; display: block; margin-bottom: 12px; }
                .um-empty p { font-size: 0.85rem; margin: 0 0 16px; }

                /* Pagination */
                .um-table-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid #f1f5f9; flex-wrap: wrap; gap: 8px; }
                .um-page-info { font-size: 0.78rem; color: #94a3b8; }
                .um-pages { display: flex; gap: 4px; }
                .um-page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; color: #374151; font-size: 0.8rem; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
                .um-page-btn:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; }
                .um-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .um-page-active { background: #6366f1 !important; border-color: #6366f1 !important; color: white !important; }
                .um-ellipsis { color: #94a3b8; font-size: 0.8rem; width: 28px; display: flex; align-items: center; justify-content: center; }

                /* Edit Modal */
                .um-modal-overlay { position: fixed; inset: 0; background: rgba(10,14,30,0.6); backdrop-filter: blur(6px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .um-modal-card { background: white; border-radius: 18px; width: 100%; max-width: 480px; box-shadow: 0 30px 60px rgba(0,0,0,0.2); overflow: hidden; animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .um-modal-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; background: #f8fafc; }
                .um-modal-user { display: flex; align-items: center; gap: 12px; }
                .um-modal-title { margin: 0 0 4px; font-size: 1rem; font-weight: 800; color: #0f172a; }
                .um-close-btn { background: none; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; transition: color 0.15s; flex-shrink: 0; }
                .um-close-btn:hover { color: #ef4444; }
                .um-modal-body { padding: 24px; }
                .um-modal-footer { display: flex; gap: 12px; margin-top: 8px; }

                @media (max-width: 768px) {
                    .um-stats { grid-template-columns: repeat(2, 1fr); }
                    .um-filter-row { flex-direction: column; }
                    .um-field--grow, .um-field { width: 100%; }
                }
            `}</style>
        </div>
    );
}
