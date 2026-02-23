"use client";
import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import ContentContext from '../../../context/ContentContext'
import { toast } from "react-toastify";

export default function AnalyticsPage() {
    const context = useContext(ContentContext);
    const { getdashAnalytics, dashAnalytics, getLatestUpload, LatestData } = context;

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
        { label: "Total Notes", value: dashAnalytics?.data?.notes?.total || 0, growth: dashAnalytics?.data?.notes?.growth || 0, color: "info" },
        { label: "Total Courses", value: 0, growth: 0, color: "primary" }, // Placeholder as per original
        { label: "Video Lectures", value: dashAnalytics?.data?.videos?.total || 0, growth: dashAnalytics?.data?.videos?.growth || 0, color: "success" },
        { label: "Previous Year Papers", value: dashAnalytics?.data?.pyqs?.total || 0, growth: dashAnalytics?.data?.pyqs?.growth || 0, color: "warning" },
    ];

    return (
        <section id="analytics" className="p-0">
            <div className="mb-4">
                <h1 className="h4 fw-bold text-dark">Analytics & Reports</h1>
                <p className="text-secondary text-muted">Detailed overview of content growth and performance.</p>
            </div>

            {/* Stats Overview */}
            <div className="row g-4 mb-4">
                {stats.map((stat, index) => (
                    <div className="col-12 col-md-6 col-lg-3" key={index}>
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100" style={{ background: '#1a1a1a' }}>
                            <div className="card-body p-4 text-white">
                                <h3 className="h6 text-muted mb-3">{stat.label}</h3>
                                <div className="d-flex align-items-baseline gap-2">
                                    <h2 className="display-6 fw-bold mb-0">{stat.value}</h2>
                                    <span className="text-success small fw-bold">
                                        <i className="fa-solid fa-arrow-up me-1"></i>
                                        {stat.growth}%
                                    </span>
                                </div>
                                <div className="mt-3 small text-muted">vs last month</div>
                            </div>
                            <div className={`bg-${stat.color}`} style={{ height: '4px' }}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Uploads */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden" style={{ background: '#1a1a1a' }}>
                <div className="card-body p-4">
                    <h2 className="h5 fw-bold text-white mb-4">Recent Performance Activity</h2>
                    <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                            <thead>
                                <tr className="text-muted small text-uppercase">
                                    <th className="border-0 pb-3">Type</th>
                                    <th className="border-0 pb-3">Title</th>
                                    <th className="border-0 pb-3">Date</th>
                                    <th className="border-0 pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {LatestData && LatestData.length > 0 ? (
                                    LatestData.map((data, i) => (
                                        <tr key={i} className="border-top border-secondary">
                                            <td className="py-3">
                                                <span className="badge bg-info bg-opacity-10 text-info px-2 py-1 text-capitalize">
                                                    {data?.type}
                                                </span>
                                            </td>
                                            <td className="py-3 fw-medium">{data?.title}</td>
                                            <td className="py-3 text-muted">{data?.createdAt?.slice(0, 10)}</td>
                                            <td className="py-3">
                                                <span className="text-success fw-bold small text-uppercase">{data?.status}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">No activity records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Quick Upload Actions */}
            <div className="row g-4">
                <div className="col-12 col-md-6 col-lg-3">
                    <Link href="/dashboard" className="text-decoration-none">
                        <div className="card border-0 shadow-sm rounded-4 text-center p-4 hover-lift transition" style={{ background: '#1a1a1a', cursor: 'pointer' }}>
                            <div className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center p-3 mb-3 mx-auto" style={{ width: '60px', height: '60px' }}>
                                <i className="fa-solid fa-upload text-info fs-4"></i>
                            </div>
                            <h6 className="text-white fw-bold mb-1">New Upload</h6>
                            <p className="text-muted small mb-0">Add more content</p>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
