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
        if (!userData) {
            getUser();
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
                <header className="li-header px-3 px-md-5">
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
                                    <div className="dropdown-menu show shadow border-0 p-2 mt-2 position-absolute end-0 rounded-4 animate-fade-in" style={{ minWidth: '220px', zIndex: 1050 }}>
                                        <div className="px-3 py-2 border-bottom mb-2">
                                            <p className="fw-bold mb-0 smaller text-dark">{userData?.FirstName} {userData?.LastName}</p>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>{userData?.Email}</p>
                                        </div>
                                        <Link href="/profile" className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2 bg-transparent border-0 text-start text-dark text-decoration-none">
                                            <i className="fa-regular fa-user-circle opacity-50"></i> My Profile
                                        </Link>
                                        <Link href="/myLearning" className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2 bg-transparent border-0 text-start text-dark text-decoration-none">
                                            <i className="fa-solid fa-book-open opacity-50"></i> My Library
                                        </Link>
                                        {isSpecialUser && (
                                            <Link href="/dashboard" className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2 text-primary fw-bold text-decoration-none">
                                                <i className="fa-solid fa-gauge-high"></i> Instructor Dashboard
                                            </Link>
                                        )}
                                        <div className="dropdown-divider mx-2"></div>
                                        <button onClick={handleLogout} className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2 text-danger border-0 bg-transparent w-100 text-start">
                                            <i className="fa-solid fa-arrow-right-from-bracket opacity-50"></i> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="li-greet-text d-none d-lg-block ms-2">
                                <p className="li-greet-hi fw-bold mb-0" style={{ fontSize: '0.85rem' }}>Hi, {userData?.FirstName || 'Student'}</p>
                                <p className="smaller text-success mb-0 fw-bold"><i className="fa-solid fa-circle small me-1" style={{ fontSize: '0.5rem' }}></i>Pro Student</p>
                            </div>
                            <img
                                src={userProfile}
                                alt="Profile"
                                className="li-user-avatar d-none d-md-block ms-1 ms-md-2"
                                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #04bd20' }}
                                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (userData?.FirstName || 'User') + "&background=04bd20&color=fff"; }}
                            />
                        </div>
                    </div>
                </header>

                <div className="px-3 px-md-5 py-4 position-relative" style={{ minHeight: '80vh' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default StudentLayout;
