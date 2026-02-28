"use client";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Link from "next/link";
import '../../../styles/dashboard-content.css';
import { useRouter } from "next/navigation";
import ContentContext from '../../../context/ContentContext';
import * as GlobalUrls from "../../../utils/GlobalURL";
import { toast } from "react-toastify";

export default function DashboardNotesPage() {
    const context = useContext(ContentContext);
    const { searchDashContent, dashNotes, getNote, deleteNotes } = context;
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState("sciTechnology");
    const [status, setStatus] = useState("");
    const [isloading, setIsloading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalNote, setModalNote] = useState(null);
    const [previewPdf, setPreviewPdf] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentNotes = (dashNotes || []).slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil((dashNotes || []).length / itemsPerPage);

    useEffect(() => { getNote(); }, []);

    // Auto-search when dropdowns change
    useEffect(() => { doSearch(search, category, status); }, [category, status]);

    const doSearch = async (s = search, c = category, st = status) => {
        setIsloading(true);
        try {
            const res = await searchDashContent(`${GlobalUrls.SEARDASHCHCONTENT_URL}?search=${s}&category=${c}&status=${st}&type=notes`);
            if (res.success === false) toast.warning(res.message || "No matching content found");
            setCurrentPage(1);
        } catch (error) { console.error(error); }
        finally { setIsloading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        doSearch();
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
    };

    const handleEdit = (note) => {
        router.push(`/dashboard/uploadNotes?edit=${note._id}`);
    };

    const deleteConfirm = async (note) => {
        const res = await deleteNotes(note._id);
        setShowModal(false);
        if (res.success) { toast.success(res.message || "Note deleted!"); getNote(); }
        else toast.error(res.message || "Failed to delete note!");
    };

    const statusCfg = { public: { color: '#04bd20', bg: 'rgba(4,189,32,0.1)', label: 'Published' }, draft: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Draft' }, archived: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Archived' } };

    return (
        <div className="dc-page">
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={() => deleteConfirm(modalNote)}
                heading={`Delete "${modalNote?.title}"?`} subHeading="This action cannot be undone." />

            {/* PDF Preview Modal */}
            {previewPdf && (
                <div className="pdf-preview-overlay">
                    <div className="pdf-preview-container">
                        <div className="pdf-preview-header">
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Document Preview</h3>
                            <button className="pdf-close-btn" onClick={() => setPreviewPdf(null)}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: '#f8fafc' }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '56px', height: '80px', background: 'rgba(15,15,15,1)', zIndex: 10 }}></div>
                            <iframe
                                src={`https://drive.google.com/file/d/${previewPdf}/preview`}
                                className="pdf-iframe"
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                allow="autoplay"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="dc-header">
                <div>
                    <h1 className="dc-title">Study Notes</h1>
                    <p className="dc-sub">Manage and publish your PDFs, documents and cheat sheets</p>
                </div>
                <Link href="/dashboard/uploadNotes" className="dc-add-btn btn-success">
                    <i className="fa-solid fa-plus me-2"></i>Upload New
                </Link>
            </div>

            {/* Search Card */}
            <div className="dc-search-card">
                <form onSubmit={handleSubmit} className="row g-3 align-items-end">
                    <div className="col-md-5">
                        <label className="dc-label">Search</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-search"></i></span>
                            <input type="text" className="dc-input" placeholder="Note title, professor… (Enter to search)" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearchKeyDown} />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label className="dc-label">Category</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-layer-group"></i></span>
                            <select className="dc-input dc-select" value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="sciTechnology">Sci - Technology</option>
                                <option value="commerce">Commerce</option>
                                <option value="artscivils">Arts &amp; Civils</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex gap-2">
                            <div className="dc-input-wrap flex-grow-1">
                                <span className="dc-input-icon"><i className="fa-solid fa-circle-dot"></i></span>
                                <select className="dc-input dc-select" value={status} onChange={e => setStatus(e.target.value)}>
                                    <option value="">All Status</option>
                                    <option value="public">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <button type="submit" className="dc-search-btn" title="Search" disabled={isloading}>
                                {isloading ? <div className="dc-spinner"></div> : <i className="fa-solid fa-magnifying-glass"></i>}
                            </button>
                            {(search || category !== 'sciTechnology' || status !== 'public') && (
                                <button type="button" className="dc-clear-btn" title="Clear Filters" onClick={() => { setSearch(''); setCategory('sciTechnology'); setStatus('public'); getNote(); }}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </form>
                <div className="dc-search-info mt-2">
                    <span className="dc-results-badge" style={{ color: '#04bd20', background: 'rgba(4,189,32,0.05)', borderColor: 'rgba(4,189,32,0.1)' }}>
                        <i className="fa-solid fa-filter me-1"></i>
                        Found {dashNotes.length} notes
                    </span>
                </div>
            </div>

            {/* Table */}
            {isloading ? (
                <div className="dc-loading"><div className="dc-spinner-lg"></div><p>Searching notes...</p></div>
            ) : (
                <div className="dc-table-card">
                    <div className="dc-table-header">
                        <span className="dc-table-title"><i className="fa-solid fa-file-pdf me-2" style={{ color: '#04bd20' }}></i>All Notes</span>
                        <span className="dc-pill">{currentNotes.length} of {dashNotes.length}</span>
                    </div>
                    <div className="table-responsive">
                        <table className="dc-table">
                            <thead>
                                <tr>
                                    <th>Content Title</th>
                                    <th>Category</th>
                                    <th>Professor</th>
                                    <th>Upload Date</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentNotes && currentNotes.length > 0 ? currentNotes.map((data) => {
                                    const cfg = statusCfg[data?.status] || statusCfg.draft;
                                    return (
                                        <tr key={data._id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div className="dc-type-icon" style={{ background: 'rgba(4,189,32,0.1)', color: '#04bd20' }}>
                                                        <i className="fa-solid fa-file-pdf"></i>
                                                    </div>
                                                    <span className="dc-note-title">{data?.title}</span>
                                                </div>
                                            </td>
                                            <td><span className="dc-cat-tag">{data?.category}</span></td>
                                            <td className="dc-td-muted">{data?.professor || '—'}</td>
                                            <td className="dc-td-muted">{data?.createdAt?.slice(0, 10)}</td>
                                            <td><span className="dc-status-pill" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div className="dc-actions">
                                                    {data?.fileUrl && (
                                                        <button className="dc-action-btn dc-preview" title="Preview PDF" onClick={() => setPreviewPdf(data.fileUrl)}>
                                                            <i className="fa-solid fa-eye"></i>
                                                        </button>
                                                    )}
                                                    <button className="dc-action-btn dc-edit" title="Edit" onClick={() => handleEdit(data)}><i className="fa-solid fa-edit"></i></button>
                                                    <button className="dc-action-btn dc-del" title="Delete" onClick={() => { setModalNote(data); setShowModal(true); }}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="6" className="dc-empty-row">
                                            <i className="fa-solid fa-file-pdf"></i>
                                            <p>No notes found. Try different filters.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="dc-pagination">
                            <span className="dc-page-info">Showing page {currentPage} of {totalPages}</span>
                            <div className="dc-pages">
                                <button className="dc-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><i className="fa-solid fa-chevron-left"></i></button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} className={`dc-page-btn ${currentPage === i + 1 ? 'dc-page-active' : ''}`} onClick={() => setCurrentPage(i + 1)} style={{ '--pc': '#04bd20' }}>{i + 1}</button>
                                ))}
                                <button className="dc-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}><i className="fa-solid fa-chevron-right"></i></button>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

