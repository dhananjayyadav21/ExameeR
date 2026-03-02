"use client";
import React, { useContext, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import ContentContext from '../../context/ContentContext';
import StudentSidebar from './StudentSidebar';
import { toast } from 'react-toastify';
import hasUserRole from '../../utils/hasUserRole';
import GlobalLoader from '../GlobalLoader';
import '../../styles/student-layout.css';


const StudentLayout = ({ children, title = "Exploration" }) => {
    const context = useContext(ContentContext);
    const { userData, getUser, globalSearch, setGlobalSearch } = context;
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [token, setToken] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Reset search on page change
        setGlobalSearch('');
    }, [pathname]);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push('/login');
            return;
        }
        setToken(storedToken);

        // Verify if user exists in DB and fetch data
        if (!userData) {
            getUser().then((res) => {
                if (res && res.success === false) {
                    localStorage.clear();
                    router.push('/login');
                    toast.error(res.message || "Session expired or user not found. Please login again.");
                }
            });
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleLogout = () => {
        localStorage.clear();
        toast.info("Logged out successfully");
        router.push('/login');
    };

    const userProfile = userData?.Profile ? (userData.Profile.startsWith('http') ? userData.Profile : `https://lh3.googleusercontent.com/d/${userData.Profile}`) : "/assets/img/Avtar.jpg";

    const isSpecialUser = hasUserRole('instructor', 'admin');

    if (!token) return null;

    return (
        <div className={`li-home-wrapper ${isMobileSidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Dark Overlay for Mobile Sidebar */}
            {isMobileSidebarOpen && (
                <div
                    className="sidebar-overlay d-lg-none"
                    onClick={() => setIsMobileSidebarOpen(false)}
                ></div>
            )}

            <div className={`li-sidebar-container ${isMobileSidebarOpen ? 'show' : ''}`}>
                <StudentSidebar
                    userData={userData}
                    handleLogout={handleLogout}
                    isSpecialUser={isSpecialUser}
                    userProfile={userProfile}
                />
            </div>

            <main className="li-main">
                <header className="li-header px-3 px-md-5 shadow-sm">
                    <div className="d-flex align-items-center gap-2 gap-md-4 flex-grow-1">
                        {/* Mobile Toggle */}
                        <button
                            className="btn btn-white d-lg-none border shadow-sm rounded-3 p-0 d-flex align-items-center justify-content-center"
                            style={{ width: '38px', height: '38px', flexShrink: 0 }}
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                        >
                            <i className="fa-solid fa-bars-staggered text-dark small"></i>
                        </button>

                        <h6 className="fw-bold mb-0 text-dark d-none d-sm-block">
                            {title}
                        </h6>

                        <div className="li-search-box flex-grow-1">
                            <i className="fa-solid fa-magnifying-glass text-muted small"></i>
                            <input
                                type="text"
                                placeholder={`Search ${title}...`}
                                className="li-search-input"
                                value={globalSearch}
                                onChange={(e) => setGlobalSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="li-user-greet flex-shrink-0 d-none d-md-block">
                        <div className="d-flex align-items-center gap-2 gap-md-3">
                            <div className="btn btn-white rounded-circle shadow-sm border p-0 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px', flexShrink: 0 }}>
                                <i className="fa-regular fa-bell text-dark" style={{ fontSize: '0.9rem' }}></i>
                            </div>
                            <div className="dropdown" ref={dropdownRef}>
                                <button
                                    className="btn btn-white rounded-circle shadow-sm border p-0 d-flex align-items-center justify-content-center"
                                    style={{ width: '38px', height: '38px', flexShrink: 0 }}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <i className="fa-solid fa-gear text-dark" style={{ fontSize: '0.9rem' }}></i>
                                </button>
                                {isDropdownOpen && (
                                    <div className="dropdown-menu show shadow-lg border-0 p-2 mt-2 position-absolute end-0 rounded-4 animate-nav-dropdown" style={{ minWidth: '240px', zIndex: 1050, background: '#fff' }}>
                                        <div className="px-3 py-3 mb-2 rounded-3" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                                            <p className="fw-bold mb-0 text-dark" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>{userData?.FirstName} {userData?.LastName}</p>
                                            <p className="text-muted mb-0 truncate" style={{ fontSize: '0.72rem' }}>{userData?.Email}</p>
                                            <div className="mt-2">
                                                {(() => {
                                                    const plan = userData?.Plan || 'e0';
                                                    const meta = {
                                                        e0: { label: 'E0 Free', color: '#04bd20', bg: '#f0fdf4', icon: 'fa-bolt', grad: 'linear-gradient(135deg, #04bd20 0%, #059669 100%)' },
                                                        plus: { label: 'Plus Student', color: '#8b5cf6', bg: '#faf5ff', icon: 'fa-star', grad: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' },
                                                        pro: { label: 'Pro Student', color: '#f59e0b', bg: '#fffbeb', icon: 'fa-crown', grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' }
                                                    }[plan];
                                                    return (
                                                        <span className="smaller fw-bold px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1" style={{
                                                            fontSize: '0.62rem',
                                                            background: meta.bg,
                                                            color: meta.color,
                                                            border: `1px solid ${meta.color}40`,
                                                            textTransform: 'uppercase'
                                                        }}>
                                                            <i className={`fa-solid ${meta.icon}`} style={{
                                                                fontSize: '0.65rem',
                                                                background: meta.grad,
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent'
                                                            }} />
                                                            {meta.label}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        <div className="dropdown-list-group p-1">
                                            <Link href="/profile" className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 bg-transparent border-0 text-start text-dark text-decoration-none">
                                                <div className="d-flex align-items-center justify-content-center bg-light rounded-2" style={{ width: '32px', height: '32px' }}>
                                                    <i className="fa-regular fa-user-circle opacity-75"></i>
                                                </div>
                                                <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>My Profile</span>
                                            </Link>

                                            <Link href="/myLearning" className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 bg-transparent border-0 text-start text-dark text-decoration-none">
                                                <div className="d-flex align-items-center justify-content-center bg-light rounded-2" style={{ width: '32px', height: '32px' }}>
                                                    <i className="fa-solid fa-book-open opacity-75"></i>
                                                </div>
                                                <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>My Library</span>
                                            </Link>

                                            {isSpecialUser && (
                                                <Link href="/dashboard" className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 bg-transparent border-0 text-start text-primary text-decoration-none">
                                                    <div className="d-flex align-items-center justify-content-center bg-primary-subtle rounded-2" style={{ width: '32px', height: '32px' }}>
                                                        <i className="fa-solid fa-gauge-high"></i>
                                                    </div>
                                                    <span style={{ fontSize: '0.88rem', fontWeight: '700' }}>Instructor Hub</span>
                                                </Link>
                                            )}
                                        </div>

                                        <div className="dropdown-divider mx-2 my-2 opacity-50"></div>

                                        <button onClick={handleLogout} className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 text-danger border-0 bg-transparent w-100 text-start">
                                            <div className="d-flex align-items-center justify-content-center bg-danger-subtle rounded-2" style={{ width: '32px', height: '32px' }}>
                                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                            </div>
                                            <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Logout Current Session</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="li-greet-text d-none d-lg-block ms-2">
                                <p className="li-greet-hi fw-bold mb-0" style={{ fontSize: '0.85rem' }}>Hi, {userData?.FirstName || 'Student'}</p>
                                {(() => {
                                    const plan = userData?.Plan || 'e0';
                                    const meta = {
                                        e0: { label: 'E0 Free Student', color: '#04bd20', icon: 'fa-bolt', grad: 'linear-gradient(135deg, #04bd20 0%, #059669 100%)' },
                                        plus: { label: 'Plus Student', color: '#8b5cf6', icon: 'fa-star', grad: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' },
                                        pro: { label: 'Pro Student', color: '#f59e0b', icon: 'fa-crown', grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' }
                                    }[plan];
                                    return (
                                        <p className="smaller mb-0 fw-bold d-flex align-items-center gap-1" style={{ color: meta.color }}>
                                            <i className={`fa-solid ${meta.icon}`} style={{
                                                fontSize: '0.7rem',
                                                background: meta.grad,
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent'
                                            }}></i>
                                            {meta.label}
                                        </p>
                                    );
                                })()}
                            </div>
                            <img
                                src={userProfile}
                                alt="Profile"
                                className="li-user-avatar d-none d-md-block ms-1 ms-md-2 shadow-sm"
                                style={{
                                    width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover',
                                    border: `2px solid ${userData?.Plan === 'pro' ? '#f59e0b' : userData?.Plan === 'plus' ? '#8b5cf6' : '#04bd20'}`,
                                    padding: '2px', background: '#fff'
                                }}
                                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (userData?.FirstName || 'User') + "&background=04bd20&color=fff"; }}
                            />
                        </div>
                    </div>
                </header>

                <div className="px-3 px-md-5 py-4 position-relative" style={{ minHeight: '80vh' }}>
                    <GlobalLoader contextLayout="student" />
                    {children}
                </div>
            </main>
        </div>
    );
};

export default StudentLayout;
