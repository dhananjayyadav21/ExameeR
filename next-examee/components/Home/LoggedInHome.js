import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ContentContext from '../../context/ContentContext';
import NotesItem from '../NotesItem';
import CourceIteam from './CourceIteam';
import StudentLayout from './StudentLayout';
import { academicOptions } from '../../constants/academicOptions';
import { GETCourse_URL, GETNOTE_URL, GETPYQ_URL, GETVideo_URL } from '../../utils/GlobalURL';

const LoggedInHome = ({ userData }) => {
    const context = useContext(ContentContext);
    const { Course, getCourse, Notes, getNote, PYQS, getPYQ, Video, getVideo } = context;
    const router = useRouter();

    useEffect(() => {
        if (userData) {
            const query = `?course=${userData.Course || ''}&semester=${userData.Semester || ''}&university=${userData.University || ''}&category=${userData.Category || ''}`;
            getCourse(`${GETCourse_URL}${query}`);
            getNote(`${GETNOTE_URL}${query}`);
            getPYQ(`${GETPYQ_URL}${query}`);
            getVideo(`${GETVideo_URL}${query}`);
        } else {
            getCourse();
            getNote();
            getPYQ();
            getVideo();
        }
    }, [userData]);

    const dashboardCards = [
        { title: 'Courses', count: Course.length, icon: 'fa-layer-group', color: '#0ea5e9', bg: '#f0f9ff', href: '/cource' },
        { title: 'Notes', count: Notes.length, icon: 'fa-file-lines', color: '#16a34a', bg: '#f0fdf4', href: '/notes' },
        { title: 'Video Lectures', count: Video.length, icon: 'fa-circle-play', color: '#6366f1', bg: '#f5f3ff', href: '/video' },
        { title: 'Question Papers', count: PYQS.length, icon: 'fa-circle-question', color: '#f59e0b', bg: '#fffbeb', href: '/Q-paper' },
    ];

    return (
        <StudentLayout title="Dashboard">
            <div className="container-fluid px-0">
                {/* Greeting Section */}
                <div className="mb-5">
                    <h2 className="fw-black mb-1" style={{ fontSize: '1.8rem' }}>Welcome Back, {userData?.FirstName || 'Student'}! 👋</h2>
                    <p className="text-muted mb-0">What would you like to learn today? Access your study material below.</p>
                </div>

                {/* Stat Grid */}
                <div className="row g-4 mb-5">
                    {dashboardCards.map((card, idx) => (
                        <div key={idx} className="col-xl-3 col-md-6">
                            <Link href={card.href} className="text-decoration-none">
                                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 transition-all hover-lift" style={{ backgroundColor: '#fff' }}>
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="rounded-3 d-flex align-items-center justify-content-center"
                                            style={{ width: '45px', height: '45px', backgroundColor: card.bg, color: card.color }}>
                                            <i className={`fa-solid ${card.icon} fs-5`}></i>
                                        </div>
                                        <i className="fa-solid fa-arrow-right text-muted opacity-25"></i>
                                    </div>
                                    <h3 className="fw-black mb-1" style={{ fontSize: '1.5rem', color: '#111827' }}>{card.count}</h3>
                                    <p className="text-muted small fw-bold mb-0 text-uppercase ls-wide" style={{ letterSpacing: '0.05em' }}>{card.title}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="row g-4">
                    {/* Featured / Recent Content Section */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold mb-0">Recommended for You</h5>
                                <Link href="/cource" className="text-decoration-none small fw-bold text-success">View All</Link>
                            </div>
                            <div className="row g-3">
                                {Course.length === 0 ? (
                                    <div className="col-12 py-4 text-center text-muted small">No courses matching your preferences.</div>
                                ) : (
                                    Course.slice(0, 2).map((c, i) => (
                                        <div key={i} className="col-md-6">
                                            <CourceIteam Course={c} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold mb-0">Personalized Notes</h5>
                                <Link href="/notes" className="text-decoration-none small fw-bold text-success">Browse All</Link>
                            </div>
                            <div className="row g-3">
                                {Notes.length === 0 ? (
                                    <div className="col-12 py-4 text-center text-muted small">No notes matching your preferences.</div>
                                ) : (
                                    Notes.slice(0, 3).map((n, i) => (
                                        <div key={i} className="col-md-4">
                                            <NotesItem notes={n} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Side Panel: Quick Actions / Profile Summary */}
                    <div className="col-lg-4">
                        {/* Academic Profile Summary Case: Image shown in request */}
                        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ background: '#fff' }}>
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h6 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Academic Profile</h6>
                                <Link href="/profile" className="text-decoration-none smaller fw-bold text-success"><i className="fa-solid fa-pen-to-square"></i></Link>
                            </div>

                            <div className="row g-3">
                                <div className="col-6">
                                    <p className="smaller text-muted text-uppercase fw-bold mb-1" style={{ letterSpacing: '0.05em', fontSize: '0.65rem' }}>University</p>
                                    <div className="d-flex align-items-start gap-2">
                                        <i className="fa-solid fa-building-columns text-muted opacity-50 mt-1"></i>
                                        <span className="small fw-semibold text-dark truncate" title={userData?.University}>{userData?.University || 'Not Set'}</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <p className="smaller text-muted text-uppercase fw-bold mb-1" style={{ letterSpacing: '0.05em', fontSize: '0.65rem' }}>Course</p>
                                    <div className="d-flex align-items-start gap-2">
                                        <i className="fa-solid fa-graduation-cap text-muted opacity-50 mt-1"></i>
                                        <span className="small fw-semibold text-dark truncate" title={userData?.Course}>{userData?.Course || 'Not Set'}</span>
                                    </div>
                                </div>
                                <div className="col-6 mt-3">
                                    <p className="smaller text-muted text-uppercase fw-bold mb-1" style={{ letterSpacing: '0.05em', fontSize: '0.65rem' }}>Semester</p>
                                    <div className="d-flex align-items-start gap-2">
                                        <i className="fa-solid fa-calendar-days text-muted opacity-50 mt-1"></i>
                                        <span className="small fw-semibold text-dark">{userData?.Semester || 'Not Set'}</span>
                                    </div>
                                </div>
                                <div className="col-12 mt-3 p-2 bg-light-subtle rounded-3" style={{ border: '1px solid #f1f5f9' }}>
                                    <p className="smaller text-muted text-uppercase fw-bold mb-1" style={{ letterSpacing: '0.05em', fontSize: '0.65rem' }}>Core Category</p>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="p-1 bg-success-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                                            <i className="fa-solid fa-layer-group text-success" style={{ fontSize: '0.7rem' }}></i>
                                        </div>
                                        <span className="small fw-bold text-dark">{academicOptions.categories.find(c => c.value === userData?.Category)?.label || 'Not Set'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white mb-4">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <img
                                    src={userData?.Profile ? (userData.Profile.startsWith('http') ? userData.Profile : `https://lh3.googleusercontent.com/d/${userData.Profile}`) : "/assets/img/Avtar.jpg"}
                                    className="rounded-circle border border-2 border-white border-opacity-25"
                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                    alt="User"
                                />
                                <div className="overflow-hidden">
                                    <h6 className="fw-bold mb-0 text-truncate">{userData?.FirstName} {userData?.LastName}</h6>
                                    <p className="mb-0 small opacity-75">{userData?.Role || 'Student'}</p>
                                </div>
                            </div>
                            <hr className="opacity-25" />
                            <div className="d-flex flex-column gap-2 mb-4">
                                <Link href="/profile" className="btn btn-outline-light rounded-pill btn-sm text-start ps-3 py-2 border-0 bg-white bg-opacity-10 d-flex align-items-center gap-3">
                                    <i className="fa-regular fa-user-circle"></i> View My Profile
                                </Link>
                                <Link href="/myLearning" className="btn btn-outline-light rounded-pill btn-sm text-start ps-3 py-2 border-0 bg-white bg-opacity-10 d-flex align-items-center gap-3">
                                    <i className="fa-solid fa-book-open"></i> My Library
                                </Link>
                            </div>
                            <button className="btn btn-green w-100 rounded-pill fw-bold" onClick={() => router.push('/notes')}>
                                Resume Learning
                            </button>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 p-4 border-dashed border-2">
                            <h6 className="fw-bold mb-3">Goal of the Month</h6>
                            <div className="bg-light p-3 rounded-4 mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="small text-muted">Course Completion</span>
                                    <span className="small fw-bold">65%</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div className="progress-bar bg-success" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            <p className="smaller text-muted mb-0">You're doing great! Keep studying consistent.</p>
                        </div>
                    </div>
                </div>
            </div>

        </StudentLayout>
    );
};


export default LoggedInHome;
