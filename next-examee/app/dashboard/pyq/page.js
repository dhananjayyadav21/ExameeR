"use client";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Link from "next/link";
import ContentContext from '../../../context/ContentContext';
import * as GlobalUrls from "../../../utils/GlobalURL";
import { toast } from "react-toastify";

export default function DashboardPYQPage() {
    const context = useContext(ContentContext);
    const { searchDashContent, dashPYQ, getPYQ, deletePYQ } = context;

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState("sciTechnology");
    const [status, setStatus] = useState("public");
    const [isloading, setIsloading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalPYQ, setModalPYQ] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentPYQs = dashPYQ.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(dashPYQ.length / itemsPerPage);

    useEffect(() => { getPYQ(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true);
        try {
            const res = await searchDashContent(`${GlobalUrls.SEARDASHCHCONTENT_URL}?search=${search}&category=${category}&status=${status}&type=pyq`);
            if (res.success === false) toast.warning(res.message || "No matching content found");
        } catch (error) { console.error(error); }
        finally { setIsloading(false); }
    };

    const deleteConfirm = async (pyq) => {
        const res = await deletePYQ(pyq._id);
        setShowModal(false);
        if (res.success) { toast.success(res.message || "PYQ deleted!"); getPYQ(); }
        else toast.error(res.message || "Failed to delete PYQ!");
    };

    const statusCfg = { public: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Active' }, draft: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', label: 'Draft' }, archived: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Archived' } };

    return (
        <div className="dc-page">
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={() => deleteConfirm(modalPYQ)}
                heading={`Delete "${modalPYQ?.title}"?`} subHeading="This action cannot be undone." />

            {/* Header */}
            <div className="dc-header">
                <div>
                    <h1 className="dc-title">Previous Year Papers</h1>
                    <p className="dc-sub">{dashPYQ.length} question papers available</p>
                </div>
                <Link href="/uploadPYQ" className="dc-add-btn">
                    <i className="fa-solid fa-plus me-2"></i>Upload PYQ
                </Link>
            </div>

            {/* Search */}
            <div className="dc-search-card">
                <form onSubmit={handleSubmit} className="row g-3 align-items-end">
                    <div className="col-md-6">
                        <label className="dc-label">Search Papers</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-search"></i></span>
                            <input type="text" className="dc-input" placeholder="Title, year, subject..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <label className="dc-label">Category</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-layer-group"></i></span>
                            <select className="dc-input dc-select" value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="sciTechnology">Sci - Tech</option>
                                <option value="commerce">Commerce</option>
                                <option value="artscivils">Arts</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <label className="dc-label">Status</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-circle-dot"></i></span>
                            <select className="dc-input dc-select" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="public">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
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
                <div className="dc-loading"><div className="dc-spinner-lg"></div><p>Loading papers...</p></div>
            ) : (
                <div className="dc-table-card">
                    <div className="dc-table-header">
                        <span className="dc-table-title"><i className="fa-solid fa-file-invoice me-2" style={{ color: '#f59e0b' }}></i>All Question Papers</span>
                        <span className="dc-pill" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>{currentPYQs.length} of {dashPYQ.length}</span>
                    </div>
                    <div className="table-responsive">
                        <table className="dc-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '36%' }}>Title</th>
                                    <th>Year</th>
                                    <th>Subject</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPYQs && currentPYQs.length > 0 ? currentPYQs.map((data) => {
                                    const cfg = statusCfg[data?.status] || statusCfg.draft;
                                    return (
                                        <tr key={data._id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div className="dc-type-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                                                        <i className="fa-solid fa-file-invoice"></i>
                                                    </div>
                                                    <span className="dc-note-title">{data?.title}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="dc-year-badge">{data?.year}</span>
                                            </td>
                                            <td className="dc-td-muted">{data?.subject || '—'}</td>
                                            <td><span className="dc-cat-tag">{data?.category}</span></td>
                                            <td><span className="dc-status-pill" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div className="dc-actions">
                                                    <button className="dc-action-btn dc-edit" title="Edit"><i className="fa-solid fa-edit"></i></button>
                                                    <button className="dc-action-btn dc-del" title="Delete" onClick={() => { setModalPYQ(data); setShowModal(true); }}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="6" className="dc-empty-row">
                                            <i className="fa-solid fa-file-invoice"></i>
                                            <p>No question papers found. Try different filters.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="dc-table-footer">
                            <span className="dc-page-info">Showing {indexOfFirst + 1}–{Math.min(indexOfLast, dashPYQ.length)} of {dashPYQ.length}</span>
                            <div className="dc-pages">
                                <button className="dc-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><i className="fa-solid fa-chevron-left"></i></button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} className={`dc-page-btn ${currentPage === i + 1 ? 'dc-page-active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                ))}
                                <button className="dc-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}><i className="fa-solid fa-chevron-right"></i></button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                .dc-page { min-height: 100vh; }
                .dc-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
                .dc-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0; }
                .dc-sub { font-size: 0.8rem; color: #94a3b8; margin: 3px 0 0; }
                .dc-add-btn { background: linear-gradient(135deg,#f59e0b,#f97316); color: white; border: none; border-radius: 10px; padding: 10px 20px; font-size: 0.86rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.2s; box-shadow: 0 4px 12px rgba(245,158,11,0.3); }
                .dc-add-btn:hover { transform: translateY(-1px); color: white; }
                .dc-search-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 24px; }
                .dc-label { font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 6px; display: block; }
                .dc-input-wrap { position: relative; }
                .dc-input-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.8rem; pointer-events: none; }
                .dc-input { width: 100%; padding: 10px 13px 10px 34px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.875rem; color: #0f172a; background: #f8fafc; outline: none; transition: all 0.2s; font-family: inherit; }
                .dc-input:focus { border-color: #f59e0b; background: white; box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }
                .dc-select { appearance: none; cursor: pointer; }
                .dc-search-btn { padding: 10px 16px; background: #0f172a; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .dc-search-btn:hover { background: #1e293b; }
                .dc-search-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .dc-loading { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; color: #94a3b8; gap: 12px; }
                .dc-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                .dc-spinner-lg { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.7s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .dc-table-card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; }
                .dc-table-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
                .dc-table-title { font-size: 0.88rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; }
                .dc-pill { background: #f1f5f9; color: #64748b; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 50px; }
                .dc-table { width: 100%; border-collapse: collapse; }
                .dc-table thead tr { background: #f8fafc; }
                .dc-table th { padding: 10px 16px; font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
                .dc-table td { padding: 12px 16px; border-bottom: 1px solid #f8fafc; font-size: 0.85rem; vertical-align: middle; }
                .dc-table tbody tr:hover { background: #fafff8; }
                .dc-type-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; flex-shrink: 0; }
                .dc-note-title { font-weight: 600; color: #1e293b; }
                .dc-year-badge { background: rgba(14,165,233,0.1); color: #0ea5e9; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 8px; }
                .dc-cat-tag { background: #f1f5f9; color: #475569; font-size: 0.72rem; font-weight: 600; padding: 3px 8px; border-radius: 6px; }
                .dc-td-muted { color: #94a3b8; font-size: 0.8rem; }
                .dc-status-pill { font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.04em; }
                .dc-actions { display: flex; gap: 6px; justify-content: flex-end; }
                .dc-action-btn { width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; cursor: pointer; transition: all 0.15s; background: transparent; }
                .dc-edit { border-color: #bfdbfe; color: #3b82f6; }
                .dc-edit:hover { background: #eff6ff; border-color: #3b82f6; }
                .dc-del { border-color: #fecaca; color: #ef4444; }
                .dc-del:hover { background: #fff5f5; border-color: #ef4444; }
                .dc-empty-row { text-align: center; padding: 48px 20px; color: #94a3b8; }
                .dc-empty-row i { font-size: 2.5rem; color: #e2e8f0; display: block; margin-bottom: 8px; }
                .dc-empty-row p { font-size: 0.85rem; margin: 0; }
                .dc-table-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid #f1f5f9; flex-wrap: wrap; gap: 8px; }
                .dc-page-info { font-size: 0.78rem; color: #94a3b8; }
                .dc-pages { display: flex; gap: 4px; }
                .dc-page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; color: #374151; font-size: 0.8rem; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
                .dc-page-btn:hover:not(:disabled) { border-color: #f59e0b; color: #f59e0b; }
                .dc-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .dc-page-active { background: #f59e0b !important; border-color: #f59e0b !important; color: white !important; }
            `}</style>
        </div>
    );
}
