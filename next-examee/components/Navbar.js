"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from "react-toastify";
import hasUserRole from '../utils/hasUserRole';
import { useContext } from 'react';
import ContentContext from '@/context/ContentContext';

const Navbar = ({ setProgress = () => { } }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    const context = useContext(ContentContext);
    const { userData, getUser } = context;

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (storedToken && !userData) {
            getUser();
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const userProfile = userData?.Profile ? (userData.Profile.startsWith('http') ? userData.Profile : `https://lh3.googleusercontent.com/d/${userData.Profile}`) : "/assets/img/Avtar.jpg";
    const displayName = (userData?.FirstName || userData?.LastName) ? `${userData.FirstName} ${userData.LastName}`.trim() : (userData?.Username || "Profile");

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

    if (isDashboard || token) return null;

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
                                    <img
                                        src={userProfile}
                                        alt="Avatar"
                                        style={{ width: '34px', height: '34px', border: '2.5px solid #04bd20', objectFit: 'cover' }}
                                        className="rounded-circle"
                                        onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (userData?.FirstName || 'User') + "&background=04bd20&color=fff"; }}
                                    />
                                </a>
                                <div className="dropdown-menu dropdown-menu-end border-0 p-0 mt-2 profile-dropdown" style={{ minWidth: '260px', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                    {/* Header */}
                                    <div className="px-4 py-3 d-flex align-items-center gap-3" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
                                        <img
                                            src={userProfile}
                                            alt="Avatar"
                                            className="rounded-circle shadow-sm"
                                            style={{ width: '44px', height: '44px', border: '2px solid #04bd20', objectFit: 'cover', background: '#fff', padding: '1.5px' }}
                                            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (userData?.FirstName || 'User') + "&background=04bd20&color=fff"; }}
                                        />
                                        <div className="overflow-hidden">
                                            <p className="fw-bold text-white mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>{displayName}</p>
                                            <span className="badge rounded-pill" style={{ background: 'rgba(4,189,32,0.2)', color: '#4dfa6a', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{hasUserRole("Admin") ? "Admin" : "Student"}</span>
                                        </div>
                                    </div>
                                    {/* Links */}
                                    <div className="p-2">
                                        <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item mb-1" href="/profile">
                                            <span className="dd-icon bg-success-subtle text-success"><i className="fa-solid fa-user-circle"></i></span>
                                            <span className="fw-semibold">Personal Profile</span>
                                        </Link>
                                        <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item mb-1" href="/myLearning">
                                            <span className="dd-icon bg-primary-subtle text-primary"><i className="fa-solid fa-graduation-cap"></i></span>
                                            <span className="fw-semibold">My Courses</span>
                                        </Link>
                                        {hasUserRole("Admin", "Instructor") && (
                                            <>
                                                <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item mb-1" href="/dashboard">
                                                    <span className="dd-icon bg-warning-subtle text-warning"><i className="fa-solid fa-chart-line"></i></span>
                                                    <span className="fw-semibold">Dashboard</span>
                                                </Link>
                                                <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item" href="/announcement">
                                                    <span className="dd-icon" style={{ backgroundColor: '#f0fdf4', color: '#04bd20' }}><i className="fa-solid fa-bullhorn"></i></span>
                                                    <span className="fw-semibold">Announcement</span>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                    <div className="bg-light p-2 border-top">
                                        <button className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 text-danger fw-bold" onClick={handleLogout} style={{ fontSize: '0.85rem' }}>
                                            <span className="dd-icon bg-danger-subtle text-danger"><i className="fa-solid fa-power-off"></i></span>
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
                            <li className="nav-item dropdown dropdown-hover">
                                <a className="nav-link dropdown-toggle fw-semibold" href="#" id="categoryDropdown" role="button" data-bs-toggle="dropdown">
                                    <i className="fa-solid fa-shapes me-2 opacity-75"></i>Categories
                                </a>
                                <ul className="dropdown-menu shadow-xl border-0 p-2 mt-2 dropdown-premium animate-up">
                                    <li><button className="dropdown-item rounded-3 py-2 px-3 fw-medium d-flex align-items-center gap-3" onClick={() => handleCategoryChange('sciTechnology')}>
                                        <span className="cat-icon bg-success-subtle text-success"><i className="fa-solid fa-microchip"></i></span>
                                        Sci-Technology
                                    </button></li>
                                    <li><button className="dropdown-item rounded-3 py-2 px-3 fw-medium d-flex align-items-center gap-3" onClick={() => handleCategoryChange('commerce')}>
                                        <span className="cat-icon bg-primary-subtle text-primary"><i className="fa-solid fa-sack-dollar"></i></span>
                                        Commerce
                                    </button></li>
                                    <li><button className="dropdown-item rounded-3 py-2 px-3 fw-medium d-flex align-items-center gap-3" onClick={() => handleCategoryChange('artscivils')}>
                                        <span className="cat-icon bg-warning-subtle text-warning"><i className="fa-solid fa-palette"></i></span>
                                        Arts & Civils
                                    </button></li>
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
                                        <img
                                            src={userProfile}
                                            alt="Avatar"
                                            className="rounded-circle"
                                            style={{ width: '38px', height: '38px', border: '2.5px solid #04bd20', objectFit: 'cover' }}
                                            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (userData?.FirstName || 'User') + "&background=04bd20&color=fff"; }}
                                        />
                                        <i className="fa-solid fa-chevron-down text-muted" style={{ fontSize: '0.65rem' }}></i>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-end border-0 p-0 mt-2 profile-dropdown" style={{ minWidth: '280px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                        {/* User Header - Ultra Sleek */}
                                        <div className="px-4 py-4 d-flex align-items-center gap-3" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', position: 'relative', overflow: 'hidden' }}>
                                            <div className="position-absolute top-0 end-0 opacity-10" style={{ transform: 'translate(20%, -20%)' }}>
                                                <i className="fa-solid fa-user-graduate" style={{ fontSize: '5rem', color: '#fff' }}></i>
                                            </div>
                                            <div className="position-relative flex-shrink-0 z-1">
                                                <img
                                                    src={userProfile}
                                                    alt="Avatar"
                                                    className="rounded-circle shadow-sm"
                                                    style={{ width: '56px', height: '56px', border: '2.5px solid #04bd20', objectFit: 'cover', padding: '2px', background: '#fff' }}
                                                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (userData?.FirstName || 'User') + "&background=04bd20&color=fff"; }}
                                                />
                                                <span className="position-absolute bottom-0 end-0 rounded-circle" style={{ width: '14px', height: '14px', background: '#04bd20', border: '2.5px solid #0f172a' }}></span>
                                            </div>
                                            <div className="overflow-hidden z-1">
                                                <p className="text-white mb-0 text-truncate fw-bold" style={{ fontSize: '1rem', letterSpacing: '-0.02em' }}>{displayName}</p>
                                                <div className="d-flex align-items-center gap-2 mt-1">
                                                    <span className="px-2 py-0 fw-bold rounded-pill" style={{ background: 'rgba(4,189,32,0.2)', color: '#4dfa6a', fontSize: '0.65rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{hasUserRole("Admin") ? "Admin" : "Student"}</span>
                                                    <span className="text-white-50 small" style={{ fontSize: '0.7rem' }}>Verified</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Menu Items - Cleaner icons and labels */}
                                        <div className="p-2">
                                            {[
                                                { href: '/profile', label: 'Account Profile', icon: 'fa-user-gear', bg: '#f0fdf4', color: '#16a34a' },
                                                { href: '/myLearning', label: 'My Learning Center', icon: 'fa-book-bookmark', bg: '#f0f9ff', color: '#0284c7' },
                                                { href: '/notes', label: 'Resource Library', icon: 'fa-folder-open', bg: '#fdf2f8', color: '#db2777' }
                                            ].map((item, idx) => (
                                                <Link key={idx} className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item mb-1" href={item.href}>
                                                    <span className="dd-icon" style={{ backgroundColor: item.bg, color: item.color }}>
                                                        <i className={`fa-solid ${item.icon}`}></i>
                                                    </span>
                                                    <span className="dd-label fw-semibold">{item.label}</span>
                                                </Link>
                                            ))}

                                            {hasUserRole("Admin", "Instructor") && (
                                                <div className="mt-2 pt-2 border-top mx-2 mb-2">
                                                    <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item mb-1" href="/dashboard">
                                                        <span className="dd-icon bg-warning-subtle text-warning"><i className="fa-solid fa-gauge-high"></i></span>
                                                        <span className="dd-label fw-semibold">Dashboard</span>
                                                    </Link>
                                                    <Link className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 profile-item" href="/announcement">
                                                        <span className="dd-icon" style={{ backgroundColor: '#f0fdf4', color: '#04bd20' }}><i className="fa-solid fa-bullhorn"></i></span>
                                                        <span className="dd-label fw-semibold">Announcement</span>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                        {/* Footer - Professional Logout */}
                                        <div className="bg-light p-2 mt-1">
                                            <button className="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center gap-3 text-danger logout-btn" onClick={handleLogout}>
                                                <span className="dd-icon bg-danger-subtle text-danger"><i className="fa-solid fa-arrow-right-from-bracket"></i></span>
                                                <span className="fw-bold" style={{ fontSize: '0.85rem' }}>Log Out</span>
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

            {/* Mobile Menu Overlay - Premium Slide-in Style */}
            <div className={`mobile-menu-overlay d-lg-none transition-all duration-300 ${isMobileMenuOpen ? 'active' : ''}`}
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '280px',
                    height: '100vh',
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(15px)',
                    zIndex: 2100,
                    transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                    boxShadow: isMobileMenuOpen ? '-10px 0 50px rgba(0,0,0,0.1)' : 'none',
                    transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), background 0.3s ease'
                }}>
                <div className="h-100 d-flex flex-column shadow-lg border-start overflow-auto">
                    {/* Header */}
                    <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
                        <img src="/assets/img/brandlog.png" alt="Examee" style={{ height: "26px", width: "auto" }} />
                        <button className="btn btn-light-gray rounded-circle p-2" onClick={closeMobileMenu}>
                            <i className="fa-solid fa-xmark fs-5"></i>
                        </button>
                    </div>

                    <div className="p-4 flex-grow-1">
                        <h6 className="text-muted text-uppercase small ls-wide mb-3 fw-bold opacity-75" style={{ fontSize: '0.65rem' }}>Main Explorer</h6>
                        <div className="mb-4 d-grid gap-2">
                            {[
                                { link: '/notes', label: 'Study Notes', icon: 'fa-note-sticky', color: '#10b981' },
                                { link: '/video', label: 'Video Tutorials', icon: 'fa-circle-play', color: '#0ea5e9' },
                                { link: '/Q-paper', label: 'Old Papers', icon: 'fa-file-lines', color: '#f59e0b' },
                                { link: '/cource', label: 'Pro Courses', icon: 'fa-graduation-cap', color: '#6366f1' }
                            ].map((item, idx) => (
                                <Link key={idx} className="btn text-start d-flex align-items-center gap-3 py-3 px-3 rounded-4 bg-light border-0 hover-scale" href={item.link} onClick={closeMobileMenu}>
                                    <span className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: '40px', height: '40px', background: 'white', color: item.color, boxShadow: '0 4px 10px rgba(0,0,0,0.04)' }}>
                                        <i className={`fa-solid ${item.icon}`}></i>
                                    </span>
                                    <span className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <h6 className="text-muted text-uppercase small ls-wide mb-3 fw-bold opacity-75" style={{ fontSize: '0.65rem' }}>Other Info</h6>
                        <div className="d-grid gap-1">
                            <Link className="d-flex align-items-center gap-3 py-2 px-3 text-dark text-decoration-none fw-medium" href="/about" onClick={closeMobileMenu}>
                                <i className="fa-solid fa-circle-info text-muted w-25px"></i>About Us
                            </Link>
                            <Link className="d-flex align-items-center gap-3 py-2 px-3 text-dark text-decoration-none fw-medium" href="/contact" onClick={closeMobileMenu}>
                                <i className="fa-solid fa-headset text-muted w-25px"></i>Support
                            </Link>
                        </div>
                    </div>

                    {!token && (
                        <div className="p-4 mt-auto border-top">
                            <Link href="/auth" className="btn btn-green w-100 py-3 rounded-pill fw-bold shadow-md" onClick={closeMobileMenu}>Get Started</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop for Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
                    style={{ zIndex: 2050, backdropFilter: 'blur(2px)' }}
                    onClick={closeMobileMenu}></div>
            )}
            <style jsx>{`
                .profile-dropdown, .dropdown-premium { animation: dropIn 0.25s cubic-bezier(0.165, 0.84, 0.44, 1); }
                @keyframes dropIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .profile-item { font-size: 0.875rem; font-weight: 500; color: #374151; transition: background 0.12s; }
                .profile-item:hover { background: #f8fafc !important; color: #04bd20 !important; transform: translateX(4px); }
                .logout-btn:hover { background: #fff1f2 !important; transform: translateX(4px); }
                .dd-label { font-size: 0.82rem; line-height: 1.3; }
                .dd-icon, .cat-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem; transition: all 0.2s; }
                .profile-item:hover .dd-icon { transform: scale(1.1); }
                .dropdown-premium .dropdown-item:hover { background: #f8fafc !important; color: #04bd20 !important; }
                .w-25px { width: 25px; }
                @media (max-width: 991px) {
                    .navbar-toggler:focus { box-shadow: none; }
                }
            `}</style>
        </>
    )
}

export default Navbar;
