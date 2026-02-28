"use client";
import React, { useContext, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ContentContext from '../../context/ContentContext'
import * as GlobalUrls from "../../utils/GlobalURL"

function DashboardContent() {
    const searchParams = useSearchParams();
    const context = useContext(ContentContext);
    const { MyNotes, MyPYQS, MyVideo, MyCourse, LatestData, getNote, getPYQ, getVideo, getCourse, getLatestUpload } = context;

    const category = searchParams.get('category') || 'sciTechnology';

    useEffect(() => {
        const token = typeof window !== 'undefined' && localStorage.getItem('token');
        const userRole = typeof window !== 'undefined' && localStorage.getItem("userRole");
        if (token) {
            getNote(`${GlobalUrls.GETNOTE_URL}?category=${category}`);
            getPYQ(`${GlobalUrls.GETPYQ_URL}?category=${category}`);
            getVideo(`${GlobalUrls.GETVideo_URL}?category=${category}`);
            getCourse(`${GlobalUrls.GETCourse_URL}?category=${category}`);
            if (userRole === "Admin" || userRole === "Instructor") {
                getLatestUpload(`${GlobalUrls.GETLATESTDATA_URL}?category=${category}`);
            }
        }
    }, [category]);

    const getBadgeColor = (status) => {
        if (status === "public") return { bg: "rgba(4,189,32,0.12)", color: "#039419", border: "rgba(4,189,32,0.25)" };
        if (status === "draft") return { bg: "rgba(245,158,11,0.12)", color: "#d97706", border: "rgba(245,158,11,0.25)" };
        if (status === "archived") return { bg: "rgba(220,53,69,0.12)", color: "#dc2626", border: "rgba(220,53,69,0.25)" };
        return { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" };
    };

    const stats = [
        { label: "Total Notes", value: MyNotes?.length || 0, icon: "fa-file-lines", color: "#04bd20", bg: "rgba(4,189,32,0.1)", trend: "+12%" },
        { label: "Total Courses", value: MyCourse?.length || 0, icon: "fa-book", color: "#6366f1", bg: "rgba(99,102,241,0.1)", trend: "+5%" },
        { label: "Video Lectures", value: MyVideo?.length || 0, icon: "fa-circle-play", color: "#0ea5e9", bg: "rgba(14,165,233,0.1)", trend: "+8%" },
        { label: "Question Papers", value: MyPYQS?.length || 0, icon: "fa-circle-question", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", trend: "+3%" },
    ];

    const quickActions = [
        { href: "/dashboard/uploadNotes", label: "Add Notes", icon: "fa-note-sticky", color: "#04bd20", bg: "rgba(4,189,32,0.08)" },
        { href: "/dashboard/uploadPYQ", label: "Add Questions", icon: "fa-file-invoice", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
        { href: "/dashboard/uploadVideo", label: "Upload Video", icon: "fa-video", color: "#6366f1", bg: "rgba(99,102,241,0.08)" },
        { href: "/dashboard/uploadCourse", label: "New Course", icon: "fa-graduation-cap", color: "#0ea5e9", bg: "rgba(14,165,233,0.08)" },
    ];

    return (
        <div className="db-page">
            {/* Header */}
            <div className="db-header mb-4">
                <div className="db-blob db-blob1"></div>
                <div className="db-blob db-blob2"></div>
                <div className="db-header-content">
                    <h1 className="db-title">Dashboard Overview</h1>
                    <p className="db-subtitle">Track your content performance and student engagement.</p>
                </div>
                <div className="db-header-actions">
                    <select className="db-cat-select">
                        <option value="sciTechnology">Sci - Technology</option>
                        <option value="commerce">Commerce</option>
                        <option value="artscivils">Arts &amp; Civils</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="row g-3 mb-4">
                {stats.map((stat, index) => (
                    <div className="col-6 col-xl-3" key={index}>
                        <div className="db-stat-card">
                            <div className="db-stat-icon" style={{ background: stat.bg }}>
                                <i className={`fa-solid ${stat.icon}`} style={{ color: stat.color }}></i>
                            </div>
                            <div className="db-stat-body">
                                <p className="db-stat-label">{stat.label}</p>
                                <div className="db-stat-row">
                                    <h3 className="db-stat-value">{stat.value}</h3>
                                    <span className="db-stat-trend">{stat.trend}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Uploads */}
            <div className="db-card mb-4">
                <div className="db-card-header">
                    <div>
                        <h2 className="db-card-title">Recent Uploads</h2>
                        <p className="db-card-sub">Latest content added to the platform</p>
                    </div>
                    <Link href="/dashboard/notes" className="db-view-all-btn">
                        View All <i className="fa-solid fa-arrow-right ms-1"></i>
                    </Link>
                </div>
                <div className="table-responsive">
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {LatestData && LatestData.length > 0 ? (
                                LatestData.map((e, i) => {
                                    const badge = getBadgeColor(e?.status);
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <span className="db-type-badge">{e?.type}</span>
                                            </td>
                                            <td className="db-title-cell">{e?.title}</td>
                                            <td className="db-date-cell">{e?.createdAt ? e.createdAt.slice(0, 10) : "N/A"}</td>
                                            <td>
                                                <span className="db-status-badge" style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                                                    {e?.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="db-empty-row">
                                        <i className="fa-solid fa-inbox me-2"></i>No recent uploads found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="db-card">
                <div className="db-card-header mb-3">
                    <div>
                        <h2 className="db-card-title">Quick Actions</h2>
                        <p className="db-card-sub">Upload new content instantly</p>
                    </div>
                </div>
                <div className="row g-3">
                    {quickActions.map((action, index) => (
                        <div className="col-6 col-md-3" key={index}>
                            <Link href={action.href} className="db-action-card" style={{ '--action-color': action.color, '--action-bg': action.bg }}>
                                <div className="db-action-icon" style={{ background: action.bg }}>
                                    <i className={`fa-solid ${action.icon}`} style={{ color: action.color }}></i>
                                </div>
                                <span className="db-action-label">{action.label}</span>
                                <i className="fa-solid fa-arrow-right db-action-arrow"></i>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .db-page { padding-bottom: 30px; }
                .db-header { 
                    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; 
                    background: linear-gradient(135deg, #0a1628 0%, #0d3320 100%);
                    padding: 32px;
                    border-radius: 20px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    margin-bottom: 32px !important;
                }
                .db-blob { position: absolute; border-radius: 50%; filter: blur(40px); opacity: 0.3; pointer-events: none; animation: float 8s infinite ease-in-out alternate; }
                @keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-10px, 15px) scale(1.1); } }
                .db-blob1 { width: 220px; height: 220px; background: #04bd20; top: -60px; right: 8%; animation-delay: 0s; }
                .db-blob2 { width: 160px; height: 160px; background: #0ea5e9; bottom: -50px; left: 18%; animation-delay: -4s; }
                .db-header-content { position: relative; z-index: 2; }
                .db-title { font-size: 1.6rem; font-weight: 800; color: white; margin: 0; letter-spacing: -0.02em; }
                .db-subtitle { font-size: 0.9rem; color: rgba(255,255,255,0.7); margin: 6px 0 0; }
                .db-header-actions { position: relative; z-index: 2; }
                .db-cat-select {
                    padding: 10px 20px; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px;
                    font-size: 0.85rem; color: white; background: rgba(255,255,255,0.1); outline: none; cursor: pointer;
                    backdrop-filter: blur(10px);
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .db-cat-select option { color: #000; }
                .db-cat-select:focus { border-color: #04bd20; background: rgba(255,255,255,0.15); box-shadow: 0 0 0 4px rgba(4,189,32,0.1); }
                .db-cat-select:hover { background: rgba(255,255,255,0.15); }

                /* Stat cards */
                .db-stat-card {
                    background: white;
                    border-radius: 20px;
                    border: 1px solid rgba(226, 232, 240, 0.8);
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    height: 100%;
                }
                .db-stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.06); border-color: #e2e8f0; }
                .db-stat-icon {
                    width: 54px; height: 54px; border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.3rem; flex-shrink: 0;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.04);
                }
                .db-stat-body { flex: 1; min-width: 0; }
                .db-stat-label { font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px; }
                .db-stat-row { display: flex; align-items: center; gap: 10px; }
                .db-stat-value { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1; letter-spacing: -0.02em; }
                .db-stat-trend { font-size: 0.75rem; background: rgba(4,189,32,0.1); color: #039419; border-radius: 50px; padding: 4px 10px; font-weight: 700; }

                /* Cards */
                .db-card { background: white; border-radius: 20px; border: 1px solid rgba(226, 232, 240, 0.8); padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); margin-bottom: 24px !important; }
                .db-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 24px !important; }
                .db-card-title { font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.01em; }
                .db-card-sub { font-size: 0.8rem; color: #64748b; margin: 4px 0 0; }
                .db-view-all-btn {
                    font-size: 0.8rem; font-weight: 700; color: #04bd20;
                    text-decoration: none; white-space: nowrap;
                    padding: 8px 18px; border-radius: 12px;
                    background: rgba(4,189,32,0.08);
                    border: 1px solid rgba(4,189,32,0.15);
                    transition: all 0.2s;
                    display: inline-flex;
                    align-items: center;
                }
                .db-view-all-btn:hover { background: rgba(4,189,32,0.15); transform: translateY(-1px); }

                /* Table */
                .db-table { width: 100%; border-collapse: separate; border-spacing: 0; }
                .db-table thead th { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; padding: 14px 16px; border-bottom: 2px solid #f1f5f9; background: #f8fafc; }
                .db-table thead th:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
                .db-table thead th:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
                .db-table tbody tr { transition: all 0.2s; }
                .db-table tbody tr:hover { background: #f8fafc; }
                .db-table tbody td { padding: 16px 16px; border-bottom: 1px solid #f1f5f9; }
                .db-type-badge { background: white; border: 1px solid #e2e8f0; color: #475569; font-size: 0.75rem; font-weight: 700; padding: 4px 12px; border-radius: 8px; text-transform: capitalize; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .db-title-cell { font-size: 0.9rem; font-weight: 700; color: #0f172a; }
                .db-date-cell { font-size: 0.85rem; color: #64748b; font-weight: 500; }
                .db-status-badge { font-size: 0.75rem; font-weight: 700; padding: 4px 12px; border-radius: 8px; text-transform: capitalize; }
                .db-empty-row { text-align: center; color: #94a3b8; font-size: 0.9rem; padding: 40px 0; font-weight: 500; }

                /* Quick Actions */
                .db-action-card {
                    display: flex; flex-direction: column; align-items: center; gap: 12px;
                    padding: 24px 16px;
                    background: white; border: 1px solid rgba(226, 232, 240, 0.8);
                    border-radius: 18px; text-decoration: none !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                    height: 100%;
                }
                .db-action-card:hover {
                    border-color: var(--action-color);
                    background: var(--action-bg);
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.06);
                }
                .db-action-icon {
                    width: 52px; height: 52px; border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.3rem;
                    transition: transform 0.3s;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }
                .db-action-card:hover .db-action-icon { transform: scale(1.1) rotate(5deg); }
                .db-action-label { font-size: 0.85rem; font-weight: 700; color: #1e293b; }
                .db-action-arrow { font-size: 0.8rem; color: #cbd5e1; transition: all 0.3s; }
                .db-action-card:hover .db-action-arrow { color: var(--action-color); transform: translateX(4px); }
            `}</style>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '12px', color: '#94a3b8' }}>
                <div style={{ width: '28px', height: '28px', border: '2px solid #f1f5f9', borderTopColor: '#04bd20', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}></div>
                Loading...
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
