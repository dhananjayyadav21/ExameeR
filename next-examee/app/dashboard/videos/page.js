"use client";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ContentContext from '../../../context/ContentContext';
import * as GlobalUrls from "../../../utils/GlobalURL";
import { toast } from "react-toastify";

export default function DashboardVideosPage() {
    const context = useContext(ContentContext);
    const { searchDashContent, dasVideo, getVideo, deleteVideo } = context;
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState("sciTechnology");
    const [status, setStatus] = useState("");
    const [isloading, setIsloading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalVideo, setModalVideo] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentVideos = (dasVideo || []).slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil((dasVideo || []).length / itemsPerPage);

    useEffect(() => { getVideo(); }, []);

    // Auto-search when dropdowns change
    useEffect(() => { doSearch(search, category, status); }, [category, status]);

    const doSearch = async (s = search, c = category, st = status) => {
        setIsloading(true);
        try {
            const res = await searchDashContent(`${GlobalUrls.SEARDASHCHCONTENT_URL}?search=${s}&category=${c}&status=${st}&type=video`);
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

    const handleEdit = (video) => {
        router.push(`/uploadVideo?edit=${video._id}`);
    };

    const deleteConfirm = async (video) => {
        const res = await deleteVideo(video._id);
        setShowModal(false);
        if (res.success) { toast.success(res.message || "Video deleted!"); getVideo(); }
        else toast.error(res.message || "Failed to delete video!");
    };

    const statusCfg = { public: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', label: 'Live' }, draft: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', label: 'Draft' }, archived: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Archived' } };

    return (
        <div className="dc-page">
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={() => deleteConfirm(modalVideo)}
                heading={`Delete "${modalVideo?.title}"?`} subHeading="This action cannot be undone." />

            {/* Header */}
            <div className="dc-header">
                <div>
                    <h1 className="dc-title">Video Lectures</h1>
                    <p className="dc-sub">Manage your educational video content and descriptions</p>
                </div>
                <Link href="/uploadVideo" className="dc-add-btn btn-success">
                    <i className="fa-solid fa-plus me-2"></i>Upload Video
                </Link>
            </div>

            {/* Search Card */}
            <div className="dc-search-card">
                <form onSubmit={handleSubmit} className="row g-3 align-items-end">
                    <div className="col-md-5">
                        <label className="dc-label">Search</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-search"></i></span>
                            <input type="text" className="dc-input" placeholder="Video title, description… (Enter to search)" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearchKeyDown} />
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
                                <button type="button" className="dc-clear-btn" title="Clear Filters" onClick={() => { setSearch(''); setCategory('sciTechnology'); setStatus('public'); getVideo(); }}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </form>
                <div className="dc-search-info mt-2">
                    <span className="dc-results-badge" style={{ color: '#8b5cf6', background: 'rgba(139,92,246,0.05)', borderColor: 'rgba(139,92,246,0.1)' }}>
                        <i className="fa-solid fa-filter me-1"></i>
                        Found {dasVideo.length} videos
                    </span>
                </div>
            </div>

            {/* Content */}
            {isloading ? (
                <div className="dc-loading"><div className="dc-spinner-lg"></div><p>Searching videos...</p></div>
            ) : (
                <>
                    {currentVideos.length === 0 ? (
                        <div className="dc-empty">
                            <i className="fa-solid fa-video"></i>
                            <h3>No videos found</h3>
                            <p>Try adjusting your search filters or add a new video.</p>
                            <Link href="/uploadVideo" className="dc-add-btn btn-success">Upload First Video</Link>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {currentVideos.map((data) => {
                                const cfg = statusCfg[data.status] || statusCfg.draft;
                                return (
                                    <div className="col-12 col-md-6 col-lg-4" key={data._id}>
                                        <div className="dc-video-card">
                                            <div className="dc-video-preview">
                                                <iframe width="100%" height="100%"
                                                    src={`https://www.youtube.com/embed/${data?.link?.split('v=')[1] || data?.link?.split('/').pop()}`}
                                                    title={data?.title} frameBorder="0" allowFullScreen></iframe>
                                                <span className="dc-v-status" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                            </div>
                                            <div className="dc-video-body">
                                                <h3 className="dc-video-title">{data?.title}</h3>
                                                <p className="dc-video-desc">{data?.description}</p>
                                                <div className="dc-video-footer">
                                                    <span className="dc-td-muted"><i className="fa-solid fa-calendar-days me-1"></i>{data?.updatedAt?.slice(0, 10)}</span>
                                                    <div className="dc-actions">
                                                        <button className="dc-action-btn dc-edit" title="Edit" onClick={() => handleEdit(data)}><i className="fa-solid fa-edit"></i></button>
                                                        <button className="dc-action-btn dc-del" title="Delete" onClick={() => { setModalVideo(data); setShowModal(true); }}>
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="dc-pagination">
                            <span className="dc-page-info">Showing page {currentPage} of {totalPages}</span>
                            <div className="dc-pages">
                                <button className="dc-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><i className="fa-solid fa-chevron-left"></i></button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} className={`dc-page-btn ${currentPage === i + 1 ? 'dc-page-active' : ''}`} onClick={() => setCurrentPage(i + 1)} style={{ '--pc': '#8b5cf6' }}>{i + 1}</button>
                                ))}
                                <button className="dc-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}><i className="fa-solid fa-chevron-right"></i></button>
                            </div>
                        </div>
                    )}
                </>
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
                .dc-input:focus { border-color: #8b5cf6; background: white; box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
                .dc-select { appearance: none; cursor: pointer; }
                
                .dc-search-btn { width: 42px; height: 42px; background: #1e293b; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
                .dc-search-btn:hover { background: #0f172a; transform: scale(1.02); }
                .dc-search-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .dc-clear-btn { width: 42px; height: 42px; background: #f1f5f9; color: #64748b; border: 1.5px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
                .dc-clear-btn:hover { background: #fee2e2; color: #ef4444; border-color: #fecaca; }

                .dc-search-info { display: flex; align-items: center; gap: 8px; }
                .dc-results-badge { font-size: 0.72rem; font-weight: 700; border: 1px solid; padding: 3px 10px; border-radius: 50px; }

                /* Loading/Empty */
                .dc-loading { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; color: #94a3b8; gap: 12px; }
                .dc-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                .dc-spinner-lg { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #8b5cf6; border-radius: 50%; animation: spin 0.7s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .dc-empty { text-align: center; padding: 60px 20px; color: #94a3b8; }
                .dc-empty i { font-size: 3rem; margin-bottom: 16px; opacity: 0.2; }
                .dc-empty h3 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 6px; }

                /* Video Card */
                .dc-video-card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; height: 100%; transition: all 0.2s; }
                .dc-video-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
                .dc-video-preview { height: 160px; background: #000; position: relative; }
                .dc-v-status { position: absolute; top: 10px; right: 10px; padding: 3px 10px; border-radius: 50px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; backdrop-filter: blur(4px); }
                .dc-video-body { padding: 16px; }
                .dc-video-title { font-size: 0.9rem; font-weight: 700; color: #1e293b; margin: 0 0 8px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 40px; }
                .dc-video-desc { font-size: 0.78rem; color: #64748b; margin: 0 0 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 34px; }
                .dc-video-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid #f1f5f9; }
                .dc-td-muted { color: #94a3b8; font-size: 0.75rem; }

                .dc-actions { display: flex; gap: 8px; }
                .dc-action-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; cursor: pointer; transition: all 0.2s; background: transparent; }
                .dc-edit { border-color: #bfdbfe; color: #3b82f6; }
                .dc-edit:hover { background: #eff6ff; border-color: #3b82f6; transform: scale(1.05); }
                .dc-del { border-color: #fecaca; color: #ef4444; }
                .dc-del:hover { background: #fff5f5; border-color: #ef4444; transform: scale(1.05); }

                /* Pagination */
                .dc-pagination { margin-top: 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
                .dc-page-info { font-size: 0.8rem; color: #64748b; font-weight: 500; }
                .dc-pages { display: flex; gap: 5px; }
                .dc-page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; color: #64748b; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .dc-page-btn:hover:not(:disabled) { border-color: var(--pc); color: var(--pc); background: white; }
                .dc-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .dc-page-active { background: #8b5cf6 !important; border-color: #8b5cf6 !important; color: white !important; box-shadow: 0 4px 10px rgba(139,92,246,0.3); }
            `}</style>
        </div>
    );
}

