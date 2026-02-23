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

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        college: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [submittedmsg, setSubmittedmsg] = useState("Thank you for enrolling! We will contact you soon.");
    const [showModal, setShowModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        setProgress(0);
        setProgress(100);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            courseId: course?._id
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
        if (!isLoggedIn) {
            toast.error('Please login to enroll!');
            return;
        }
        try {
            const response = await enrollCourse(formData);
            if (response.success === true) {
                router.push('/myLearning');
                toast.success('You are enrolled in course!', { position: 'top-right' });
            } else {
                setSubmittedmsg(response.message || 'Failed to enrolled in course.')
            }
        } catch (error) {
            setSubmittedmsg('Failed to enrolled in course. Try again.')
        }
        setSubmitted(true);
    };

    if (!course) {
        return (
            <div className="text-center my-5 py-5">
                <h4>Course not found!</h4>
                <p>Please select a course from the listing page.</p>
                <button className="btn btn-primary" onClick={() => router.push('/cource')}>Back to Courses</button>
            </div>
        );
    }

    const handlePlayVideo = (trialVideo) => {
        setVideoUrl(trialVideo);
        setShowModal(true);
    };

    return (
        <main>
            <VideoModalService
                videoUrl={videoUrl}
                show={showModal}
                onClose={() => setShowModal(false)}
            />
            <div id="enrollment" className="bg-body-tertiary" style={{ minHeight: "70vh" }}>
                <div className="p-5 bg-dark text-white position-relative">
                    <h2 className="rubik-font mb-3">{course?.title} Enrollment</h2>
                    <h5 className="text-light-emphasis my-3">{course?.description}</h5>
                    <span className="badge position-absolute bottom-0 end-0 m-3 bg-warning text-dark fw-semibold px-3 py-2 rounded-pill shadow">
                        {course?.courseLevel || "Intermediate"}
                    </span>
                    <p>Mentor: <strong>{course?.mentor}</strong></p>
                    <p>Start Date: <strong>{course?.startDate ? course?.startDate?.slice(0, 10) : "Coming Soon"}</strong></p>
                </div>

                <div className="container py-5">
                    <div className="row g-4">
                        <div className="col-md-7">
                            <div className="bg-white border-start border-4 border-primary p-4 shadow-sm rounded-3 mb-4">
                                <h4 className="rubik-font mb-2">Why Choose This Course?</h4>
                                <p className="text-muted mb-0">{course?.whyChoose}</p>
                            </div>

                            <div className="bg-white border-start border-4 border-success p-4 shadow-sm rounded-3 mb-4">
                                <h4 className="rubik-font mb-2">Course Benefits</h4>
                                <p className="text-muted mb-0">{course?.benefits}</p>
                            </div>

                            <div className="bg-white p-4 shadow-sm rounded-3">
                                <h4 className="rubik-font mb-3">Enroll Now</h4>
                                <p className="text-muted mb-4">Complete your details to enroll in this course.</p>
                                {submitted ? (
                                    <div className="alert alert-success text-center">
                                        {submittedmsg}
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Full Name" required />
                                        </div>
                                        <div className="mb-3">
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Email Address" required />
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className="form-control" placeholder="Mobile Number" required />
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" name="college" value={formData.college} onChange={handleChange} className="form-control" placeholder="College/University" />
                                        </div>
                                        <div className="text-center">
                                            <button className="btn btn-warning d-flex px-4" type="submit">Submit</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="card shadow-sm bg-white">
                                <div className="card-body">
                                    <h4 className="rubik-font mb-3">Course Summary</h4>
                                    <div className='position-relative'>
                                        <img
                                            src={course.courseImage ? `https://lh3.googleusercontent.com/d/${course.courseImage}` : "/assets/img/cource.jpg"}
                                            alt={course.title}
                                            className="img-fluid rounded-3 mb-4"
                                            style={{ width: '100%' }}
                                        />
                                        <span className="play-cource-demo position-absolute bg-light shadow-sm cursor-pointer d-flex align-items-center shadow-sm py-2 px-4 rounded-2 border"
                                            style={{ bottom: '20px', left: '20px' }}
                                            onClick={() => { handlePlayVideo(course?.trialVideo) }}>
                                            <i className="fa fa-play-circle text-warning me-2"></i>
                                            Watch Demo
                                        </span>
                                    </div>
                                    <p className="text-muted"><strong>Duration:</strong> {course?.duration}</p>
                                    <ul className="list-group mb-3">
                                        {course?.lectures?.map((lecture, index) => (
                                            <li key={index} className="list-group-item d-flex align-items-center my-1 shadow-sm">
                                                <i className="fa fa-play-circle text-warning me-2"></i>
                                                {lecture.title}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="border-top pt-3">
                                        <h6 className="d-flex justify-content-between"><span>Price:</span><span>₹ {course?.price}</span></h6>
                                        <h6 className="d-flex justify-content-between"><span>Discount:</span><span className="text-success">{course?.offerPercent}%</span></h6>
                                        <hr />
                                        <h5 className="fw-bold d-flex justify-content-between"><span>Total:</span><span className="text-black">₹ {course?.offerPrice}</span></h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <Footer />
            </footer>
        </main>
    );
}
