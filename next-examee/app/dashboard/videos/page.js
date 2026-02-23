"use client";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Link from "next/link";
import ContentContext from '../../../context/ContentContext';
import * as GlobalUrls from "../../../utils/GlobalURL";
import { toast } from "react-toastify";

export default function DashboardVideosPage() {
    const context = useContext(ContentContext);
    const { searchDashContent, dasVideo, getVideo, deleteVideo } = context;

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState("sciTechnology");
    const [status, setStatus] = useState("public");
    const [isloading, setIsloading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalVideo, setModalVideo] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentVideos = dasVideo.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(dasVideo.length / itemsPerPage);

    useEffect(() => { getVideo(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true);
        try {
            const res = await searchDashContent(`${GlobalUrls.SEARDASHCHCONTENT_URL}?search=${search}&category=${category}&status=${status}&type=video`);
            if (res.success === false) toast.warning(res.message || "No matching content found");
        } catch (error) { console.error(error); }
        finally { setIsloading(false); }
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
                    <p className="dc-sub">{dasVideo.length} videos published</p>
                </div>
                <Link href="/uploadVideo" className="dc-add-btn">
                    <i className="fa-solid fa-plus me-2"></i>Upload Video
                </Link>
            </div>

            {/* Search */}
            <div className="dc-search-card">
                <form onSubmit={handleSubmit} className="row g-3 align-items-end">
                    <div className="col-md-6">
                        <label className="dc-label">Search Videos</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-search"></i></span>
                            <input type="text" className="dc-input" placeholder="Video title, description..." value={search} onChange={e => setSearch(e.target.value)} />
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
                            {isloading ? <div className="dc-spinner"></div> : <><i className="fa-solid fa-search me-2"></i>Search</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Grid */}
            {isloading ? (
                <div className="dc-loading"><div className="dc-spinner-lg"></div><p>Loading videos...</p></div>
            ) : (
                <>
                    {currentVideos.length === 0 ? (
                        <div className="dc-empty">
                            <i className="fa-solid fa-circle-play"></i>
                            <h3>No videos found</h3>
                            <p>Try adjusting your search filters or upload new content.</p>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {currentVideos.map((data) => {
                                const cfg = statusCfg[data?.status] || statusCfg.draft;
                                return (
                                    <div className="col-12 col-md-6 col-lg-4" key={data._id}>
                                        <div className="dc-video-card">
                                            <div className="dc-video-embed">
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${data?.fileUrl}`}
                                                    title={data?.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                            <div className="dc-video-body">
                                                <div className="dc-video-top">
                                                    <h3 className="dc-video-title">{data?.title}</h3>
                                                    <span className="dc-status-pill" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                                </div>
                                                <p className="dc-video-desc">{data?.description || 'No description provided.'}</p>
                                                <div className="dc-video-footer">
                                                    <span className="dc-td-muted"><i className="fa-solid fa-calendar-days me-1"></i>{data?.updatedAt?.slice(0, 10)}</span>
                                                    <div className="dc-actions">
                                                        <button className="dc-action-btn dc-edit" title="Edit"><i className="fa-solid fa-edit"></i></button>
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
                            <span className="dc-page-info">Page {currentPage} of {totalPages}</span>
                            <div className="dc-pages">
                                <button className="dc-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><i className="fa-solid fa-chevron-left"></i></button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} className={`dc-page-btn ${currentPage === i + 1 ? 'dc-page-active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
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
                .dc-add-btn { background: linear-gradient(135deg,#8b5cf6,#6366f1); color: white; border: none; border-radius: 10px; padding: 10px 20px; font-size: 0.86rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.2s; box-shadow: 0 4px 12px rgba(139,92,246,0.3); }
                .dc-add-btn:hover { transform: translateY(-1px); color: white; }
                .dc-search-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 24px; }
                .dc-label { font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 6px; display: block; }
                .dc-input-wrap { position: relative; }
                .dc-input-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.8rem; pointer-events: none; }
                .dc-input { width: 100%; padding: 10px 13px 10px 34px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.875rem; color: #0f172a; background: #f8fafc; outline: none; transition: all 0.2s; font-family: inherit; }
                .dc-input:focus { border-color: #8b5cf6; background: white; box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
                .dc-select { appearance: none; cursor: pointer; }
                .dc-search-btn { padding: 10px 16px; background: #0f172a; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .dc-search-btn:hover { background: #1e293b; }
                .dc-search-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .dc-loading { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; color: #94a3b8; gap: 12px; }
                .dc-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                .dc-spinner-lg { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #8b5cf6; border-radius: 50%; animation: spin 0.7s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .dc-empty { text-align: center; padding: 60px 20px; color: #94a3b8; }
                .dc-empty i { font-size: 3rem; color: #e2e8f0; display: block; margin-bottom: 12px; }
                .dc-empty h3 { font-size: 1rem; font-weight: 700; color: #374151; }
                .dc-empty p { font-size: 0.85rem; }
                .dc-video-card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; height: 100%; transition: all 0.2s; }
                .dc-video-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
                .dc-video-embed { position: relative; padding-bottom: 55%; height: 0; background: #0f172a; }
                .dc-video-embed iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
                .dc-video-body { padding: 16px; }
                .dc-video-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 6px; }
                .dc-video-title { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.35; max-height: 40px; overflow: hidden; }
                .dc-status-pill { font-size: 0.68rem; font-weight: 700; padding: 3px 9px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.04em; flex-shrink: 0; }
                .dc-video-desc { font-size: 0.77rem; color: #64748b; margin: 0 0 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .dc-video-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid #f1f5f9; }
                .dc-td-muted { color: #94a3b8; font-size: 0.78rem; }
                .dc-actions { display: flex; gap: 6px; }
                .dc-action-btn { width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; cursor: pointer; transition: all 0.15s; background: transparent; }
                .dc-edit { border-color: #bfdbfe; color: #3b82f6; }
                .dc-edit:hover { background: #eff6ff; border-color: #3b82f6; }
                .dc-del { border-color: #fecaca; color: #ef4444; }
                .dc-del:hover { background: #fff5f5; border-color: #ef4444; }
                .dc-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 28px; flex-wrap: wrap; gap: 10px; }
                .dc-page-info { font-size: 0.8rem; color: #94a3b8; }
                .dc-pages { display: flex; gap: 4px; }
                .dc-page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; color: #374151; font-size: 0.8rem; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
                .dc-page-btn:hover:not(:disabled) { border-color: #8b5cf6; color: #8b5cf6; }
                .dc-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .dc-page-active { background: #8b5cf6 !important; border-color: #8b5cf6 !important; color: white !important; }
            `}</style>
        </div>
    );
}
