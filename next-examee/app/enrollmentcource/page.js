"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ContentContext from "../../context/ContentContext";
import StudentLayout from '../../components/Home/StudentLayout';
import VideoModalService from '../../components/VideoPlay';

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
        <StudentLayout title="Error">
            <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '60vh' }}>
                <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                    <i className="fa-solid fa-triangle-exclamation text-danger fs-2"></i>
                </div>
                <h4 className="fw-black mb-1">Course Not Found</h4>
                <p className="text-muted small mb-4">Please select a course from the listings page.</p>
                <button className="btn btn-green rounded-pill px-5 py-2 fw-bold" onClick={() => router.push('/cource')}>
                    Back to Courses
                </button>
            </div>
        </StudentLayout>
    );

    const lectureCnt = course?.lectures?.length || 0;
    const offerPrice = course?.offerPrice;
    const price = course?.price;
    const bannerImg = course?.courseImage
        ? `https://lh3.googleusercontent.com/d/${course.courseImage}`
        : '/assets/img/cource.jpg';

    return (
        <StudentLayout title="Enrollment">
            <VideoModalService videoUrl={videoUrl} show={showModal} onClose={() => setShowModal(false)} />

            <div className="container-fluid px-0">
                <div className="mb-5">
                    <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill mb-3 fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                        <i className="fa-solid fa-signal me-2"></i>{course?.courseLevel || 'Intermediate'}
                    </span>
                    <h2 className="fw-black mb-1" style={{ fontSize: '2.2rem' }}>{course?.title}</h2>
                    <p className="text-muted lead mb-4" style={{ fontSize: '1.1rem' }}>{course?.description}</p>

                    <div className="d-flex flex-wrap gap-4">
                        <div className="d-flex align-items-center gap-2">
                            <i className="fa-solid fa-person-chalkboard text-success"></i>
                            <span className="text-muted small fw-bold">{course?.mentor}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <i className="fa-solid fa-layer-group text-success"></i>
                            <span className="text-muted small fw-bold">{lectureCnt} Lectures</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <i className="fa-solid fa-clock text-success"></i>
                            <span className="text-muted small fw-bold">{course?.duration}</span>
                        </div>
                        <button
                            className="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold flex-shrink-0"
                            onClick={() => { setVideoUrl(course?.trialVideo); setShowModal(true); }}
                        >
                            <i className="fa-solid fa-circle-play me-2"></i>Watch Demo
                        </button>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                            <h5 className="fw-black mb-4"><i className="fa-solid fa-lightbulb text-warning me-3"></i>Why Choose This Course?</h5>
                            <p className="text-muted small mb-0" style={{ lineHeight: '1.8' }}>{course?.whyChoose}</p>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                            <h5 className="fw-black mb-4"><i className="fa-solid fa-trophy text-primary me-3"></i>Course Benefits</h5>
                            <div className="row g-3">
                                {course?.benefits?.split(',').map((b, i) => (
                                    <div key={i} className="col-md-6">
                                        <div className="d-flex align-items-start gap-3">
                                            <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px', height: '24px' }}>
                                                <i className="fa-solid fa-check text-success small"></i>
                                            </div>
                                            <span className="text-muted small">{b.trim()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-black mb-4"><i className="fa-solid fa-graduation-cap text-success me-3"></i>Enrollment Form</h5>
                            {course?.isEnrolled ? (
                                <div className="text-center py-4">
                                    <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
                                        <i className="fa-solid fa-check text-success fs-3"></i>
                                    </div>
                                    <h6 className="fw-bold mb-2">You're Already Enrolled!</h6>
                                    <p className="text-muted small mb-4">You have full access to this course. Start learning now!</p>
                                    <button className="btn btn-primary-green rounded-pill px-5 py-2 fw-bold w-100" onClick={() => handleWatchCourse(course)}>
                                        Go to Course
                                    </button>
                                </div>
                            ) : (
                                submitted ? (
                                    <div className={`alert ${submittedOk ? 'alert-success' : 'alert-danger'} rounded-4 border-0 p-4 text-center`}>
                                        <i className={`fa-solid ${submittedOk ? 'fa-circle-check' : 'fa-circle-xmark'} fs-2 mb-3 d-block`}></i>
                                        <p className="fw-bold mb-0">{submittedmsg}</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control rounded-3 border-light bg-light" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
                                                    <label htmlFor="name" className="small text-muted">Full Name</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating mb-3">
                                                    <input type="email" className="form-control rounded-3 border-light bg-light" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                                                    <label htmlFor="email" className="small text-muted">Email Address</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control rounded-3 border-light bg-light" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" required />
                                                    <label htmlFor="mobile" className="small text-muted">Mobile Number</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control rounded-3 border-light bg-light" id="college" name="college" value={formData.college} onChange={handleChange} placeholder="College" />
                                                    <label htmlFor="college" className="small text-muted">College Name</label>
                                                </div>
                                            </div>
                                            <div className="col-12 mt-3">
                                                <button type="submit" disabled={loading} className="btn btn-green w-100 rounded-pill py-3 fw-bold">
                                                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</> : <><i className="fa-solid fa-bolt me-2"></i>Confirm Enrollment</>}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )
                            )}
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: '20px' }}>
                            <div className="position-relative">
                                <img src={bannerImg} className="w-100" style={{ height: '220px', objectFit: 'cover' }} alt={course.title} />
                                {course?.offerPercent > 0 && (
                                    <span className="position-absolute top-0 end-0 bg-danger text-white px-3 py-1 m-3 rounded-pill small fw-bold">{course.offerPercent}% OFF</span>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="d-flex align-items-baseline gap-2 mb-3">
                                    <h2 className="fw-black mb-0">₹{offerPrice}</h2>
                                    {price && price !== offerPrice && (
                                        <h5 className="text-muted text-decoration-line-through mb-0">₹{price}</h5>
                                    )}
                                </div>
                                <hr className="my-4 opacity-10" />
                                <h6 className="fw-bold mb-3 text-uppercase ls-wide smaller text-muted">Course Content</h6>
                                <div className="lectures-list custom-scrollbar" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {course?.lectures?.map((lec, i) => (
                                        <div key={i} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-light last-child-0">
                                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>
                                                {i + 1}
                                            </div>
                                            <span className="small text-dark fw-bold text-truncate">{lec.title}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="smaller text-muted text-center mt-3 mb-0">Secure Checkout <i className="fa-solid fa-shield-halved text-success ms-1"></i></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </StudentLayout>
    );
}

