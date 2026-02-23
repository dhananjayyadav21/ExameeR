"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from "react-toastify";
import hasUserRole from '../utils/hasUserRole';

const Navbar = ({ setProgress = () => { } }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [token, setToken] = useState(null);
    const [profile, setProfile] = useState("/assets/img/Avtar.jpg");
    const [username, setUsername] = useState('');

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        const storedProfile = localStorage.getItem("Profile");
        if (storedProfile && storedProfile !== "undefined") {
            setProfile(storedProfile);
        }
        const storedUsername = localStorage.getItem("Username");
        if (storedUsername && storedUsername !== "undefined") {
            setUsername(storedUsername);
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setProgress(0);
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setProgress(100);
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    }

    const handleCategoryChange = (category) => {
        setProgress(0);
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', category);
        router.push(`?${params.toString()}`);
        closeMobileMenu();
        setProgress(100);
    }

    const handleLogout = () => {
        setProgress(0);
        localStorage.clear();
        setToken(null);
        router.push("/login");
        toast.error("You're now logged out !!", {
            position: "top-right"
        });
        setProgress(100);
    }

    return (
        <>
            <nav className={`navbar sticky-top navbar-expand-lg transition-all duration-300 py-3 ${isScrolled ? 'shadow-md glass-effect' : ''}`}
                style={{
                    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'var(--primary-white)',
                    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
                    borderBottom: isScrolled ? '1px solid var(--border-color)' : 'none'
                }}>
                <div className="container px-4">
                    <Link className="navbar-brand d-flex align-items-center" href="/" onClick={closeMobileMenu}>
                        <img src="/assets/img/brandlog.png" alt="Examee" style={{ height: "32px", width: "auto" }} />
                    </Link>

                    <div className="d-flex align-items-center gap-3">
                        {/* Mobile Profile & Toggle */}
                        {token && (
                            <div className="nav-item dropdown d-lg-none">
                                <a className="nav-link p-0" href="#" id="mobileProfileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img className="rounded-circle" src={profile} alt="Avatar"
                                        style={{ width: '34px', height: '34px', border: '2.5px solid #04bd20', objectFit: 'cover' }} />
                                </a>
                                <div className="dropdown-menu dropdown-menu-end border-0 p-0 mt-2 profile-dropdown" style={{ minWidth: '230px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.13)' }}>
                                    {/* Header */}
                                    <div className="px-4 py-3 d-flex align-items-center gap-3" style={{ background: 'linear-gradient(135deg,#0f172a,#064e3b)' }}>
                                        <img src={profile} alt="Avatar" className="rounded-circle flex-shrink-0" style={{ width: '42px', height: '42px', border: '2px solid #04bd20', objectFit: 'cover' }} />
                                        <div className="overflow-hidden">
                                            <p className="fw-bold text-white mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>@{username || 'Profile'}</p>
                                            <span className="badge rounded-pill" style={{ background: 'rgba(4,189,32,0.25)', color: '#4dfa6a', fontSize: '0.68rem' }}>Student</span>
                                        </div>
                                    </div>
                                    {/* Links */}
                                    <div className="py-2 px-2">
                                        <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item" href="/profile">
                                            <span className="dd-icon bg-success-subtle text-success"><i className="fa-solid fa-user fa-fw"></i></span>
                                            View Profile
                                        </Link>
                                        <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item" href="/myLearning">
                                            <span className="dd-icon bg-primary-subtle text-primary"><i className="fa-solid fa-graduation-cap fa-fw"></i></span>
                                            My Learning
                                        </Link>
                                        {hasUserRole("Admin", "Instructor") && (
                                            <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item" href="/dashboard">
                                                <span className="dd-icon bg-warning-subtle text-warning"><i className="fa-solid fa-gauge fa-fw"></i></span>
                                                Dashboard
                                            </Link>
                                        )}
                                    </div>
                                    <div className="px-2 pb-2">
                                        <div className="dropdown-divider my-0 mb-2"></div>
                                        <button className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 text-danger" onClick={handleLogout}
                                            style={{ fontWeight: 600 }}>
                                            <span className="dd-icon bg-danger-subtle text-danger"><i className="fa-solid fa-right-from-bracket fa-fw"></i></span>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isDashboard && (
                            <button className="navbar-toggler border-0 p-1" type="button" onClick={toggleMobileMenu}>
                                <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} fs-4`}></i>
                            </button>
                        )}
                    </div>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle fw-medium" href="#" id="categoryDropdown" role="button" data-bs-toggle="dropdown">
                                    <i className="fa-solid fa-shapes me-2 opacity-75"></i>Categories
                                </a>
                                <ul className="dropdown-menu shadow-lg border-0">
                                    <li><button className="dropdown-item py-2" onClick={() => handleCategoryChange('sciTechnology')}>Sci-Technology</button></li>
                                    <li><button className="dropdown-item py-2" onClick={() => handleCategoryChange('commerce')}>Commerce</button></li>
                                    <li><button className="dropdown-item py-2" onClick={() => handleCategoryChange('artscivils')}>Arts & Civils</button></li>
                                </ul>
                            </li>
                        </ul>

                        <ul className="navbar-nav ms-auto align-items-center gap-lg-3">
                            <li className="nav-item"><Link className="nav-link fw-medium" href="/notes">Notes</Link></li>
                            <li className="nav-item"><Link className="nav-link fw-medium" href="/video">Video</Link></li>
                            <li className="nav-item"><Link className="nav-link fw-medium" href="/Q-paper">Q-Paper</Link></li>
                            <li className="nav-item"><Link className="nav-link fw-medium" href="/cource">Courses</Link></li>
                            <li className="nav-item"><Link className="nav-link fw-medium" href="/about">About</Link></li>

                            {token ? (
                                <li className="nav-item dropdown d-none d-lg-block">
                                    <a className="nav-link p-0 d-flex align-items-center gap-2" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img className="rounded-circle" src={profile} alt="Avatar"
                                            style={{ width: '38px', height: '38px', border: '2.5px solid #04bd20', objectFit: 'cover' }} />
                                        <i className="fa-solid fa-chevron-down text-muted" style={{ fontSize: '0.65rem' }}></i>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-end border-0 p-0 mt-2 profile-dropdown" style={{ minWidth: '250px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.13)' }}>
                                        {/* User Header */}
                                        <div className="px-4 py-3 d-flex align-items-center gap-3" style={{ background: 'linear-gradient(135deg,#0f172a,#064e3b)' }}>
                                            <div className="position-relative flex-shrink-0">
                                                <img src={profile} alt="Avatar" className="rounded-circle" style={{ width: '48px', height: '48px', border: '2px solid #04bd20', objectFit: 'cover' }} />
                                                <span className="position-absolute bottom-0 end-0 rounded-circle" style={{ width: '13px', height: '13px', background: '#04bd20', border: '2px solid #0f172a' }}></span>
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-white mb-0 text-truncate" style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: '-0.01em' }}>@{username || 'Profile'}</p>
                                                <span className="px-2 py-0" style={{ background: 'rgba(4,189,32,0.22)', color: '#5ef774', fontSize: '0.68rem', fontWeight: 600, borderRadius: '50px', letterSpacing: '0.03em' }}>Student</span>
                                            </div>
                                        </div>
                                        {/* Menu Items */}
                                        <div className="py-1 px-2">
                                            <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item" href="/profile">
                                                <span className="dd-icon bg-success-subtle text-success"><i className="fa-solid fa-user fa-fw"></i></span>
                                                <span className="dd-label">View Profile</span>
                                            </Link>
                                            <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item" href="/myLearning">
                                                <span className="dd-icon bg-primary-subtle text-primary"><i className="fa-solid fa-graduation-cap fa-fw"></i></span>
                                                <span className="dd-label">My Learning</span>
                                            </Link>
                                            <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item" href="/notes">
                                                <span className="dd-icon bg-success-subtle text-success"><i className="fa-solid fa-file-lines fa-fw"></i></span>
                                                <span className="dd-label">Browse Notes</span>
                                            </Link>
                                            {hasUserRole("Admin", "Instructor") && (
                                                <>
                                                    <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item" href="/dashboard">
                                                        <span className="dd-icon bg-warning-subtle text-warning"><i className="fa-solid fa-gauge fa-fw"></i></span>
                                                        <span className="dd-label">Admin Dashboard</span>
                                                    </Link>
                                                    <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item" href="/announcement">
                                                        <span className="dd-icon bg-danger-subtle text-danger"><i className="fa-solid fa-bullhorn fa-fw"></i></span>
                                                        <span className="dd-label">Announcements</span>
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                        <div className="px-2 pb-2">
                                            <div style={{ height: '1px', background: '#f0f0f0', margin: '0 4px 8px' }}></div>
                                            <button className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3" onClick={handleLogout}
                                                style={{ color: '#dc3545', fontWeight: 600, fontSize: '0.875rem' }}>
                                                <span className="dd-icon bg-danger-subtle text-danger"><i className="fa-solid fa-right-from-bracket fa-fw"></i></span>
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ) : (
                                <li className="nav-item ms-lg-2">
                                    <Link href="/auth" className="btn btn-green rounded-pill px-4 py-2 fw-bold shadow-sm">Get Started</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay d-lg-none transition-all duration-300 ${isMobileMenuOpen ? 'active' : ''}`}
                style={{
                    position: 'fixed',
                    top: '60px',
                    left: 0,
                    width: '100%',
                    height: isMobileMenuOpen ? 'calc(100vh - 60px)' : '0',
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 1040,
                    overflow: 'hidden',
                    opacity: isMobileMenuOpen ? 1 : 0,
                    visibility: isMobileMenuOpen ? 'visible' : 'hidden'
                }}>
                <div className="container py-4">
                    <div className="row g-4">
                        <div className="col-12">
                            <h6 className="text-muted text-uppercase small ls-wide mb-3 px-2">Navigation</h6>
                            <div className="list-group list-group-flush border-0">
                                <Link className="list-group-item list-group-item-action border-0 fs-5 py-3 rounded-3 mb-1" href="/notes" onClick={closeMobileMenu}>
                                    <i className="fa-solid fa-note-sticky me-3 text-success"></i>Notes
                                </Link>
                                <Link className="list-group-item list-group-item-action border-0 fs-5 py-3 rounded-3 mb-1" href="/video" onClick={closeMobileMenu}>
                                    <i className="fa-solid fa-circle-play me-3 text-info"></i>Videos
                                </Link>
                                <Link className="list-group-item list-group-item-action border-0 fs-5 py-3 rounded-3 mb-1" href="/Q-paper" onClick={closeMobileMenu}>
                                    <i className="fa-solid fa-file-lines me-3 text-warning"></i>Q-Paper
                                </Link>
                                <Link className="list-group-item list-group-item-action border-0 fs-5 py-3 rounded-3 mb-1" href="/cource" onClick={closeMobileMenu}>
                                    <i className="fa-solid fa-graduation-cap me-3 text-primary"></i>Courses
                                </Link>
                            </div>
                        </div>
                        <div className="col-12 pt-2">
                            <h6 className="text-muted text-uppercase small ls-wide mb-3 px-2">Information</h6>
                            <div className="list-group list-group-flush border-0">
                                <Link className="list-group-item list-group-item-action border-0 py-2 rounded-3" href="/about" onClick={closeMobileMenu}>About Us</Link>
                                <Link className="list-group-item list-group-item-action border-0 py-2 rounded-3" href="/contact" onClick={closeMobileMenu}>Support</Link>
                                {hasUserRole("Admin", "Instructor") && (
                                    <Link className="list-group-item list-group-item-action border-0 py-2 rounded-3" href="/announcement" onClick={closeMobileMenu}>
                                        <i className="fa-solid fa-bullhorn me-2 text-danger"></i>Announcements
                                    </Link>
                                )}
                            </div>
                        </div>
                        {!token && (
                            <div className="col-12 mt-4 px-4">
                                <Link href="/auth" className="btn btn-green w-100 py-3 rounded-pill fw-bold shadow-md" onClick={closeMobileMenu}>Login / Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .profile-dropdown { animation: dropIn 0.15s ease; }
                @keyframes dropIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
                .profile-item { font-size: 0.875rem; font-weight: 500; color: #374151; transition: background 0.12s; }
                .profile-item:hover { background: #f0fdf4 !important; color: #039419 !important; }
                .dd-label { font-size: 0.875rem; font-weight: 500; line-height: 1.3; }
                .dd-icon { width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem; }
            `}</style>
        </>
    )
}

export default Navbar;
