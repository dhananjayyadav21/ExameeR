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
        if (status === "public") return "info";
        if (status === "draft") return "warning";
        if (status === "archived") return "danger";
        return "secondary";
    };

    const stats = [
        { label: "Total Notes", value: MyNotes?.length || 0, icon: "fa-file-lines", color: "success" },
        { label: "Total Courses", value: MyCourse?.length || 0, icon: "fa-book", color: "primary" },
        { label: "Video Lectures", value: MyVideo?.length || 0, icon: "fa-circle-play", color: "purple" },
        { label: "Previous Questions", value: MyPYQS?.length || 0, icon: "fa-circle-question", color: "warning" },
    ];

    const quickActions = [
        { href: "/uploadNotes", label: "Add Notes", icon: "fa-note-sticky", color: "text-primary" },
        { href: "/uploadPYQ", label: "Add Questions", icon: "fa-circle-question", color: "text-success" },
        { href: "/uploadVideo", label: "Upload Video", icon: "fa-video", color: "text-purple" },
        { href: "/uploadCourse", label: "Upload Course", icon: "fa-upload", color: "text-warning" },
    ];

    return (
        <div id="dashboard" className="p-0">
            {/* Header */}
            <div className="mb-4">
                <h1 className="h3 fw-bold text-dark">Dashboard Overview</h1>
                <p className="text-secondary">Track your content performance and student engagement.</p>
            </div>

            {/* Stats Grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
                {stats.map((stat, index) => (
                    <div className="col" key={index}>
                        <div className="card border-0 shadow-sm h-100 rounded-3">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="small text-secondary mb-1">{stat.label}</p>
                                    <h3 className="fw-bold text-dark mb-0">{stat.value}</h3>
                                </div>
                                <div className={`rounded-circle bg-${stat.color} bg-opacity-10 d-flex align-items-center justify-content-center p-3`} style={{ width: '50px', height: '50px' }}>
                                    <i className={`fa-solid ${stat.icon} text-${stat.color} fs-4`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Uploads */}
            <div className="card border-0 shadow-sm mb-4 rounded-3">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="h5 fw-bold text-dark mb-0">Recent Uploads</h2>
                        <button className="btn btn-sm btn-outline-primary">View All</button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr className="text-secondary small text-uppercase">
                                    <th>Type</th>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {LatestData && LatestData.length > 0 ? (
                                    LatestData.map((e, i) => (
                                        <tr key={i}>
                                            <td className="text-capitalize">{e?.type}</td>
                                            <td className="fw-semibold text-dark">{e?.title}</td>
                                            <td className="text-muted">{e?.createdAt ? e.createdAt.slice(0, 10) : "N/A"}</td>
                                            <td>
                                                <span className={`badge bg-${getBadgeColor(e?.status)} text-white px-2 py-1`}>
                                                    {e?.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">No recent uploads found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <h5 className="fw-bold text-dark mb-3">Quick Actions</h5>
            <div className="row g-3">
                {quickActions.map((action, index) => (
                    <div className="col-6 col-md-3" key={index}>
                        <Link href={action.href} className="text-decoration-none">
                            <div className="bg-white d-flex align-items-center justify-content-center gap-2 p-3 border shadow-sm rounded-3 cursor-pointer hover-shadow transition">
                                <i className={`fa-solid ${action.icon} ${action.color}`}></i>
                                <span className="text-dark fw-semibold small">{action.label}</span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="text-center py-5">Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
