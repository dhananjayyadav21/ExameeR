"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PLAN_LIMITS } from '../../utils/planAccess';

const StudentSidebar = ({ userData, handleLogout, isSpecialUser, userProfile }) => {
    const pathname = usePathname();
    const router = useRouter();
    const userPlan = userData?.Plan || 'e0';

    const isProfileComplete = (user) => {
        if (!user) return false;
        return !!(user.FirstName?.trim() && user.LastName?.trim() && user.Institution?.trim() && user.Phone?.trim());
    };

    const profileComplete = isProfileComplete(userData);

    const sidebarMenu = [
        {
            section: "LEARN Today",
            locked: !profileComplete,
            items: [
                { label: "Notes", icon: "fa-file-lines", href: "/notes" },
                { label: "PYQ", icon: "fa-circle-question", href: "/Q-paper" },
                { label: "Video", icon: "fa-circle-play", href: "/video" },
            ]
        },
        {
            section: "STUDY PACKS",
            items: [
                { label: "Course", icon: "fa-layer-group", href: "/cource" },
                { label: "Mock Test", icon: "fa-vial", href: "/mock-tests", premium: true },
            ]
        },
        {
            section: "EXPLORE EXAMEE",
            items: [
                { label: "Examee Books", icon: "fa-book", href: "/books", locked: userPlan === 'e0', premium: true },
                { label: "Call Book", icon: "fa-headset", href: "/call-book", locked: userPlan === 'e0', premium: true },
            ]
        },
        {
            section: "ACCOUNT",
            items: [
                { label: "My Profile", icon: "fa-circle-user", href: "/profile" },
                { label: "My Library", icon: "fa-book-open", href: "/myLearning", locked: !profileComplete },
                { label: "Plans & Pricing", icon: "fa-crown", href: "/plans" },
                { label: "Logout", icon: "fa-arrow-right-from-bracket", onClick: true, danger: true },
            ]
        }
    ];

    const isActive = (href) => {
        if (!href) return false;
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <aside className="li-sidebar">
            {/* Logo Area */}
            <div className="px-5 pt-3 pb-4 d-none d-lg-block text-center shadow-sm">
                <Link href="/" className="text-decoration-none">
                    <img src="/assets/img/brandlog.png" alt="Examee" style={{ height: "32px", width: "auto" }} />
                </Link>
            </div>

            {/* Mobile Only Header */}
            <div className="d-lg-none px-4 py-3 mb-4" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderBottom: '1px solid #e2e8f0' }}>
                <div className="d-flex align-items-center gap-3">
                    <img
                        src={userProfile}
                        alt="Profile"
                        className="li-user-avatar"
                        onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (userData?.FirstName || 'User') + "&background=04bd20&color=fff"; }}
                    />
                    <div>
                        <p className="fw-bold mb-0 text-dark" style={{ fontSize: '1.05rem' }}>{userData?.FirstName || 'Student'}</p>
                        {/* Show actual plan */}
                        {(() => {
                            const plan = userData?.Plan || 'e0';
                            const meta = {
                                e0: { label: 'E0 Free', color: '#04bd20', bg: '#f0fdf4', icon: 'fa-bolt', grad: 'linear-gradient(135deg, #04bd20 0%, #059669 100%)' },
                                plus: { label: 'Plus', color: '#8b5cf6', bg: '#faf5ff', icon: 'fa-star', grad: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' },
                                pro: { label: 'Pro', color: '#f59e0b', bg: '#fffbeb', icon: 'fa-crown', grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' }
                            }[plan];
                            return (
                                <span style={{
                                    fontSize: '0.65rem', fontWeight: 800, padding: '3px 12px', borderRadius: 20,
                                    background: meta.bg, color: meta.color, border: `1px solid ${meta.color}40`,
                                    display: 'inline-flex', alignItems: 'center', gap: 5, textTransform: 'uppercase'
                                }}>
                                    <i className={`fa-solid ${meta.icon}`} style={{
                                        fontSize: '0.7rem',
                                        background: meta.grad,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}></i>
                                    {meta.label} Plan
                                </span>
                            );
                        })()}
                    </div>
                </div>
            </div>

            <div className="flex-grow-1 py-4 overflow-auto custom-scrollbar">
                {sidebarMenu.map((sec, idx) => (
                    <div key={idx} className={`li-nav-section ${sec.locked ? 'li-nav-section--locked' : ''}`}>
                        <p className="li-section-label d-flex align-items-center justify-content-between">
                            {sec.section}
                            {sec.locked && <i className="fa-solid fa-lock ms-2 opacity-50" style={{ fontSize: '0.65rem' }}></i>}
                        </p>
                        {sec.items.map((item, i) => (
                            item.onClick ? (
                                <button
                                    key={i}
                                    onClick={handleLogout}
                                    className={`li-menu-item w-100 border-0 bg-transparent ${item.danger ? 'text-danger' : 'text-secondary'}`}
                                >
                                    <span className="li-menu-icon"><i className={`fa-solid ${item.icon}`}></i></span>
                                    <span className="ms-3">{item.label}</span>
                                </button>
                            ) : (
                                <Link
                                    key={i}
                                    href={item.locked ? "#" : item.href}
                                    onClick={(e) => {
                                        if (item.locked) {
                                            e.preventDefault();
                                            if (item.href === "/books" || item.href === "/call-book") {
                                                toast.info("Plus/Pro Plan required to access this feature!");
                                                router.push('/plans');
                                            } else {
                                                toast.warn("Complete your profile to unlock this section!");
                                            }
                                        }
                                    }}
                                    className={`li-menu-item ${isActive(item.href) ? 'li-menu-item--active' : ''} ${item.locked ? 'li-menu-item--locked' : ''}`}
                                >
                                    <span className="li-menu-icon" style={{ position: 'relative' }}>
                                        <i className={`fa-solid ${item.icon}`}></i>
                                        {item.premium && (
                                            <i className="fa-solid fa-crown" style={{
                                                position: 'absolute', top: -6, right: -6,
                                                fontSize: '0.5rem', color: '#f59e0b',
                                                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                            }}></i>
                                        )}
                                    </span>
                                    <span className="ms-3">{item.label}</span>
                                    {item.locked && <i className="fa-solid fa-lock ms-auto opacity-40" style={{ fontSize: '0.7rem' }}></i>}
                                </Link>
                            )
                        ))}
                    </div>
                ))}
            </div>

            {/* Sidebar Support Card (Premium V2) */}
            <div className="mt-auto px-1">
                <div className="li-support-card m-2 shadow-lg" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', borderRadius: '16px', padding: '16px' }}>
                    <p className="fw-bold mb-1" style={{ fontSize: '0.85rem', color: '#fff' }}>Need Help?</p>
                    <p className="mb-2" style={{ fontSize: '0.72rem', opacity: '0.8', color: '#fff', lineHeight: '1.3' }}>Get 24/7 priority support from our exam experts.</p>
                    <button
                        className="btn btn-success btn-sm w-100 rounded-pill fw-bold border-0 py-1"
                        style={{ background: '#04bd20', fontSize: '0.78rem', boxShadow: '0 4px 12px rgba(4, 189, 32, 0.3)' }}
                    >
                        Chat with Us
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default StudentSidebar;
