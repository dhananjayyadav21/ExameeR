"use client";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Link from "next/link";
import '../../../styles/dashboard-content.css';
import { useRouter } from "next/navigation";
import ContentContext from '../../../context/ContentContext';
import * as GlobalUrls from "../../../utils/GlobalURL";
import { toast } from "react-toastify";
import { academicOptions } from "../../../constants/academicOptions";

export default function DashboardPYQPage() {
    const context = useContext(ContentContext);
    const { searchDashContent, dashPYQ, getPYQ, deletePYQ } = context;
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState("sciTechnology");
    const [status, setStatus] = useState("");
    const [course, setCourse] = useState("");
    const [semester, setSemester] = useState("");
    const [university, setUniversity] = useState("");
    const [isloading, setIsloading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalPYQ, setModalPYQ] = useState(null);
    const [previewPdf, setPreviewPdf] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentPYQs = (dashPYQ || []).slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil((dashPYQ || []).length / itemsPerPage);

    useEffect(() => { getPYQ(); }, []);

    // Auto-search when dropdowns change
    // Auto-search when dropdowns change
    useEffect(() => { doSearch(search, category, status, course, semester, university); }, [category, status, course, semester, university]);

    const doSearch = async (s = search, c = category, st = status, cr = course, sm = semester, un = university) => {
        setIsloading(true);
        try {
            const res = await searchDashContent(`${GlobalUrls.SEARDASHCHCONTENT_URL}?search=${s}&category=${c}&status=${st}&course=${cr}&semester=${sm}&university=${un}&type=pyq`);
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

    const handleEdit = (pyq) => {
        router.push(`/dashboard/uploadPYQ?edit=${pyq._id}`);
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
                    <h1 className="dc-title">Previous Year Questions</h1>
                    <p className="dc-sub">Organize exam papers by year, subject and category</p>
                </div>
                <Link href="/dashboard/uploadPYQ" className="dc-add-btn btn-success">
                    <i className="fa-solid fa-plus me-2"></i>Add Question Paper
                </Link>
            </div>

            {/* Search Card */}
            <div className="dc-search-card">
                <form onSubmit={handleSubmit} className="row g-3 align-items-end">
                    <div className="col-md-6">
                        <label className="dc-label">Search</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-search"></i></span>
                            <input type="text" className="dc-input" placeholder="Year, subject, title… (Enter to search)" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearchKeyDown} />
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
                    <div className="col-md-3">
                        <label className="dc-label">Course</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-graduation-cap"></i></span>
                            <select className="dc-input dc-select" value={course} onChange={e => setCourse(e.target.value)}>
                                <option value="">All Courses</option>
                                {academicOptions.courses.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label className="dc-label">Semester</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-clock"></i></span>
                            <select className="dc-input dc-select" value={semester} onChange={e => setSemester(e.target.value)}>
                                <option value="">All Semesters</option>
                                {academicOptions.semesters.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label className="dc-label">University</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-university"></i></span>
                            <select className="dc-input dc-select" value={university} onChange={e => setUniversity(e.target.value)}>
                                <option value="">All Universities</option>
                                {academicOptions.universities.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="dc-label">Status & Action</label>
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
                            {(search || category !== 'sciTechnology' || status !== '' || course !== '' || semester !== '' || university !== '') && (
                                <button type="button" className="dc-clear-btn" title="Clear Filters" onClick={() => { setSearch(''); setCategory('sciTechnology'); setStatus(''); setCourse(''); setSemester(''); setUniversity(''); getPYQ(); }}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </form>
                <div className="dc-search-info mt-2">
                    <span className="dc-results-badge" style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.1)' }}>
                        <i className="fa-solid fa-filter me-1"></i>
                        Found {dashPYQ.length} records
                    </span>
                </div>
            </div>

            {/* Table */}
            {isloading ? (
                <div className="dc-loading"><div className="dc-spinner-lg"></div><p>Searching records...</p></div>
            ) : (
                <div className="dc-table-card">
                    <div className="dc-table-header">
                        <span className="dc-table-title"><i className="fa-solid fa-file-invoice me-2" style={{ color: '#f59e0b' }}></i>Content List</span>
                        <span className="dc-pill">{currentPYQs.length} of {dashPYQ.length} items</span>
                    </div>
                    <div className="table-responsive">
                        <table className="dc-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
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
                                                    <span className="dc-item-title">{data?.title}</span>
                                                </div>
                                            </td>
                                            <td><span className="dc-year-badge">{data?.year}</span></td>
                                            <td className="dc-td-muted">{data?.subject}</td>
                                            <td><span className="dc-cat-tag">{data?.category}</span></td>
                                            <td><span className="dc-status-pill" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div className="dc-actions">
                                                    {data?.fileUrl && (
                                                        <button className="dc-action-btn dc-preview" title="Preview PDF" onClick={() => setPreviewPdf(data.fileUrl)}>
                                                            <i className="fa-solid fa-eye"></i>
                                                        </button>
                                                    )}
                                                    <button className="dc-action-btn dc-edit" title="Edit" onClick={() => handleEdit(data)}><i className="fa-solid fa-edit"></i></button>
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
                                            <p>No records found. Try different filters.</p>
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
                                    <button key={i} className={`dc-page-btn ${currentPage === i + 1 ? 'dc-page-active' : ''}`} onClick={() => setCurrentPage(i + 1)} style={{ '--pc': '#f59e0b' }}>{i + 1}</button>
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
                .dc-add-btn { text-decoration: none; }

                /* Search */
                .dc-search-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 24px; }
                .dc-label { font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 6px; display: block; }
                .dc-input-wrap { position: relative; }
                .dc-input-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.8rem; pointer-events: none; }
                .dc-input { width: 100%; padding: 10px 13px 10px 34px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.875rem; color: #0f172a; background: #f8fafc; outline: none; transition: all 0.2s; font-family: inherit; }
                .dc-input:focus { border-color: #f59e0b; background: white; box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }
                .dc-select { appearance: none; cursor: pointer; }
                
                .dc-search-btn { width: 42px; height: 42px; background: #1e293b; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
                .dc-search-btn:hover { background: #0f172a; transform: scale(1.02); }
                .dc-search-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .dc-clear-btn { width: 42px; height: 42px; background: #f1f5f9; color: #64748b; border: 1.5px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
                .dc-clear-btn:hover { background: #fee2e2; color: #ef4444; border-color: #fecaca; }

                .dc-search-info { display: flex; align-items: center; gap: 8px; }
                .dc-results-badge { font-size: 0.72rem; font-weight: 700; border: 1px solid; padding: 3px 10px; border-radius: 50px; }

                /* Loading */
                .dc-loading { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; color: #94a3b8; gap: 12px; }
                .dc-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                .dc-spinner-lg { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.7s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Table Card */
                .dc-table-card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; }
                .dc-table-header { padding: 18px 24px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
                .dc-table-title { font-size: 0.9rem; font-weight: 700; color: #1e293b; }
                .dc-pill { font-size: 0.7rem; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 3px 10px; border-radius: 50px; }
                
                .dc-table { width: 100%; border-collapse: collapse; }
                .dc-table th { background: #f8fafc; padding: 12px 24px; font-size: 0.72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; }
                .dc-table td { padding: 16px 24px; border-bottom: 1px solid #f8fafc; font-size: 0.86rem; vertical-align: middle; }
                .dc-table tr:hover { background: #fcfdfd; }
                
                .dc-type-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
                .dc-item-title { font-weight: 700; color: #1e293b; }
                .dc-year-badge { background: rgba(14,165,233,0.1); color: #0ea5e9; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 6px; }
                .dc-cat-tag { font-size: 0.72rem; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 3px 9px; border-radius: 6px; text-transform: capitalize; }
                .dc-td-muted { color: #64748b; font-size: 0.8rem; }
                .dc-status-pill { font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.03em; }

                .dc-actions { display: flex; gap: 8px; justify-content: flex-end; }
                .dc-action-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; cursor: pointer; transition: all 0.2s; background: transparent; }
                .dc-edit { border-color: #bfdbfe; color: #3b82f6; }
                .dc-edit:hover { background: #eff6ff; border-color: #3b82f6; transform: scale(1.05); }
                .dc-preview { border-color: #d8b4fe; color: #a855f7; }
                .dc-preview:hover { background: #faf5ff; border-color: #a855f7; transform: scale(1.05); }
                .dc-del { border-color: #fecaca; color: #ef4444; }
                .dc-del:hover { background: #fff5f5; border-color: #ef4444; transform: scale(1.05); }

                .dc-empty-row { text-align: center; padding: 60px 20px; color: #94a3b8; }
                .dc-empty-row i { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.3; }

                /* Pagination */
                .dc-pagination { padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f1f5f9; background: #fcfdfd; }
                .dc-page-info { font-size: 0.78rem; color: #64748b; font-weight: 500; }
                .dc-pages { display: flex; gap: 5px; }
                .dc-page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; color: #64748b; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .dc-page-btn:hover:not(:disabled) { border-color: var(--pc); color: var(--pc); background: white; }
                .dc-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .dc-page-active { background: #f59e0b !important; border-color: #f59e0b !important; color: white !important; box-shadow: 0 4px 10px rgba(245,158,11,0.3); }

                /* PDF Preview Modal */
                .pdf-preview-overlay {
                    position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px);
                    z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;
                    animation: fadeIn 0.3s ease;
                }
                .pdf-preview-container {
                    background: white; border-radius: 20px; width: 100%; max-width: 900px; height: 90vh;
                    display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    animation: slideUp 0.4s cubic-bezier(0.32, 0.72, 0, 1);
                }
                .pdf-preview-header {
                    display: flex; align-items: center; justify-content: space-between; padding: 12px 20px;
                    background: #f8fafc; border-bottom: 1px solid #e2e8f0;
                }
                .pdf-close-btn {
                    width: 32px; height: 32px; border-radius: 50%; border: 1px solid #e2e8f0; background: white;
                    color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
                }
                .pdf-close-btn:hover { background: #fee2e2; color: #ef4444; border-color: #fecaca; }
                .pdf-iframe { width: 100%; border: none; background: #f1f5f9; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}

