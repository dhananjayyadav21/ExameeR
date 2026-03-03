"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import MobileBar from "../../components/dashboard/MobileBar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import ContentContext from "../../context/ContentContext";
import GlobalLoader from "../../components/GlobalLoader";

import hasUserRole from "../../utils/hasUserRole";
import "../../styles/dashboard-layout.css";

const menuItems = [
    { href: "/dashboard", label: "Overview", icon: "fa-house" },
    { href: "/dashboard/courses", label: "My Courses", icon: "fa-book-open" },
    { href: "/dashboard/notes", label: "Study Notes", icon: "fa-file-lines" },
    { href: "/dashboard/pyq", label: "Previous Papers", icon: "fa-circle-question" },
    { href: "/dashboard/videos", label: "Video Lectures", icon: "fa-circle-play" },
    { href: "/dashboard/banners", label: "Banners", icon: "fa-rectangle-ad" },
    { href: "/dashboard/students", label: "Users", icon: "fa-users" },
    { href: "/dashboard/analytics", label: "Analytics", icon: "fa-chart-line" },
    { href: "/dashboard/settings", label: "Settings", icon: "fa-gear" },
];

export default function DashboardLayout({ children }) {
    const context = useContext(ContentContext);
    const { userData, getUser } = context;
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.querySelector('.dl-search-input')?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim().length > 2) {
            setIsSearching(true);
            setShowSearchResults(true);
            try {
                // Search across all types for comprehensive results
                const types = ['notes', 'video', 'pyq', 'mocktest'];
                let allResults = [];
                for (const t of types) {
                    const res = await fetch(`/api/content/search?search=${query}&type=${t}`);
                    const data = await res.json();
                    if (data.success) {
                        allResults = [...allResults, ...data.results.slice(0, 3)];
                    }
                }
                setSearchResults(allResults);
            } catch (error) {
                console.error("Search failed", error);
            }
            setIsSearching(false);
        } else {
            setShowSearchResults(false);
            setSearchResults([]);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push("/auth");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/login');
            return;
        }

        if (!hasUserRole('Admin', 'Instructor')) {
            setAuthError(true);
            setIsAuthorized(false);
        } else {
            setIsAuthorized(true);
            setAuthError(false);
            if (!userData) {
                getUser();
            }
        }
    }, [userData]);

    if (!isAuthorized) {
        if (authError) {
            return (
                <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light p-4 text-center">
                    <div className="bg-white p-5 rounded-4 shadow-sm border border-danger-subtle" style={{ maxWidth: '450px' }}>
                        <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                            <i className="fa-solid fa-shield-halved text-danger fs-1"></i>
                        </div>
                        <h3 className="fw-black mb-2 text-dark">Access Denied</h3>
                        <p className="text-secondary mb-4">You are not authenticated as an Admin or Instructor to view this dashboard. Please contact support if you believe this is an error.</p>
                        <div className="d-flex flex-column gap-2">
                            <button className="btn btn-dark rounded-pill py-2 fw-bold" onClick={() => router.push("/")}>
                                <i className="fa-solid fa-house me-2"></i>Back to Website
                            </button>
                            <button className="btn btn-outline-danger rounded-pill py-2 fw-bold border-0" onClick={handleLogout}>
                                <i className="fa-solid fa-arrow-right-from-bracket me-2"></i>Logout Session
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="dl-loading">
                <div className="dl-spinner"></div>
                <p>Verifying access...</p>
            </div>
        );
    }

    const currentLabel = menuItems.find(m => pathname === m.href || (m.href !== '/dashboard' && pathname.startsWith(m.href)))?.label || 'Dashboard';

    return (
        <div className="dl-wrapper">
            {/* Sidebar */}
            <aside className={`dl-sidebar ${mobileOpen ? 'dl-sidebar--open' : ''}`}>
                <Sidebar />
            </aside>

            {/* Mobile overlay */}
            {mobileOpen && <div className="dl-overlay" onClick={() => setMobileOpen(false)} />}

            {/* Main Content */}
            <div className="dl-main">
                {/* Top bar */}
                <header className="dl-topbar">
                    <div className="dl-topbar-left">

                        <div className="dl-search-container d-none d-md-flex">
                            <i className="fa-solid fa-magnifying-glass dl-search-icon"></i>
                            <input
                                type="text"
                                placeholder="Search materials..."
                                className="dl-search-input"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => searchQuery.length > 2 && setShowSearchResults(true)}
                                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                            />
                            <span className="dl-search-shortcut">⌘K</span>

                            {showSearchResults && (
                                <div className="dl-search-results animate-fade-in shadow-lg">
                                    {isSearching && (
                                        <div className="text-center py-3 text-muted">
                                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                            Searching...
                                        </div>
                                    )}
                                    {searchResults.length > 0 ? (
                                        <div className="py-2">
                                            {searchResults.map((item, idx) => {
                                                const getHref = () => {
                                                    switch (item.type) {
                                                        case 'note': return `/dashboard/notes#${item._id}`;
                                                        case 'video': return `/dashboard/videos#${item._id}`;
                                                        case 'pyq': return `/dashboard/pyq`;
                                                        case 'mocktest': return `/dashboard/mock-tests`;
                                                        default: return '#';
                                                    }
                                                };

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none hover-bg-light transition-all cursor-pointer"
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            router.push(getHref());
                                                            setShowSearchResults(false);
                                                            setSearchQuery("");
                                                        }}
                                                    >
                                                        <div className="bg-light rounded p-2" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <i className={`fa-solid ${item.type === 'note' ? 'fa-file-lines text-primary' :
                                                                    item.type === 'video' ? 'fa-play text-danger' :
                                                                        item.type === 'mocktest' ? 'fa-vial text-success' :
                                                                            'fa-file-pdf text-orange'
                                                                }`}></i>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0 fw-bold fs-7 text-dark">{item.title}</p>
                                                            <span className="smaller text-muted text-uppercase fw-semibold">{item.type}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : !isSearching && (
                                        <div className="text-center py-4 text-muted fs-8">
                                            No materials found matching "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="dl-topbar-right">
                        <div className="dl-actions">
                            <button className="dl-icon-btn d-none d-sm-flex" title="Notifications">
                                <i className="fa-regular fa-bell"></i>
                                <span className="dl-notification-dot"></span>
                            </button>
                            <button className="dl-icon-btn d-none d-sm-flex" title="Quick Notes">
                                <i className="fa-regular fa-comment-dots"></i>
                            </button>
                            <div className="dl-divider d-none d-sm-block"></div>

                            <div className="dl-profile-dropdown">
                                <div className="dl-profile-info d-none d-lg-block">
                                    <p className="dl-profile-name">
                                        {(userData?.FirstName || userData?.LastName) ? `${userData.FirstName} ${userData.LastName}`.trim() : (userData?.Username || "Loading...")}
                                    </p>
                                    <p className="dl-profile-role">{userData?.Role || "Admin"}</p>
                                </div>
                                <div className="dl-avatar-container">
                                    <img
                                        src={userData?.Profile ? (userData.Profile.startsWith('http') ? userData.Profile : `https://lh3.googleusercontent.com/d/${userData.Profile}`) : "/assets/img/Avtar.jpg"}
                                        alt="Profile"
                                        className="dl-avatar"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${userData?.FirstName || 'User'}&background=04bd20&color=fff`;
                                        }}
                                    />
                                    <div className="dl-online-indicator"></div>
                                </div>
                                <button className="dl-logout-btn" onClick={handleLogout}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className={`dl-content position-relative ${pathname.includes('/dashboard/upload') ? 'dl-content-full' : ''}`} style={{ minHeight: '600px' }}>
                    <GlobalLoader contextLayout="dashboard" />
                    {children}
                </main>
            </div>

            {/* Mobile bottom nav */}
            <div className="d-lg-none">
                <MobileBar />
            </div>

        </div>
    );
}
