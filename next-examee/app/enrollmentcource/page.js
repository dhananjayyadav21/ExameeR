"use client";
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import VideoModalService from '../../components/VideoPlay';
import Footer from '../../components/Footer';
import ContentContext from '../../context/ContentContext';

export default function EnrollmentPage({ setProgress = () => { } }) {
    const router = useRouter();
    const { enrollCourse, selectedCourse: course } = useContext(ContentContext);

    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', college: '' });
    const [submitted, setSubmitted] = useState(false);
    const [submittedmsg, setSubmittedmsg] = useState('');
    const [submittedOk, setSubmittedOk] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { setProgress(0); setProgress(100); }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value, courseId: course?._id }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
        if (!isLoggedIn) { toast.error('Please login to enroll!'); return; }
        setLoading(true);
        try {
            const response = await enrollCourse(formData);
            if (response.success === true) {
                router.push('/myLearning');
                toast.success('You are enrolled in course!', { position: 'top-right' });
            } else {
                setSubmittedmsg(response.message || 'Failed to enroll in course.');
                setSubmittedOk(false);
            }
        } catch {
            setSubmittedmsg('Failed to enroll. Please try again.');
            setSubmittedOk(false);
        } finally {
            setLoading(false);
            setSubmitted(true);
        }
    };

    if (!course) return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <div style={{ background: 'rgba(220,53,69,0.08)', borderRadius: '50%', width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ color: '#dc3545', fontSize: '1.8rem' }}></i>
            </div>
            <h5 className="fw-bold text-dark mb-1">Course Not Found</h5>
            <p className="text-muted small mb-4">Please select a course from the listings page.</p>
            <button className="btn rounded-pill px-5 py-2 fw-bold" style={{ background: '#04bd20', color: 'white', border: 'none' }} onClick={() => router.push('/cource')}>
                Back to Courses
            </button>
        </div>
    );

    const lectureCnt = course?.lectures?.length || 0;
    const offerPrice = course?.offerPrice;
    const price = course?.price;

    return (
        <main className="min-vh-100" style={{ background: '#f8fafc' }}>
            <VideoModalService videoUrl={videoUrl} show={showModal} onClose={() => setShowModal(false)} />

            {/* Slim breadcrumb */}
            <div className="bg-white border-bottom py-3">
                <div className="container px-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0" style={{ fontSize: '0.78rem' }}>
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Home</a></li>
                            <li className="breadcrumb-item"><a href="/cource" className="text-decoration-none text-muted">Courses</a></li>
                            <li className="breadcrumb-item active fw-medium" style={{ color: '#04bd20' }}>Enroll</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Hero bar */}
            <div className="py-4" style={{ background: 'linear-gradient(135deg,#0f172a,#064e3b)' }}>
                <div className="container px-4">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <div>
                            <h1 className="text-white mb-1" style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{course?.title}</h1>
                            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{course?.description}</p>
                            <div className="d-flex gap-3 mt-2 flex-wrap">
                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                                    <i className="fa-solid fa-person-chalkboard me-1" style={{ color: '#04bd20' }}></i>
                                    {course?.mentor}
                                </span>
                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                                    <i className="fa-solid fa-calendar me-1" style={{ color: '#04bd20' }}></i>
                                    {course?.startDate ? course.startDate.slice(0, 10) : 'Coming Soon'}
                                </span>
                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                                    <i className="fa-solid fa-layer-group me-1" style={{ color: '#04bd20' }}></i>
                                    {lectureCnt} Lectures
                                </span>
                            </div>
                        </div>
                        <span className="badge rounded-pill px-3 py-2 fw-semibold flex-shrink-0"
                            style={{ background: 'rgba(245,158,11,0.18)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', fontSize: '0.8rem' }}>
                            <i className="fa-solid fa-signal me-1"></i>
                            {course?.courseLevel || 'Intermediate'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container py-4 px-4">
                <div className="row g-4">
                    {/* LEFT – Why + Benefits + Form */}
                    <div className="col-lg-7">
                        {/* Why Choose */}
                        <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{ width: '38px', height: '38px', background: 'rgba(4,189,32,0.1)' }}>
                                    <i className="fa-solid fa-lightbulb" style={{ color: '#04bd20', fontSize: '0.9rem' }}></i>
                                </div>
                                <h2 className="mb-0" style={{ fontSize: '1rem', fontWeight: 700 }}>Why Choose This Course?</h2>
                            </div>
                            <p className="text-muted mb-0" style={{ fontSize: '0.875rem', lineHeight: '1.7' }}>{course?.whyChoose}</p>
                        </div>

                        {/* Benefits */}
                        <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{ width: '38px', height: '38px', background: 'rgba(13,110,253,0.1)' }}>
                                    <i className="fa-solid fa-star" style={{ color: '#0d6efd', fontSize: '0.9rem' }}></i>
                                </div>
                                <h2 className="mb-0" style={{ fontSize: '1rem', fontWeight: 700 }}>Course Benefits</h2>
                            </div>
                            <p className="text-muted mb-0" style={{ fontSize: '0.875rem', lineHeight: '1.7' }}>{course?.benefits}</p>
                        </div>

                        {/* Enroll Form */}
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{ width: '38px', height: '38px', background: 'rgba(4,189,32,0.1)' }}>
                                    <i className="fa-solid fa-user-plus" style={{ color: '#04bd20', fontSize: '0.9rem' }}></i>
                                </div>
                                <div>
                                    <h2 className="mb-0" style={{ fontSize: '1rem', fontWeight: 700 }}>Enroll Now</h2>
                                    <p className="mb-0 text-muted" style={{ fontSize: '0.78rem' }}>Fill in your details to get started</p>
                                </div>
                            </div>

                            {submitted ? (
                                <div className={`rounded-3 p-4 text-center`}
                                    style={{ background: submittedOk ? 'rgba(4,189,32,0.07)' : 'rgba(220,53,69,0.07)' }}>
                                    <i className={`fa-solid ${submittedOk ? 'fa-circle-check' : 'fa-circle-xmark'} mb-2 d-block`}
                                        style={{ fontSize: '2rem', color: submittedOk ? '#04bd20' : '#dc3545' }}></i>
                                    <p className="fw-semibold mb-0" style={{ color: submittedOk ? '#039419' : '#dc3545' }}>{submittedmsg}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <label className="form-label fw-semibold" style={{ fontSize: '0.8rem' }}>Full Name</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                                className="form-control rounded-3" placeholder="Your full name" required style={{ fontSize: '0.875rem' }} />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label fw-semibold" style={{ fontSize: '0.8rem' }}>Email Address</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                                className="form-control rounded-3" placeholder="you@example.com" required style={{ fontSize: '0.875rem' }} />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label fw-semibold" style={{ fontSize: '0.8rem' }}>Mobile Number</label>
                                            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange}
                                                className="form-control rounded-3" placeholder="+91 XXXXX XXXXX" required style={{ fontSize: '0.875rem' }} />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label fw-semibold" style={{ fontSize: '0.8rem' }}>College / University</label>
                                            <input type="text" name="college" value={formData.college} onChange={handleChange}
                                                className="form-control rounded-3" placeholder="Your institution" style={{ fontSize: '0.875rem' }} />
                                        </div>
                                        <div className="col-12 pt-1">
                                            <button type="submit" className="btn w-100 py-3 rounded-3 fw-bold" disabled={loading}
                                                style={{ background: '#04bd20', color: 'white', border: 'none', fontSize: '0.9rem' }}>
                                                {loading
                                                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Enrolling…</>
                                                    : <><i className="fa-solid fa-graduation-cap me-2"></i>Confirm Enrollment</>}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* RIGHT – Course summary card */}
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: '80px' }}>
                            {/* Thumbnail */}
                            <div className="position-relative">
                                <img
                                    src={course.courseImage ? `https://lh3.googleusercontent.com/d/${course.courseImage}` : '/assets/img/cource.jpg'}
                                    alt={course.title}
                                    className="img-fluid"
                                    style={{ width: '100%', height: '210px', objectFit: 'cover' }}
                                />
                                {/* Play demo overlay */}
                                <button
                                    onClick={() => { setVideoUrl(course?.trialVideo); setShowModal(true); }}
                                    className="position-absolute d-flex align-items-center gap-2"
                                    style={{
                                        bottom: '14px', left: '14px', background: 'rgba(0,0,0,0.7)',
                                        backdropFilter: 'blur(8px)', color: 'white', border: '1px solid rgba(255,255,255,0.15)',
                                        borderRadius: '50px', padding: '7px 16px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                                    }}>
                                    <i className="fa-solid fa-circle-play" style={{ color: '#f59e0b', fontSize: '1rem' }}></i>
                                    Watch Demo
                                </button>
                            </div>

                            {/* Pricing */}
                            <div className="p-4">
                                <div className="d-flex align-items-baseline gap-2 mb-1">
                                    <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111' }}>₹{offerPrice}</span>
                                    {price && price !== offerPrice && (
                                        <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.9rem' }}>₹{price}</span>
                                    )}
                                    {course?.offerPercent > 0 && (
                                        <span className="badge ms-1 rounded-pill" style={{ background: 'rgba(4,189,32,0.12)', color: '#039419', fontSize: '0.75rem', fontWeight: 700 }}>
                                            {course?.offerPercent}% OFF
                                        </span>
                                    )}
                                </div>

                                <div className="d-flex gap-2 mb-3" style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                                    <span><i className="fa-solid fa-clock me-1"></i>{course?.duration}</span>
                                    <span>·</span>
                                    <span><i className="fa-solid fa-video me-1"></i>{lectureCnt} lectures</span>
                                </div>

                                {/* Lecture list */}
                                <p className="fw-bold mb-2" style={{ fontSize: '0.82rem', color: '#374151', letterSpacing: '0.02em' }}>COURSE CONTENT</p>
                                <div className="rounded-3 overflow-hidden border" style={{ maxHeight: '230px', overflowY: 'auto' }}>
                                    {course?.lectures?.map((lec, i) => (
                                        <div key={i} className="d-flex align-items-center gap-3 px-3 py-2"
                                            style={{ borderBottom: i < lectureCnt - 1 ? '1px solid #f1f1f1' : 'none', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                                            <span className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle"
                                                style={{ width: '24px', height: '24px', background: 'rgba(245,158,11,0.12)', color: '#f59e0b', fontSize: '0.6rem', fontWeight: 700 }}>
                                                {i + 1}
                                            </span>
                                            <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>{lec.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
