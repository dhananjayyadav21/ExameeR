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

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        const storedProfile = localStorage.getItem("Profile");
        if (storedProfile && storedProfile !== "undefined") {
            setProfile(storedProfile);
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
                                <a className="nav-link p-0" href="#" id="mobileProfileDropdown" role="button" data-bs-toggle="dropdown">
                                    <img className="profile-img rounded-circle" src={profile} alt="Avatar" style={{ width: '32px', height: '32px', border: '2px solid var(--primary-color)' }} />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2">
                                    <li><Link className="dropdown-item py-2" href="/myLearning">My Learning</Link></li>
                                    <li><Link className="dropdown-item py-2" href="/profile">View Profile</Link></li>
                                    {hasUserRole("Admin", "Instructor") && (
                                        <li><Link className="dropdown-item py-2 fw-bold text-primary" href="/dashboard">Dashboard</Link></li>
                                    )}
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item py-2 text-danger" onClick={handleLogout}>Logout</button></li>
                                </ul>
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
                                    <a className="nav-link p-0" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown">
                                        <img className="profile-img rounded-circle" src={profile} alt="Avatar" style={{ width: '38px', height: '38px', border: '2px solid var(--primary-color)', padding: '2px' }} />
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2" style={{ minWidth: '200px' }}>
                                        <li className="px-3 py-2 border-bottom mb-1">
                                            <span className="d-block small text-muted">Signed in as</span>
                                            <span className="fw-bold">Student</span>
                                        </li>
                                        <li><Link className="dropdown-item py-2" href="/myLearning">My Learning</Link></li>
                                        <li><Link className="dropdown-item py-2" href="/profile">View Profile</Link></li>
                                        {hasUserRole("Admin", "Instructor") && (
                                            <li><Link className="dropdown-item py-2 fw-bold text-primary" href="/dashboard">Admin Dashboard</Link></li>
                                        )}
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><button className="dropdown-item py-2 text-danger" onClick={handleLogout}>Logout</button></li>
                                    </ul>
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
                                {hasUserRole("Admin") && (
                                    <Link className="list-group-item list-group-item-action border-0 py-2 rounded-3 text-danger" href="/announcement" onClick={closeMobileMenu}>Announcements</Link>
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
        </>
    )
}

export default Navbar;
