"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { href: "/dashboard", label: "Dashboard", icon: "fa-house" },
        { href: "/dashboard/notes", label: "Notes", icon: "fa-note-sticky" },
        { href: "/dashboard/pyq", label: "PYQs", icon: "fa-circle-question" },
        { href: "/dashboard/videos", label: "Videos", icon: "fa-circle-play" },
        { href: "/dashboard/courses", label: "Courses", icon: "fa-book-open" },
        { href: "/dashboard/students", label: "Students", icon: "fa-user-graduate" },
        { href: "/dashboard/analytics", label: "Analytics", icon: "fa-chart-line" },
        { href: "/dashboard/settings", label: "Settings", icon: "fa-gear" },
    ];

    return (
        <nav className="bg-white w-100 position-sticky d-flex flex-column shadow-sm border-end dashboard-nav" style={{ minHeight: '100vh', top: 0 }}>
            <div className="flex-grow-1 py-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`d-flex align-items-center px-4 py-3 text-decoration-none hover-bg-light ${pathname === item.href ? 'text-primary bg-light border-end border-3 border-primary' : 'text-dark'}`}
                    >
                        <i className={`fa-solid ${item.icon} me-3`} style={{ width: '20px' }}></i>
                        <span className="fw-semibold">{item.label}</span>
                    </Link>
                ))}
            </div>

            {/* Profile Section at the bottom */}
            <div className="p-3 border-top bg-light">
                <div className="d-flex align-items-center">
                    <img
                        src="/assets/img/Avtar.jpg"
                        alt="Profile"
                        className="rounded-circle border"
                        style={{ width: "40px", height: "40px", objectFit: 'cover' }}
                    />
                    <div className="ms-2 overflow-hidden">
                        <p className="mb-0 fw-bold text-dark small text-truncate">Instructor</p>
                        <p className="mb-0 text-muted small text-truncate">instructor@examee.com</p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
