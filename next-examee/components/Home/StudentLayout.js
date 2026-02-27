"use client";
import React, { useContext, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ContentContext from '../../context/ContentContext';
import StudentSidebar from './StudentSidebar';
import { toast } from 'react-toastify';
import hasUserRole from '../../utils/hasUserRole';
import GlobalLoader from '../GlobalLoader';
import './student-layout.css';


const StudentLayout = ({ children, title = "Exploration" }) => {
    const context = useContext(ContentContext);
    const { userData, getUser } = context;
    const [searchTerm, setSearchTerm] = useState('');
    const [token, setToken] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

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

    const isSpecialUser = hasUserRole('instructor', 'admin');

    if (!token) return null;

    return (
        <div className="li-home-wrapper">
            <StudentSidebar />

            <main className="li-main">
                <header className="li-header">
                    <div className="d-flex align-items-center gap-4">
                        <h6 className="fw-bold mb-0 text-dark">{title} / <span className="text-dark">Explore</span></h6>
                        <div className="li-search-box">
                            <i className="fa-solid fa-magnifying-glass text-muted small"></i>
                            <input
                                type="text"
                                placeholder={`Search through our library...`}
                                className="li-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="li-user-greet">
                        <div className="d-flex align-items-center me-3 gap-3 d-none d-md-flex">
                            <div className="btn btn-light rounded-circle shadow-sm border p-2" style={{ width: '40px', height: '40px' }}>
                                <i className="fa-regular fa-bell"></i>
                            </div>
                            <div className="dropdown" ref={dropdownRef}>
                                <button
                                    className="btn btn-light rounded-circle shadow-sm border p-2"
                                    style={{ width: '40px', height: '40px' }}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <i className="fa-solid fa-gear"></i>
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
                        </div>
                        <div className="li-greet-text">
                            <p className="li-greet-hi fw-bold">Hi, {userData?.FirstName || 'Student'}</p>
                            <p className="smaller text-success mb-0 fw-bold"><i className="fa-solid fa-circle small me-1" style={{ fontSize: '0.5rem' }}></i>Pro Student</p>
                        </div>
                        <img
                            src={userData?.Profile ? (userData.Profile.startsWith('http') ? userData.Profile : `https://lh3.googleusercontent.com/d/${userData.Profile}`) : "/assets/img/Avtar.jpg"}
                            className="li-user-avatar border-2 shadow-sm"
                            alt="User"
                            onError={(e) => { e.target.src = "/assets/img/Avtar.jpg"; }}
                        />
                    </div>
                </header>

                <div className="px-5 py-4 position-relative" style={{ minHeight: '80vh' }}>
                    <GlobalLoader />
                    {children}
                </div>
            </main>
        </div>
    );
};

export default StudentLayout;
