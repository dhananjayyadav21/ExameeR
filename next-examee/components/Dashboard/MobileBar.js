"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const bottomNavItems = [
    { href: "/dashboard", label: "Home", icon: "fa-house" },
    { href: "/dashboard/notes", label: "Notes", icon: "fa-file-lines" },
    { href: "/dashboard/videos", label: "Videos", icon: "fa-circle-play" },
    { href: "/dashboard/courses", label: "Courses", icon: "fa-book-open" },
    { href: "/dashboard/students", label: "Users", icon: "fa-users" },
];

function MobileMenuButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const isActive = (href) => {
        if (href === "/dashboard") return pathname === href;
        return pathname.startsWith(href);
    };

    if (!mounted) return null;

    return (
        <>
            {/* ── Single Floating Toggle Button ── */}
            <nav className="mb-toggle-wrapper">
                <button
                    className={`mb-fab ${isOpen ? 'mb-fab-active' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                >
                    <div className="mb-fab-icon">
                        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
                    </div>
                </button>
            </nav>

            {/* ── Drawer Menu ── */}
            {isOpen && (
                <div className="mb-drawer-container">
                    <div className="mb-backdrop" onClick={() => setIsOpen(false)} />
                    <div className="mb-sheet">
                        <div className="mb-sheet-handle-bar">
                            <div className="mb-sheet-handle"></div>
                        </div>

                        <div className="mb-sheet-header">
                            <Link href="/" className="mb-brand-link" onClick={() => setIsOpen(false)}>
                                <div className="mb-logo-sq">
                                    <i className="fa-solid fa-graduation-cap"></i>
                                </div>
                                <div className="mb-brand-info">
                                    <h2 className="mb-brand-title">Examee</h2>
                                    <p className="mb-brand-subtitle">Premium Learning</p>
                                </div>
                            </Link>
                            <button className="mb-sheet-close" onClick={() => setIsOpen(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Content closes drawer on any item click */}
                        <div className="mb-sheet-content" onClick={(e) => {
                            if (e.target.closest('a') || e.target.closest('button')) {
                                setTimeout(() => setIsOpen(false), 200);
                            }
                        }}>
                            <Sidebar />
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .mb-toggle-wrapper {
                    position: fixed;
                    bottom: 30px;
                    right: 25px;
                    z-index: 1000;
                    pointer-events: none;
                }

                .mb-fab {
                    pointer-events: auto;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #04bd20 0%, #029d1a 100%);
                    border: none;
                    border-radius: 50%;
                    box-shadow: 0 8px 25px rgba(4, 189, 32, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    color: white;
                }

                .mb-fab:active {
                    transform: scale(0.9) rotate(-10deg);
                }

                .mb-fab-active {
                    transform: rotate(90deg);
                    background: #1e293b;
                    box-shadow: 0 8px 25px rgba(30, 41, 59, 0.3);
                }

                .mb-fab-icon {
                    font-size: 1.5rem;
                }

                /* ── Drawer UI ── */
                .mb-drawer-container {
                    position: fixed;
                    inset: 0;
                    z-index: 1100;
                }

                .mb-backdrop {
                    position: absolute;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(8px);
                    animation: fadeIn 0.3s ease;
                }

                .mb-sheet {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    max-height: 85vh;
                    background: #ffffff;
                    border-top-left-radius: 32px;
                    border-top-right-radius: 32px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 -20px 40px rgba(0, 0, 0, 0.1);
                    animation: slideUp 0.4s cubic-bezier(0.32, 0.72, 0, 1);
                }

                .mb-sheet-handle-bar {
                    display: flex;
                    justify-content: center;
                    padding: 12px 0;
                }

                .mb-sheet-handle {
                    width: 40px;
                    height: 4px;
                    background: #e2e8f0;
                    border-radius: 2px;
                }

                .mb-sheet-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 24px 20px;
                    border-bottom: 1px solid #f1f5f9;
                }

                .mb-brand-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                    color: inherit;
                }

                .mb-logo-sq {
                    width: 42px;
                    height: 42px;
                    background: linear-gradient(135deg, #04bd20 0%, #029d1a 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 1.25rem;
                    box-shadow: 0 8px 16px rgba(4, 189, 32, 0.2);
                }

                .mb-brand-info {
                    display: flex;
                    flex-direction: column;
                }

                .mb-brand-title {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #0f172a;
                    letter-spacing: -0.02em;
                    line-height: 1;
                }

                .mb-brand-subtitle {
                    margin: 2px 0 0;
                    font-size: 0.65rem;
                    font-weight: 600;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .mb-sheet-close {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: #f1f5f9;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .mb-sheet-content {
                    flex: 1;
                    overflow-y: auto;
                    padding-bottom: 40px;
                }

                .mb-sheet-content :global(.ds-brand) {
                    display: none !important;
                }

                .mb-sheet-content :global(.ds-sidebar) {
                    background: transparent;
                    width: 100%;
                    padding: 10px 0;
                    box-shadow: none;
                    border: none;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </>
    );
}

export default MobileMenuButton;
