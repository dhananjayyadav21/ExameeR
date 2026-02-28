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
                <div>
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
                .db-page {}
                .db-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
                .db-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.02em; }
                .db-subtitle { font-size: 0.85rem; color: #64748b; margin: 4px 0 0; }
                .db-cat-select {
                    padding: 8px 16px; border: 1.5px solid #e2e8f0; border-radius: 10px;
                    font-size: 0.82rem; color: #374151; background: white; outline: none; cursor: pointer;
                }
                .db-cat-select:focus { border-color: #04bd20; }

                /* Stat cards */
                .db-stat-card {
                    background: white;
                    border-radius: 14px;
                    border: 1px solid #f1f5f9;
                    padding: 18px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    box-shadow: 0 1px 6px rgba(0,0,0,0.05);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .db-stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
                .db-stat-icon {
                    width: 46px; height: 46px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.1rem; flex-shrink: 0;
                }
                .db-stat-body { flex: 1; min-width: 0; }
                .db-stat-label { font-size: 0.72rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px; }
                .db-stat-row { display: flex; align-items: baseline; gap: 8px; }
                .db-stat-value { font-size: 1.7rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1; }
                .db-stat-trend { font-size: 0.72rem; background: rgba(4,189,32,0.1); color: #039419; border-radius: 50px; padding: 2px 7px; font-weight: 700; }

                /* Cards */
                .db-card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; padding: 22px; box-shadow: 0 1px 6px rgba(0,0,0,0.05); }
                .db-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
                .db-card-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0; }
                .db-card-sub { font-size: 0.75rem; color: #94a3b8; margin: 3px 0 0; }
                .db-view-all-btn {
                    font-size: 0.78rem; font-weight: 600; color: #04bd20;
                    text-decoration: none; white-space: nowrap;
                    padding: 6px 14px; border-radius: 8px;
                    background: rgba(4,189,32,0.07);
                    border: 1px solid rgba(4,189,32,0.2);
                    transition: all 0.2s;
                }
                .db-view-all-btn:hover { background: rgba(4,189,32,0.14); }

                /* Table */
                .db-table { width: 100%; border-collapse: collapse; }
                .db-table thead tr { border-bottom: 1px solid #f1f5f9; }
                .db-table thead th { font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; padding: 10px 12px; }
                .db-table tbody tr { border-bottom: 1px solid #f8fafc; transition: background 0.15s; }
                .db-table tbody tr:hover { background: #f8fafc; }
                .db-table tbody td { padding: 12px 12px; }
                .db-type-badge { background: #f1f5f9; color: #475569; font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 50px; text-transform: capitalize; }
                .db-title-cell { font-size: 0.87rem; font-weight: 600; color: #0f172a; }
                .db-date-cell { font-size: 0.8rem; color: #94a3b8; }
                .db-status-badge { font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 50px; text-transform: capitalize; }
                .db-empty-row { text-align: center; color: #94a3b8; font-size: 0.87rem; padding: 32px 0; }

                /* Quick Actions */
                .db-action-card {
                    display: flex; flex-direction: column; align-items: center; gap: 10px;
                    padding: 18px 14px;
                    background: white; border: 1.5px solid #f1f5f9;
                    border-radius: 14px; text-decoration: none;
                    transition: all 0.2s;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                .db-action-card:hover {
                    border-color: var(--action-color);
                    background: var(--action-bg);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 18px rgba(0,0,0,0.07);
                }
                .db-action-icon {
                    width: 44px; height: 44px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.1rem;
                    transition: transform 0.2s;
                }
                .db-action-card:hover .db-action-icon { transform: scale(1.1); }
                .db-action-label { font-size: 0.82rem; font-weight: 600; color: #374151; }
                .db-action-arrow { font-size: 0.7rem; color: #d1d5db; transition: all 0.2s; }
                .db-action-card:hover .db-action-arrow { color: var(--action-color); transform: translateX(2px); }
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
