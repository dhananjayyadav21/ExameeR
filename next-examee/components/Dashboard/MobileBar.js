"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const bottomNavItems = [
    { href: "/dashboard", label: "Home", icon: "fa-house" },
    { href: "/dashboard/notes", label: "Notes", icon: "fa-file-lines" },
    { href: "/dashboard/videos", label: "Videos", icon: "fa-circle-play" },
    { href: "/dashboard/courses", label: "Courses", icon: "fa-book-open" },
    { href: "/dashboard/analytics", label: "Stats", icon: "fa-chart-line" },
];

function MobileMenuButton() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href) => {
        if (href === "/dashboard") return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* ── Bottom Nav Bar ────────────────────────────────── */}
            <nav className="mb-nav">
                {bottomNavItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`mb-nav-item ${active ? 'mb-nav-item--active' : ''}`}
                        >
                            <span className="mb-nav-icon">
                                <i className={`fa-solid ${item.icon}`}></i>
                            </span>
                            <span className="mb-nav-label">{item.label}</span>
                            {active && <span className="mb-nav-line"></span>}
                        </Link>
                    );
                })}

                {/* Menu button opens full sidebar drawer */}
                <button
                    className={`mb-nav-item mb-nav-menu-btn ${isOpen ? 'mb-nav-item--active' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Open menu"
                >
                    <span className="mb-nav-icon">
                        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
                    </span>
                    <span className="mb-nav-label">More</span>
                    {isOpen && <span className="mb-nav-line"></span>}
                </button>
            </nav>

            {/* ── Full Sidebar Drawer ───────────────────────────── */}
            {isOpen && (
                <>
                    <div
                        className="mb-overlay"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="mb-drawer">
                        <Sidebar />
                    </div>
                </>
            )}

            <style jsx>{`
                /* ── Bottom Nav Bar ──────────────────────────────── */
                .mb-nav {
                    display: flex;
                    align-items: stretch;
                    position: fixed;
                    bottom: 0; left: 0; right: 0;
                    height: 60px;
                    background: #0a1628;
                    border-top: 1px solid rgba(255,255,255,0.08);
                    z-index: 1060;
                    /* slim accent line at very top of nav */
                    box-shadow: 0 -1px 0 rgba(4,189,32,0.35), 0 -8px 32px rgba(0,0,0,0.4);
                }

                /* Slim green line at absolute top of bar */
                .mb-nav::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent 0%, #04bd20 30%, #06d6a0 70%, transparent 100%);
                }

                /* Slim decorative line at bottom */
                .mb-nav::after {
                    content: '';
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
                }

                .mb-nav-item {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 3px;
                    text-decoration: none;
                    color: rgba(255,255,255,0.38);
                    font-size: 0.58rem;
                    font-weight: 600;
                    letter-spacing: 0.03em;
                    padding: 8px 4px 10px;
                    position: relative;
                    transition: color 0.18s;
                }
                .mb-nav-item:hover { color: rgba(255,255,255,0.7); }
                .mb-nav-item--active { color: #04bd20; }

                .mb-nav-menu-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-family: inherit;
                }

                .mb-nav-icon {
                    font-size: 1.05rem;
                    line-height: 1;
                    display: block;
                    transition: transform 0.18s;
                }
                .mb-nav-item--active .mb-nav-icon { transform: translateY(-1px); }
                .mb-nav-label { line-height: 1; display: block; }

                /* Slim green line ABOVE active item */
                .mb-nav-line {
                    position: absolute;
                    top: 0; left: 20%; right: 20%;
                    height: 2.5px;
                    background: #04bd20;
                    border-radius: 0 0 4px 4px;
                    box-shadow: 0 0 8px rgba(4,189,32,0.7);
                }

                /* ── Drawer ─────────────────────────────────────── */
                .mb-overlay {
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,0.55);
                    backdrop-filter: blur(3px);
                    z-index: 1070;
                }
                .mb-drawer {
                    position: fixed;
                    top: 0; left: 0;
                    width: 260px;
                    height: calc(100vh - 60px);
                    z-index: 1080;
                    overflow-y: auto;
                    animation: slideIn 0.24s ease;
                }
                @keyframes slideIn {
                    from { transform: translateX(-100%); opacity: 0; }
                    to   { transform: translateX(0);     opacity: 1; }
                }
            `}</style>
        </>
    );
}

export default MobileMenuButton;
