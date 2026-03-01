"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ContentContext from "../../context/ContentContext";
import StudentLayout from '../../components/Home/StudentLayout';
import VideoModalService from '../../components/VideoPlay';
import { Suspense } from "react";

function EnrollmentPage({ setProgress = () => { } }) {
    const router = useRouter();
    const { enrollCourse, selectedCourse: course, setSelectedCourse } = useContext(ContentContext);

    const [userProfile, setUserProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setProgress(0);
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            fetch("/api/auth/getUser", { headers: { 'AuthToken': token } })
                .then(r => r.json())
                .then(d => { if (d.success) setUserProfile(d.user); })
                .catch(console.error);
        }
        setProgress(100);
    }, []);

    const handleWatchCourse = () => {
        setSelectedCourse(course);
        router.push('/WatchCourse');
    };

    const loadRazorpay = () => new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });

    const handleEnroll = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) { toast.error('Please login to enroll!'); router.push('/auth'); return; }

        const finalPrice = course?.offerPrice > 0 ? course.offerPrice : course?.price;
        setLoading(true);

        if (finalPrice > 0) {
            const sdkLoaded = await loadRazorpay();
            if (!sdkLoaded) { toast.error("Razorpay SDK failed to load."); setLoading(false); return; }

            try {
                const orderRes = await fetch("/api/razorpay/order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "AuthToken": token },
                    body: JSON.stringify({ amount: finalPrice }),
                });
                const orderData = await orderRes.json();
                if (!orderData.success) { toast.error(orderData.message || "Order creation failed"); setLoading(false); return; }

                new window.Razorpay({
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: orderData.order.amount,
                    currency: orderData.order.currency,
                    name: "Examee",
                    description: `Enrollment: ${course.title}`,
                    order_id: orderData.order.id,
                    handler: async (response) => {
                        const verifyRes = await fetch("/api/razorpay/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "AuthToken": token },
                            body: JSON.stringify({
                                ...response,
                                courseId: course._id,
                                formData: {
                                    name: userProfile?.Name || '',
                                    email: userProfile?.Email || '',
                                    mobile: userProfile?.Mobile || '',
                                    college: userProfile?.University || ''
                                }
                            }),
                        });
                        const vd = await verifyRes.json();
                        if (vd.success) { toast.success("Enrolled successfully!"); router.push("/myLearning"); }
                        else toast.error(vd.message || "Verification failed");
                    },
                    prefill: {
                        name: userProfile?.Name || '',
                        email: userProfile?.Email || '',
                        contact: userProfile?.Mobile || '',
                    },
                    theme: { color: "#04bd20" },
                    modal: { ondismiss: () => setLoading(false) }
                }).open();
            } catch (e) {
                toast.error("Payment error. Try again.");
                setLoading(false);
            }
        } else {
            try {
                const response = await enrollCourse({
                    courseId: course?._id,
                    name: userProfile?.Name || '',
                    email: userProfile?.Email || '',
                    mobile: userProfile?.Mobile || ''
                });
                if (response?.success) { toast.success('You are enrolled!'); router.push('/myLearning'); }
                else toast.error(response?.message || 'Enrollment failed.');
            } catch { toast.error('Enrollment failed.'); }
            finally { setLoading(false); }
        }
    };

    if (!course) return (
        <StudentLayout title="Not Found">
            <div className="text-center py-5">
                <h4 className="fw-bold">Course Not Found</h4>
                <button className="btn btn-ep-primary mt-3 px-4" onClick={() => router.push('/cource')}>Browse Courses</button>
            </div>
        </StudentLayout>
    );

    const lectureCnt = course?.lectures?.length || 0;
    const finalPrice = course?.offerPrice > 0 ? course.offerPrice : course?.price;
    const originalPrice = course?.price;
    const bannerImg = course?.courseImage
        ? (course.courseImage.includes('public.blob.vercel-storage.com') ? course.courseImage : `https://lh3.googleusercontent.com/d/${course.courseImage}`)
        : '/assets/img/cource.jpg';

    return (
        <StudentLayout title={course?.title || "Course"}>
            <VideoModalService videoUrl={videoUrl} show={showModal} onClose={() => setShowModal(false)} />

            <div className="ep-wrapper">
                {/* ── Left Content ─────────────────────────────── */}
                <div className="ep-main">
                    {/* Breadcrumb */}
                    <nav className="ep-breadcrumb">
                        <span className="ep-crumb">{course?.category || 'General'}</span>
                        <i className="fa-solid fa-chevron-right ep-crumb-sep"></i>
                        <span className="ep-crumb active">{course?.courseLevel || 'All Levels'}</span>
                    </nav>

                    {/* Title Block */}
                    <h1 className="ep-title">{course?.title}</h1>
                    <p className="ep-desc">{course?.description}</p>

                    {/* Meta row */}
                    <div className="ep-meta-row">
                        <div className="ep-rating">
                            <span className="ep-rating-score">4.8</span>
                            {[1, 2, 3, 4, 5].map(s => <i key={s} className="fa-solid fa-star ep-star"></i>)}
                            <span className="ep-rating-count">(1,240 ratings)</span>
                        </div>
                        <div className="ep-meta-sep"></div>
                        <div className="ep-creator">
                            <i className="fa-solid fa-user-tie ep-icon-green me-1"></i>
                            Created by <strong>{course?.mentor}</strong>
                        </div>
                        <div className="ep-meta-sep"></div>
                        <div className="ep-meta-item">
                            <i className="fa-regular fa-calendar-check me-1 text-muted"></i>
                            <span className="text-muted small">Last updated 1/2026</span>
                        </div>
                    </div>

                    {/* What you'll learn */}
                    <div className="ep-section ep-learn-box">
                        <h2 className="ep-section-title">What you'll learn</h2>
                        <div className="ep-learn-grid">
                            {course?.benefits?.split(',').map((b, i) => (
                                <div key={i} className="ep-learn-item">
                                    <i className="fa-regular fa-circle-check ep-icon-green"></i>
                                    <span>{b.trim()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Requirements / Overview */}
                    {course?.whyChoose && (
                        <div className="ep-section">
                            <h2 className="ep-section-title">Requirements</h2>
                            <p className="ep-overview-text">{course?.whyChoose}</p>
                        </div>
                    )}

                    {/* Course Content */}
                    <div className="ep-section">
                        <div className="ep-content-header">
                            <h2 className="ep-section-title mb-0">Course Content</h2>
                            <span className="ep-content-meta">{lectureCnt} lectures</span>
                        </div>
                        <div className="ep-curriculum">
                            <div className="rounded-4 border overflow-hidden bg-white">
                                {course?.lectures?.map((lec, i) => (
                                    <div
                                        key={i}
                                        className={`p-3 d-flex justify-content-between align-items-center border-bottom lec-row ${lec.isFree ? 'lec-free' : 'lec-locked'}`}
                                        onClick={() => {
                                            if (lec.isFree) { setVideoUrl(lec.videoUrl); setShowModal(true); }
                                        }}
                                        style={{ cursor: lec.isFree ? 'pointer' : 'default' }}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <i className={`fa-regular ${lec.isFree ? 'fa-circle-play text-green' : 'fa-circle-play text-muted opacity-50'}`}></i>
                                            <span className="small fw-semibold text-secondary">{lec.title}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {lec.isFree ? (
                                                <span className="free-lecture-badge">
                                                    <i className="fa-solid fa-unlock-keyhole me-1" style={{ fontSize: '0.6rem' }}></i>Free
                                                </span>
                                            ) : (
                                                <span className="locked-lecture-badge">
                                                    <i className="fa-solid fa-lock me-1" style={{ fontSize: '0.6rem' }}></i>Enrolled
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Instructor */}
                    <div className="ep-section">
                        <h2 className="ep-section-title">Instructor</h2>
                        <div className="ep-instructor-card">
                            <div className="ep-instructor-avatar">
                                <i className="fa-solid fa-user-tie fa-2x ep-icon-green"></i>
                            </div>
                            <div>
                                <h5 className="ep-instructor-name">{course?.mentor}</h5>
                                <p className="ep-instructor-role">Academic Expert & Mentor at Examee</p>
                                <p className="ep-instructor-bio">
                                    Specializing in curated academic content and competitive examination strategies, dedicated to helping students unlock their full potential through structured learning paths.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Sticky Sidebar ───────────────────────────── */}
                <aside className="ep-sidebar">
                    <div className="ep-card">
                        {/* Thumbnail with preview overlay */}
                        <div className="ep-card-thumb" onClick={() => { setVideoUrl(course?.trialVideo); setShowModal(true); }}>
                            <img src={bannerImg} alt={course?.title} className="ep-thumb-img" />
                            <div className="ep-thumb-overlay">
                                <div className="ep-play-btn">
                                    <i className="fa-solid fa-play"></i>
                                </div>
                            </div>
                            <div className="ep-thumb-label">Preview this course</div>
                        </div>

                        <div className="ep-card-body">
                            {/* Price */}
                            <div className="ep-price-row">
                                <span className="ep-price">₹{finalPrice}</span>
                                {originalPrice && finalPrice && originalPrice !== finalPrice && (
                                    <span className="ep-price-original">₹{originalPrice}</span>
                                )}
                                {course?.offerPercent > 0 && (
                                    <span className="ep-discount-tag">{course.offerPercent}% OFF</span>
                                )}
                            </div>

                            {/* CTA Button */}
                            {course?.isEnrolled ? (
                                <button className="ep-cta-btn ep-cta-resume" onClick={handleWatchCourse}>
                                    <i className="fa-solid fa-play me-2"></i> Continue Learning
                                </button>
                            ) : (
                                <button className="ep-cta-btn" onClick={handleEnroll} disabled={loading}>
                                    {loading
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <><i className="fa-solid fa-bolt me-2"></i> Enroll Now</>
                                    }
                                </button>
                            )}

                            <p className="ep-guarantee">30-Day Money-Back Guarantee</p>

                            {/* Includes list */}
                            <div className="ep-includes">
                                <p className="ep-includes-title">This course includes:</p>
                                <div className="ep-include-item"><i className="fa-solid fa-infinity"></i> Full lifetime access</div>
                                <div className="ep-include-item"><i className="fa-regular fa-file-video"></i> {lectureCnt} video lectures</div>
                                <div className="ep-include-item"><i className="fa-solid fa-certificate"></i> Certificate of completion</div>
                                <div className="ep-include-item"><i className="fa-solid fa-mobile-screen-button"></i> Access on mobile & web</div>
                            </div>

                            {/* Razorpay badge */}
                            <div className="ep-razorpay-badge">
                                <i className="fa-solid fa-lock ep-icon-green me-1"></i>
                                <span>Secured by Razorpay</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <style jsx>{`
                /* ── Layout ─────────────────────────── */
                .ep-wrapper {
                    display: flex;
                    gap: 48px;
                    padding: 36px 24px 60px;
                    max-width: 1200px;
                    margin: 0 auto;
                    align-items: flex-start;
                }
                .ep-main { flex: 1; min-width: 0; }
                .ep-sidebar { width: 360px; flex-shrink: 0; position: sticky; top: 24px; }

                /* ── Breadcrumb ──────────────────────── */
                .ep-breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
                .ep-crumb { font-size: 0.78rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
                .ep-crumb.active { color: #04bd20; }
                .ep-crumb-sep { font-size: 0.55rem; color: #cbd5e1; }

                /* ── Title & Description ─────────────── */
                .ep-title { font-size: 2.2rem; font-weight: 900; color: #0f172a; letter-spacing: -1px; line-height: 1.15; margin-bottom: 14px; }
                .ep-desc { font-size: 1.05rem; color: #64748b; line-height: 1.7; margin-bottom: 20px; max-width: 720px; }

                /* ── Meta Row ────────────────────────── */
                .ep-meta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 14px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; margin-bottom: 36px; }
                .ep-rating { display: flex; align-items: center; gap: 6px; }
                .ep-rating-score { font-weight: 900; color: #f59e0b; font-size: 0.95rem; }
                .ep-star { color: #f59e0b; font-size: 0.75rem; }
                .ep-rating-count { font-size: 0.8rem; color: #64748b; }
                .ep-meta-sep { width: 1px; height: 16px; background: #e2e8f0; }
                .ep-creator { font-size: 0.9rem; color: #475569; }
                .ep-meta-item { font-size: 0.85rem; }

                /* ── Sections ────────────────────────── */
                .ep-section { margin-bottom: 44px; }
                .ep-section-title { font-size: 1.15rem; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 18px; }

                /* What you'll learn */
                .ep-learn-box { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; }
                .ep-learn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                .ep-learn-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.88rem; color: #475569; font-weight: 600; }

                /* Overview text */
                .ep-overview-text { font-size: 0.95rem; color: #64748b; line-height: 1.8; }

                /* Curriculum */
                .ep-content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                .ep-content-meta { font-size: 0.8rem; color: #94a3b8; font-weight: 700; }
                .ep-curriculum { border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
                .ep-module-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
                .ep-module-name { font-size: 0.85rem; font-weight: 800; color: #1e293b; }
                .ep-module-count { font-size: 0.75rem; color: #94a3b8; font-weight: 700; }
                .ep-chevron { font-size: 0.65rem; color: #94a3b8; }
                .ep-lecture-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-bottom: 1px solid #f1f5f9; background: #fff; transition: background 0.15s; }
                .ep-lecture-row:last-child { border-bottom: none; }
                .ep-lecture-row:hover { background: #f8fafc; }
                .ep-lecture-title { font-size: 0.85rem; color: #475569; font-weight: 600; }
                .ep-preview-btn { background: none; border: none; color: #04bd20; font-size: 0.8rem; font-weight: 800; cursor: pointer; padding: 4px 10px; border-radius: 6px; transition: background 0.15s; }
                .ep-preview-btn:hover { background: #f0fdf4; }

                /* Instructor */
                .ep-instructor-card { display: flex; gap: 20px; align-items: flex-start; background: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #f1f5f9; }
                .ep-instructor-avatar { width: 72px; height: 72px; min-width: 72px; background: #f0fdf4; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                .ep-instructor-name { font-size: 1.05rem; font-weight: 900; color: #0f172a; margin-bottom: 4px; }
                .ep-instructor-role { font-size: 0.78rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
                .ep-instructor-bio { font-size: 0.88rem; color: #64748b; line-height: 1.7; margin-bottom: 0; }

                /* ── Sidebar Card ─────────────────────── */
                .ep-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.07); }
                .ep-card-thumb { position: relative; height: 210px; cursor: pointer; overflow: hidden; }
                .ep-thumb-img { width: 100%; height: 100%; object-fit: cover; }
                .ep-thumb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.25); opacity: 0; display: flex; align-items: center; justify-content: center; transition: opacity 0.25s; }
                .ep-card-thumb:hover .ep-thumb-overlay { opacity: 1; }
                .ep-play-btn { width: 56px; height: 56px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #0f172a; }
                .ep-thumb-label { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.55); color: #fff; text-align: center; font-size: 0.75rem; font-weight: 700; padding: 8px; }

                .ep-card-body { padding: 24px; }

                .ep-price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
                .ep-price { font-size: 2rem; font-weight: 900; color: #0f172a; letter-spacing: -1px; }
                .ep-price-original { font-size: 1rem; color: #94a3b8; text-decoration: line-through; font-weight: 600; }
                .ep-discount-tag { font-size: 0.75rem; font-weight: 900; background: #f0fdf4; color: #04bd20; padding: 3px 10px; border-radius: 20px; }

                .ep-cta-btn { width: 100%; padding: 14px; background: #04bd20; color: #fff; border: none; border-radius: 12px; font-size: 1rem; font-weight: 900; letter-spacing: 0.02em; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
                .ep-cta-btn:hover:not(:disabled) { background: #03a81c; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(4,189,32,0.25); }
                .ep-cta-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .ep-cta-resume { background: #0f172a; }
                .ep-cta-resume:hover { background: #1e293b !important; }

                .ep-guarantee { text-align: center; font-size: 0.72rem; color: #94a3b8; font-weight: 700; margin-bottom: 20px; }

                .ep-includes { border-top: 1px solid #f1f5f9; padding-top: 18px; margin-bottom: 18px; }
                .ep-includes-title { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin-bottom: 12px; }
                .ep-include-item { display: flex; align-items: center; gap: 10px; font-size: 0.82rem; color: #475569; font-weight: 600; margin-bottom: 8px; }
                .ep-include-item i { color: #64748b; width: 16px; text-align: center; }

                .ep-razorpay-badge { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.72rem; color: #94a3b8; font-weight: 700; border-top: 1px solid #f1f5f9; padding-top: 14px; }

                /* ── Utilities ───────────────────────────── */
                .ep-icon-green { color: #04bd20 !important; }
                .text-green { color: #04bd20 !important; }

                /* Lecture badges */
                .lec-row { transition: background 0.15s; }
                .lec-free:hover { background: #f0fdf4 !important; }
                .free-lecture-badge { display: inline-flex; align-items: center; font-size: 0.7rem; font-weight: 800; color: #059669; background: #ecfdf5; border: 1px solid #6ee7b7; padding: 3px 9px; border-radius: 20px; }
                .locked-lecture-badge { display: inline-flex; align-items: center; font-size: 0.7rem; font-weight: 800; color: #94a3b8; background: #f8fafc; border: 1px solid #e2e8f0; padding: 3px 9px; border-radius: 20px; }
                
                @media (max-width: 1024px) {
                    .ep-wrapper { flex-direction: column; }
                    .ep-sidebar { width: 100%; position: static; }
                    .ep-learn-grid { grid-template-columns: 1fr; }
                }
                @media (max-width: 640px) {
                    .ep-title { font-size: 1.6rem; }
                    .ep-wrapper { padding: 20px 16px 48px; }
                }
            `}</style>
        </StudentLayout>
    );
}

function EnrollmentPageContent(props) {
    return (
        <Suspense fallback={null}>
            <EnrollmentPage {...props} />
        </Suspense>
    );
}

export default EnrollmentPageContent;
