"use client";
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import VideoModalService from '../../components/VideoPlay';
import Footer from '../../components/Footer';
import ContentContext from '../../context/ContentContext';

export default function EnrollmentPage({ setProgress = () => { } }) {
    const router = useRouter();
    const { enrollCourse, selectedCourse: course, setSelectedCourse } = useContext(ContentContext);

    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', college: '' });
    const [submitted, setSubmitted] = useState(false);
    const [submittedmsg, setSubmittedmsg] = useState('');
    const [submittedOk, setSubmittedOk] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { setProgress(0); setProgress(100); }, []);

    const handleWatchCourse = (course) => {
        setSelectedCourse(course);
        router.push('/WatchCourse');
    };

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
                toast.success('You are enrolled in the course!', { position: 'top-right' });
            } else {
                setSubmittedmsg(response.message || 'Failed to enroll in course.');
                setSubmittedOk(false);
                setSubmitted(true);
            }
        } catch {
            setSubmittedmsg('Failed to enroll. Please try again.');
            setSubmittedOk(false);
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    if (!course) return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <div style={{ background: 'rgba(220,53,69,0.08)', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ color: '#dc3545', fontSize: '2rem' }}></i>
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
    const bannerImg = course?.courseImage
        ? `https://lh3.googleusercontent.com/d/${course.courseImage}`
        : '/assets/img/cource.jpg';

    return (
        <main className="min-vh-100" style={{ background: '#f0f4f8' }}>
            <VideoModalService videoUrl={videoUrl} show={showModal} onClose={() => setShowModal(false)} />

            {/* ══ FULL-WIDTH HERO BANNER ══ */}
            <div style={{ position: 'relative', width: '100%', minHeight: '420px', overflow: 'hidden' }}>
                {/* Background image */}
                <img
                    src={bannerImg}
                    alt={course?.title}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                />
                {/* Dark gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,20,10,0.88) 0%, rgba(4,60,20,0.82) 50%, rgba(10,20,10,0.92) 100%)' }} />

                {/* Breadcrumb */}
                <div style={{ position: 'relative', zIndex: 2, padding: '20px 0 0' }}>
                    <div className="container px-4">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0" style={{ fontSize: '0.78rem' }}>
                                <li className="breadcrumb-item">
                                    <a href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</a>
                                </li>
                                <li className="breadcrumb-item">
                                    <a href="/cource" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Courses</a>
                                </li>
                                <li className="breadcrumb-item" style={{ color: '#04bd20', fontWeight: 500 }}>Enroll</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Hero content */}
                <div style={{ position: 'relative', zIndex: 2, padding: '36px 0 60px' }}>
                    <div className="container px-4">
                        <div className="row align-items-end">
                            <div className="col-lg-8">
                                {/* Level badge */}
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    background: 'rgba(245,158,11,0.18)', color: '#f59e0b',
                                    border: '1px solid rgba(245,158,11,0.35)',
                                    borderRadius: '50px', padding: '5px 14px', fontSize: '0.76rem',
                                    fontWeight: 700, letterSpacing: '0.04em', marginBottom: '16px'
                                }}>
                                    <i className="fa-solid fa-signal"></i>
                                    {course?.courseLevel || 'Intermediate'}
                                </span>

                                <h1 style={{ color: 'white', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '14px' }}>
                                    {course?.title}
                                </h1>

                                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px', maxWidth: '600px' }}>
                                    {course?.description}
                                </p>

                                {/* Meta pills */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {[
                                        { icon: 'fa-person-chalkboard', label: course?.mentor },
                                        { icon: 'fa-calendar-days', label: course?.startDate ? course.startDate.slice(0, 10) : 'Coming Soon' },
                                        { icon: 'fa-layer-group', label: `${lectureCnt} Lectures` },
                                        { icon: 'fa-clock', label: course?.duration },
                                    ].filter(m => m.label).map((meta, i) => (
                                        <span key={i} style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '7px',
                                            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            borderRadius: '50px', padding: '6px 14px',
                                            color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: 500
                                        }}>
                                            <i className={`fa-solid ${meta.icon}`} style={{ color: '#04bd20', fontSize: '0.72rem' }}></i>
                                            {meta.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Demo video button on right */}
                            <div className="col-lg-4 mt-4 mt-lg-0 d-flex justify-content-lg-end">
                                <button
                                    onClick={() => { setVideoUrl(course?.trialVideo); setShowModal(true); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.22)', borderRadius: '16px',
                                        padding: '14px 22px', cursor: 'pointer', color: 'white', transition: 'all 0.2s'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                                >
                                    <span style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <i className="fa-solid fa-circle-play" style={{ color: '#f59e0b', fontSize: '1.3rem' }}></i>
                                    </span>
                                    <div style={{ textAlign: 'left' }}>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>Watch Demo</p>
                                        <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)' }}>Free preview</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ CONTENT BELOW BANNER ══ */}
            <div className="container px-4" style={{ paddingTop: '32px' }}>
                <div className="row g-4 align-items-start">

                    {/* ── LEFT COLUMN ── */}
                    <div className="col-lg-7">

                        {/* Why Choose card */}
                        <div style={cardStyle}>
                            <div style={cardHeaderStyle('#04bd20', 'rgba(4,189,32,0.08)')}>
                                <span style={iconBoxStyle('#04bd20', 'rgba(4,189,32,0.12)')}>
                                    <i className="fa-solid fa-lightbulb" style={{ color: '#04bd20', fontSize: '0.95rem' }}></i>
                                </span>
                                <div>
                                    <h2 style={sectionTitle}>Why Choose This Course?</h2>
                                    <p style={sectionSub}>What makes this course stand out</p>
                                </div>
                            </div>
                            <div style={{ padding: '20px 24px 24px' }}>
                                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.75', margin: 0 }}>{course?.whyChoose}</p>
                            </div>
                        </div>

                        {/* Benefits card */}
                        <div style={{ ...cardStyle, marginTop: '20px' }}>
                            <div style={cardHeaderStyle('#0d6efd', 'rgba(13,110,253,0.06)')}>
                                <span style={iconBoxStyle('#0d6efd', 'rgba(13,110,253,0.1)')}>
                                    <i className="fa-solid fa-trophy" style={{ color: '#0d6efd', fontSize: '0.95rem' }}></i>
                                </span>
                                <div>
                                    <h2 style={sectionTitle}>Course Benefits</h2>
                                    <p style={sectionSub}>What you'll gain after completing</p>
                                </div>
                            </div>
                            <div style={{ padding: '20px 24px 24px' }}>
                                <div style={{ display: 'grid', gap: '10px' }}>
                                    {course?.benefits?.split(',').map((b, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <span style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(4,189,32,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
                                                <i className="fa-solid fa-check" style={{ color: '#04bd20', fontSize: '0.6rem' }}></i>
                                            </span>
                                            <span style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.5' }}>
                                                {b.trim().charAt(0).toUpperCase() + b.trim().slice(1)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Enroll / Watch Course card */}
                        <div style={{ ...cardStyle, marginTop: '20px' }}>
                            {course?.isEnrolled ? (
                                /* ── Already Enrolled State ── */
                                <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg,#04bd20,#06d6a0)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(4,189,32,0.35)' }}>
                                        <i className="fa-solid fa-circle-check" style={{ color: 'white', fontSize: '1.6rem' }}></i>
                                    </div>
                                    <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', margin: '0 0 8px' }}>You're Already Enrolled!</h2>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
                                        You have full access to this course. Start learning now!
                                    </p>
                                    <button
                                        onClick={() => handleWatchCourse(course)}
                                        style={{
                                            width: '100%', padding: '14px', borderRadius: '14px',
                                            border: 'none', background: 'linear-gradient(135deg,#04bd20,#03a01a)',
                                            color: 'white', fontWeight: 700, fontSize: '0.95rem',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', gap: '10px',
                                            boxShadow: '0 4px 14px rgba(4,189,32,0.35)', transition: 'all 0.2s'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(4,189,32,0.5)'}
                                        onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(4,189,32,0.35)'}
                                    >
                                        <i className="fa-solid fa-circle-play" style={{ fontSize: '1.1rem' }}></i>
                                        Watch Course Now
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                    <button
                                        onClick={() => router.push('/myLearning')}
                                        style={{
                                            width: '100%', padding: '11px', marginTop: '10px', borderRadius: '14px',
                                            border: '1.5px solid #e2e8f0', background: 'transparent',
                                            color: '#64748b', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#f8fafc'; }}
                                        onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <i className="fa-solid fa-book me-2"></i>Go to My Learning
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div style={cardHeaderStyle('#04bd20', 'rgba(4,189,32,0.06)')}>
                                        <span style={iconBoxStyle('#04bd20', 'rgba(4,189,32,0.12)')}>
                                            <i className="fa-solid fa-graduation-cap" style={{ color: '#04bd20', fontSize: '0.95rem' }}></i>
                                        </span>
                                        <div>
                                            <h2 style={sectionTitle}>Enroll Now</h2>
                                            <p style={sectionSub}>Fill in your details to get started</p>
                                        </div>
                                    </div>
                                    <div style={{ padding: '20px 24px 24px' }}>
                                        {submitted ? (
                                            <div style={{
                                                borderRadius: '14px', padding: '32px 24px', textAlign: 'center',
                                                background: submittedOk ? 'rgba(4,189,32,0.06)' : 'rgba(220,53,69,0.06)',
                                                border: `1px solid ${submittedOk ? 'rgba(4,189,32,0.2)' : 'rgba(220,53,69,0.2)'}`
                                            }}>
                                                <i className={`fa-solid ${submittedOk ? 'fa-circle-check' : 'fa-circle-xmark'} mb-3 d-block`}
                                                    style={{ fontSize: '2.5rem', color: submittedOk ? '#04bd20' : '#dc3545' }}></i>
                                                <p className="fw-semibold mb-0" style={{ color: submittedOk ? '#039419' : '#dc3545', fontSize: '0.95rem' }}>
                                                    {submittedmsg}
                                                </p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit}>
                                                <div className="row g-3">
                                                    {[
                                                        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', required: true, icon: 'fa-user' },
                                                        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', required: true, icon: 'fa-envelope' },
                                                        { name: 'mobile', label: 'Mobile Number', type: 'text', placeholder: '+91 XXXXX XXXXX', required: true, icon: 'fa-phone' },
                                                        { name: 'college', label: 'College / University', type: 'text', placeholder: 'Your institution', required: false, icon: 'fa-building-columns' },
                                                    ].map(field => (
                                                        <div key={field.name} className="col-sm-6">
                                                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.78rem', fontWeight: 600, color: '#374151', letterSpacing: '0.02em' }}>
                                                                {field.label}
                                                            </label>
                                                            <div style={{ position: 'relative' }}>
                                                                <i className={`fa-solid ${field.icon}`} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.8rem' }}></i>
                                                                <input
                                                                    type={field.type} name={field.name}
                                                                    value={formData[field.name]} onChange={handleChange}
                                                                    placeholder={field.placeholder} required={field.required}
                                                                    style={{
                                                                        width: '100%', padding: '10px 12px 10px 34px',
                                                                        borderRadius: '10px', border: '1.5px solid #e5e7eb',
                                                                        fontSize: '0.875rem', outline: 'none',
                                                                        transition: 'border-color 0.2s',
                                                                        fontFamily: 'inherit', background: '#fafafa'
                                                                    }}
                                                                    onFocus={e => e.target.style.borderColor = '#04bd20'}
                                                                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="col-12 mt-2">
                                                        <button type="submit" disabled={loading} style={{
                                                            width: '100%', padding: '14px', borderRadius: '12px',
                                                            border: 'none', background: loading ? '#94d9a2' : 'linear-gradient(135deg,#04bd20,#03a01a)',
                                                            color: 'white', fontWeight: 700, fontSize: '0.95rem',
                                                            cursor: loading ? 'not-allowed' : 'pointer',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                            boxShadow: '0 4px 14px rgba(4,189,32,0.25)', transition: 'all 0.2s'
                                                        }}
                                                            onMouseOver={e => { if (!loading) e.currentTarget.style.boxShadow = '0 6px 20px rgba(4,189,32,0.38)'; }}
                                                            onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(4,189,32,0.25)'}
                                                        >
                                                            {loading
                                                                ? <><span className="spinner-border spinner-border-sm"></span> Enrolling…</>
                                                                : <><i className="fa-solid fa-bolt"></i> Confirm Enrollment</>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ── RIGHT COLUMN — Sticky Course Card ── */}
                        <div className="col-lg-5">
                            <div style={{ ...cardStyle, position: 'sticky', top: '80px' }}>
                                {/* Thumbnail strip */}
                                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                                    <img
                                        src={bannerImg}
                                        alt={course?.title}
                                        style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                                    />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7))' }} />
                                    {/* Offer badge */}
                                    {course?.offerPercent > 0 && (
                                        <span style={{
                                            position: 'absolute', top: '14px', right: '14px',
                                            background: '#04bd20', color: 'white', fontWeight: 800,
                                            fontSize: '0.8rem', borderRadius: '8px', padding: '4px 10px'
                                        }}>
                                            {course.offerPercent}% OFF
                                        </span>
                                    )}
                                </div>

                                {/* Pricing block */}
                                <div style={{ padding: '20px 24px 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '2rem', fontWeight: 900, color: '#111', lineHeight: 1 }}>₹{offerPrice}</span>
                                        {price && price !== offerPrice && (
                                            <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '1rem' }}>₹{price}</span>
                                        )}
                                    </div>
                                    <p style={{ color: '#6b7280', fontSize: '0.78rem', margin: '0 0 16px' }}>
                                        One-time payment · Lifetime access
                                    </p>

                                    {/* Quick stats row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                        {[
                                            { icon: 'fa-video', label: 'Lectures', value: lectureCnt },
                                            { icon: 'fa-clock', label: 'Duration', value: course?.duration || '—' },
                                            { icon: 'fa-person-chalkboard', label: 'Mentor', value: course?.mentor || '—' },
                                            { icon: 'fa-signal', label: 'Level', value: course?.courseLevel || 'Intermediate' },
                                        ].map((s, i) => (
                                            <div key={i} style={{
                                                background: '#f8fafc', borderRadius: '12px', padding: '12px 14px',
                                                border: '1px solid #f1f1f1'
                                            }}>
                                                <i className={`fa-solid ${s.icon}`} style={{ color: '#04bd20', fontSize: '0.8rem', marginBottom: '4px', display: 'block' }}></i>
                                                <p style={{ margin: 0, fontSize: '0.68rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
                                                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{s.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div style={{ height: '1px', background: '#f0f0f0', margin: '0 0 16px' }} />

                                    {/* Course content label */}
                                    <p style={{ margin: '0 0 10px', fontSize: '0.75rem', fontWeight: 700, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                        Course Content
                                    </p>
                                </div>

                                {/* Lecture list */}
                                <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '0 24px 24px' }}>
                                    <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                                        {course?.lectures?.map((lec, i) => (
                                            <div key={i} style={{
                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                padding: '10px 14px',
                                                background: i % 2 === 0 ? 'white' : '#fafafa',
                                                borderBottom: i < lectureCnt - 1 ? '1px solid #f3f4f6' : 'none'
                                            }}>
                                                <span style={{
                                                    flexShrink: 0, width: '26px', height: '26px',
                                                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: 'rgba(245,158,11,0.1)', fontSize: '0.68rem', fontWeight: 800, color: '#f59e0b'
                                                }}>{i + 1}</span>
                                                <span style={{ fontSize: '0.825rem', color: '#374151', fontWeight: 500 }}>{lec.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div style={{ marginTop: '60px' }}>
                <Footer />
            </div>

            <style jsx>{`
                input:focus { outline: none; }
            `}</style>
        </main>
    );
}

/* ── Reusable style objects ── */
const cardStyle = {
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.05)',
};

const cardHeaderStyle = (color, bg) => ({
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '20px 24px 16px',
    background: bg,
    borderBottom: `1px solid ${color}22`,
});

const iconBoxStyle = (color, bg) => ({
    width: '42px', height: '42px', borderRadius: '12px',
    background: bg, border: `1px solid ${color}33`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
});

const sectionTitle = {
    fontSize: '1rem', fontWeight: 700, margin: 0, color: '#111', letterSpacing: '-0.01em'
};

const sectionSub = {
    fontSize: '0.75rem', color: '#9ca3af', margin: '2px 0 0', fontWeight: 400
};
