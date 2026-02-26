"use client";
import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ContentContext from '../../../context/ContentContext';
import { toast } from "react-toastify";

export default function AnalyticsPage() {
    const context = useContext(ContentContext);
    const { getdashAnalytics, dashAnalytics, getLatestUpload, LatestData } = context;
    const router = useRouter();

    useEffect(() => {
        getdashAnalytics();
        getLatestUpload();
    }, []);

    useEffect(() => {
        if (dashAnalytics && dashAnalytics.success === false) {
            toast.warning(dashAnalytics.message || "Could not fetch analytics data.");
        }
    }, [dashAnalytics]);

    const stats = [
        { label: "Total Notes", value: dashAnalytics?.data?.notes?.total || 0, growth: dashAnalytics?.data?.notes?.growth || 0, icon: "fa-file-pdf", color: "#04bd20", bg: "rgba(4,189,32,0.1)" },
        { label: "Total Courses", value: dashAnalytics?.data?.courses?.total || 0, growth: dashAnalytics?.data?.courses?.growth || 0, icon: "fa-graduation-cap", color: "#0ea5e9", bg: "rgba(14,165,233,0.1)" },
        { label: "Video Lectures", value: dashAnalytics?.data?.videos?.total || 0, growth: dashAnalytics?.data?.videos?.growth || 0, icon: "fa-circle-play", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
        { label: "Question Papers", value: dashAnalytics?.data?.pyqs?.total || 0, growth: dashAnalytics?.data?.pyqs?.growth || 0, icon: "fa-file-invoice", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    ];

    const typeConfig = {
        notes: { color: '#04bd20', bg: 'rgba(4,189,32,0.1)', icon: 'fa-file-pdf' },
        video: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: 'fa-circle-play' },
        pyq: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: 'fa-file-invoice' },
        course: { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', icon: 'fa-graduation-cap' },
    };

    const quickActions = [
        { href: "/uploadNotes", label: "Upload Notes", sub: "Add PDF notes", icon: "fa-file-pdf", color: "#04bd20", bg: "rgba(4,189,32,0.08)" },
        { href: "/uploadVideo", label: "Upload Video", sub: "Add lecture", icon: "fa-circle-play", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
        { href: "/uploadPYQ", label: "Upload PYQ", sub: "Add paper", icon: "fa-file-invoice", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
        { href: "/uploadCourse", label: "New Course", sub: "Create course", icon: "fa-graduation-cap", color: "#0ea5e9", bg: "rgba(14,165,233,0.08)" },
    ];

    const handleEdit = (item) => {
        const typeMap = { notes: 'Notes', video: 'Video', pyq: 'PYQ', course: 'Course' };
        const route = typeMap[item.type] || 'Notes';
        router.push(`/upload${route}?edit=${item._id}`);
    };

    return (
        <section className="an-page">
            {/* Page Title */}
            <div className="an-title-row">
                <div>
                    <h1 className="an-title">Analytics &amp; Reports</h1>
                    <p className="an-sub">Detailed overview of content growth and platform performance</p>
                </div>
                <div className="an-date-badge">
                    <i className="fa-solid fa-calendar-days me-2"></i>
                    {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="row g-3 mb-4">
                {stats.map((stat, i) => (
                    <div className="col-6 col-lg-3" key={i}>
                        <div className="an-stat-card">
                            <div className="an-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                                <i className={`fa-solid ${stat.icon}`}></i>
                            </div>
                            <div className="an-stat-value">{stat.value.toLocaleString()}</div>
                            <div className="an-stat-label">{stat.label}</div>
                            <div className="an-stat-growth" style={{ color: stat.growth >= 0 ? '#04bd20' : '#ef4444' }}>
                                <i className={`fa-solid fa-arrow-${stat.growth >= 0 ? 'up' : 'down'} me-1`}></i>
                                {Math.abs(stat.growth)}% vs last month
                            </div>
                            <div className="an-stat-bar" style={{ background: stat.bg }}>
                                <div className="an-stat-bar-fill" style={{ background: stat.color, width: `${Math.min(stat.value, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Table */}
            <div className="an-card mb-4">
                <div className="an-card-header">
                    <div className="an-card-title">
                        <i className="fa-solid fa-clock-rotate-left me-2" style={{ color: '#0ea5e9' }}></i>
                        Recent Performance Activity
                    </div>
                    <span className="an-pill">{LatestData?.length || 0} records</span>
                </div>
                <div className="table-responsive">
                    <table className="an-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {LatestData && LatestData.length > 0 ? LatestData.map((data, i) => {
                                const cfg = typeConfig[data?.type] || typeConfig.notes;
                                return (
                                    <tr key={i}>
                                        <td>
                                            <span className="an-type-badge" style={{ background: cfg.bg, color: cfg.color }}>
                                                <i className={`fa-solid ${cfg.icon} me-1`}></i>
                                                {data?.type}
                                            </span>
                                        </td>
                                        <td className="an-td-title">{data?.title}</td>
                                        <td className="an-td-muted">{data?.createdAt?.slice(0, 10)}</td>
                                        <td>
                                            <span className="an-status-badge">{data?.status}</span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button className="an-edit-btn" onClick={() => handleEdit(data)} title="Edit">
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="5" className="an-empty">
                                        <i className="fa-solid fa-chart-line mb-2" style={{ fontSize: '2rem', color: '#cbd5e1' }}></i>
                                        <p>No activity records found yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Upload Actions */}
            <div className="an-card-header mb-3 px-0">
                <div className="an-card-title" style={{ fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-bolt me-2" style={{ color: '#f59e0b' }}></i>Quick Actions
                </div>
            </div>
            <div className="row g-3">
                {quickActions.map((action, i) => (
                    <div className="col-6 col-md-3" key={i}>
                        <Link href={action.href} className="an-action-card" style={{ '--ac': action.color, '--ab': action.bg }}>
                            <div className="an-action-icon" style={{ background: action.bg, color: action.color }}>
                                <i className={`fa-solid ${action.icon}`}></i>
                            </div>
                            <div className="an-action-info">
                                <div className="an-action-label">{action.label}</div>
                                <div className="an-action-sub">{action.sub}</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .an-page { min-height: 100vh; }
                .an-title-row { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
                .an-title { font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0; }
                .an-sub { font-size: 0.82rem; color: #94a3b8; margin: 4px 0 0; }
                .an-date-badge { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 14px; font-size: 0.8rem; font-weight: 600; color: #475569; }

                /* Stat cards */
                .an-stat-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #f1f5f9; box-shadow: 0 2px 12px rgba(0,0,0,0.05); height: 100%; }
                .an-stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; margin-bottom: 14px; }
                .an-stat-value { font-size: 1.8rem; font-weight: 800; color: #0f172a; line-height: 1; }
                .an-stat-label { font-size: 0.76rem; font-weight: 600; color: #94a3b8; margin: 4px 0; text-transform: uppercase; letter-spacing: 0.04em; }
                .an-stat-growth { font-size: 0.72rem; font-weight: 600; margin-bottom: 12px; }
                .an-stat-bar { height: 4px; border-radius: 4px; overflow: hidden; }
                .an-stat-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }

                /* Card */
                .an-card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 2px 12px rgba(0,0,0,0.05); overflow: hidden; }
                .an-card-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid #f1f5f9; }
                .an-card-title { font-size: 0.9rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; }
                .an-pill { background: #f1f5f9; color: #64748b; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 50px; }

                /* Table */
                .an-table { width: 100%; border-collapse: collapse; }
                .an-table thead tr { background: #f8fafc; }
                .an-table th { padding: 11px 20px; font-size: 0.72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
                .an-table tbody tr { transition: background 0.15s; }
                .an-table tbody tr:hover { background: #f8fafc; }
                .an-table td { padding: 13px 20px; border-bottom: 1px solid #f8fafc; font-size: 0.85rem; }
                .an-type-badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; text-transform: capitalize; }
                .an-td-title { font-weight: 600; color: #1e293b; max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .an-td-muted { color: #94a3b8; font-size: 0.8rem; }
                .an-status-badge { background: rgba(4,189,32,0.1); color: #04bd20; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; padding: 3px 10px; border-radius: 50px; letter-spacing: 0.04em; }
                .an-edit-btn { background: #f8fafc; border: 1.5px solid #e2e8f0; color: #64748b; width: 30px; height: 30px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-size: 0.75rem; }
                .an-edit-btn:hover { border-color: #0ea5e9; color: #0ea5e9; background: white; transform: scale(1.05); }
                .an-empty { text-align: center; padding: 48px 20px; color: #94a3b8; font-size: 0.88rem; }

                /* Quick action cards */
                .an-action-card { 
                    display: flex; 
                    flex-direction: column;
                    align-items: center; 
                    text-align: center;
                    background: white; 
                    border-radius: 24px; 
                    padding: 28px 20px; 
                    border: 1px solid #f1f5f9; 
                    text-decoration: none !important; 
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
                    height: 100%;
                }
                .an-action-card:hover { 
                    border-color: var(--ac); 
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.06), 0 10px 10px -5px rgba(0,0,0,0.03);
                    transform: translateY(-6px); 
                }
                .an-action-info {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-top: 16px;
                }
                .an-action-icon { 
                    width: 60px; 
                    height: 60px; 
                    border-radius: 18px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 1.4rem; 
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 16px -4px rgba(0,0,0,0.1);
                }
                .an-action-card:hover .an-action-icon {
                    transform: scale(1.1);
                    box-shadow: 0 12px 20px -6px rgba(0,0,0,0.15);
                }
                .an-action-label { 
                    font-size: 0.92rem; 
                    font-weight: 800; 
                    color: #0f172a; 
                    letter-spacing: -0.01em;
                }
                .an-action-sub { 
                    font-size: 0.75rem; 
                    color: #64748b; 
                    font-weight: 500;
                    opacity: 0.8;
                }
            `}</style>
        </section>
    );
}
