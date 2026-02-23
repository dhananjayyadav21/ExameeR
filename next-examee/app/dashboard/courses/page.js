"use client";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Link from "next/link";
import ContentContext from '../../../context/ContentContext';
import * as GlobalUrls from "../../../utils/GlobalURL";
import { toast } from "react-toastify";

export default function DashboardCoursesPage() {
    const context = useContext(ContentContext);
    const { searchDashContent, dasCourse, getCourse, deleteCourse } = context;

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState("sciTechnology");
    const [status, setStatus] = useState("public");
    const [isloading, setIsloading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalCourse, setModalCourse] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentCourses = dasCourse.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(dasCourse.length / itemsPerPage);

    useEffect(() => { getCourse(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true);
        try {
            const res = await searchDashContent(`${GlobalUrls.SEARDASHCHCONTENT_URL}?search=${search}&category=${category}&status=${status}&type=course`);
            if (res.success === false) toast.warning(res.message || "No matching content found");
        } catch (error) { console.error(error); }
        finally { setIsloading(false); }
    };

    const deleteConfirm = async (course) => {
        const res = await deleteCourse(course._id);
        setShowModal(false);
        if (res.success) { toast.success(res.message || "Course deleted!"); getCourse(); }
        else toast.error(res.message || "Failed to delete course!");
    };

    const statusCfg = { public: { color: '#04bd20', bg: 'rgba(4,189,32,0.1)', label: 'Live' }, draft: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Draft' }, archived: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Archived' } };

    return (
        <div className="dc-page">
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={() => deleteConfirm(modalCourse)}
                heading={`Delete "${modalCourse?.title}"?`} subHeading="This action cannot be undone." />

            {/* Header */}
            <div className="dc-header">
                <div>
                    <h1 className="dc-title">Courses Management</h1>
                    <p className="dc-sub">{dasCourse.length} total courses in your library</p>
                </div>
                <Link href="/uploadCourse" className="dc-add-btn">
                    <i className="fa-solid fa-plus me-2"></i>New Course
                </Link>
            </div>

            {/* Search Card */}
            <div className="dc-search-card">
                <form onSubmit={handleSubmit} className="row g-3 align-items-end">
                    <div className="col-md-6">
                        <label className="dc-label">Search</label>
                        <div className="dc-input-wrap">
                            <span className="dc-input-icon"><i className="fa-solid fa-search"></i></span>
                            <input type="text" className="dc-input" placeholder="Course title, mentor..." value={search} onChange={e => setSearch(e.target.value)} />
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
                        <div className="d-flex gap-2">
                            <div className="dc-input-wrap flex-grow-1">
                                <span className="dc-input-icon"><i className="fa-solid fa-circle-dot"></i></span>
                                <select className="dc-input dc-select" value={status} onChange={e => setStatus(e.target.value)}>
                                    <option value="public">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <button type="submit" className="dc-search-btn" disabled={isloading}>
                                {isloading ? <div className="dc-spinner"></div> : <i className="fa-solid fa-search"></i>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Content */}
            {isloading ? (
                <div className="dc-loading"><div className="dc-spinner-lg"></div><p>Searching courses...</p></div>
            ) : (
                <>
                    {currentCourses.length === 0 ? (
                        <div className="dc-empty">
                            <i className="fa-solid fa-graduation-cap"></i>
                            <h3>No courses found</h3>
                            <p>Try adjusting your search filters or add a new course.</p>
                            <Link href="/uploadCourse" className="dc-add-btn">Create First Course</Link>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {currentCourses.map((course) => {
                                const cfg = statusCfg[course.status] || statusCfg.draft;
                                return (
                                    <div className="col-12 col-md-6 col-lg-4" key={course._id}>
                                        <div className="dc-course-card">
                                            <div className="dc-course-img">
                                                <img src={course.courseImage ? `https://lh3.googleusercontent.com/d/${course.courseImage}` : "/assets/img/cource.jpg"} alt={course.title} />
                                                <span className="dc-status-badge" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                            </div>
                                            <div className="dc-course-body">
                                                <h3 className="dc-course-title">{course.title}</h3>
                                                <p className="dc-course-desc">{course.description}</p>
                                                <div className="dc-course-meta">
                                                    <span><i className="fa-solid fa-chalkboard-user" style={{ color: '#0ea5e9' }}></i> {course.mentor}</span>
                                                    <span><i className="fa-solid fa-signal" style={{ color: '#8b5cf6' }}></i> {course.courseLevel || 'All Levels'}</span>
                                                    <span><i className="fa-solid fa-clock" style={{ color: '#f59e0b' }}></i> {course.duration || 'N/A'}</span>
                                                    <span><i className="fa-solid fa-play-circle" style={{ color: '#04bd20' }}></i> {course.lectures?.length || 0} Lessons</span>
                                                </div>
                                                <div className="dc-course-footer">
                                                    <span className="dc-price">₹{course.offerPrice || course.price || '0'}</span>
                                                    <div className="dc-actions">
                                                        <button className="dc-action-btn dc-edit" title="Edit"><i className="fa-solid fa-edit"></i></button>
                                                        <button className="dc-action-btn dc-del" title="Delete" onClick={() => { setModalCourse(course); setShowModal(true); }}>
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
                .dc-add-btn { background: linear-gradient(135deg,#0ea5e9,#6366f1); color: white; border: none; border-radius: 10px; padding: 10px 20px; font-size: 0.86rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.2s; box-shadow: 0 4px 12px rgba(14,165,233,0.3); }
                .dc-add-btn:hover { transform: translateY(-1px); color: white; box-shadow: 0 6px 18px rgba(14,165,233,0.45); }

                /* Search */
                .dc-search-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 24px; }
                .dc-label { font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 6px; display: block; }
                .dc-input-wrap { position: relative; }
                .dc-input-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.8rem; pointer-events: none; }
                .dc-input { width: 100%; padding: 10px 13px 10px 34px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.875rem; color: #0f172a; background: #f8fafc; outline: none; transition: all 0.2s; font-family: inherit; }
                .dc-input:focus { border-color: #0ea5e9; background: white; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
                .dc-select { appearance: none; cursor: pointer; }
                .dc-search-btn { padding: 10px 16px; background: #0f172a; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; white-space: nowrap; }
                .dc-search-btn:hover { background: #1e293b; }
                .dc-search-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                /* Loading */
                .dc-loading { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; color: #94a3b8; gap: 12px; }
                .dc-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                .dc-spinner-lg { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #0ea5e9; border-radius: 50%; animation: spin 0.7s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Empty */
                .dc-empty { text-align: center; padding: 60px 20px; color: #94a3b8; }
                .dc-empty i { font-size: 3rem; margin-bottom: 16px; color: #e2e8f0; }
                .dc-empty h3 { font-size: 1rem; font-weight: 700; color: #374151; margin-bottom: 6px; }
                .dc-empty p { font-size: 0.85rem; margin-bottom: 20px; }

                /* Course Cards */
                .dc-course-card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; height: 100%; transition: all 0.2s; }
                .dc-course-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
                .dc-course-img { position: relative; height: 170px; overflow: hidden; background: #f1f5f9; }
                .dc-course-img img { width: 100%; height: 100%; object-fit: cover; }
                .dc-status-badge { position: absolute; top: 10px; right: 10px; font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.04em; backdrop-filter: blur(4px); }
                .dc-course-body { padding: 18px; }
                .dc-course-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0 0 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .dc-course-desc { font-size: 0.78rem; color: #64748b; margin: 0 0 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 32px; }
                .dc-course-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 10px; margin-bottom: 14px; }
                .dc-course-meta span { font-size: 0.75rem; color: #64748b; display: flex; align-items: center; gap: 5px; }
                .dc-course-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid #f1f5f9; }
                .dc-price { font-size: 1.1rem; font-weight: 800; color: #0f172a; }
                .dc-actions { display: flex; gap: 6px; }
                .dc-action-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; background: transparent; }
                .dc-edit { border-color: #bfdbfe; color: #3b82f6; }
                .dc-edit:hover { background: #eff6ff; border-color: #3b82f6; }
                .dc-del { border-color: #fecaca; color: #ef4444; }
                .dc-del:hover { background: #fff5f5; border-color: #ef4444; }

                /* Pagination */
                .dc-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 28px; flex-wrap: wrap; gap: 10px; }
                .dc-page-info { font-size: 0.8rem; color: #94a3b8; font-weight: 500; }
                .dc-pages { display: flex; gap: 4px; }
                .dc-page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; color: #374151; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
                .dc-page-btn:hover:not(:disabled) { border-color: #0ea5e9; color: #0ea5e9; }
                .dc-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .dc-page-active { background: #0ea5e9; border-color: #0ea5e9; color: white !important; }
            `}</style>
        </div>
    );
}
