import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import ContentContext from '../context/ContentContext';
import VideoModalService from '../utils/VideoPlay';
import Footer from './Footer';
import { toast } from 'react-toastify';

const EnrolledCoursePage = ({ setProgress }) => {
    const navigate = useNavigate();
    // const context = useContext(ContentContext);
    // const { getEnrolledCourseDetails } = context;

    const location = useLocation();
    const { course } = location.state || {};

    // eslint-disable-next-line
    const [courseData, setCourseData] = useState(course);
    const [showModal, setShowModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        setProgress(100);
        if (!course?._id) {
            toast.error("Invalid course.");
            navigate('/myLearning');
        }

        // const fetchCourse = async () => {
        //     try {
        //         const res = await getEnrolledCourseDetails(courseId);
        //         if (res.success) {
        //             setCourseData(res.data);
        //         } else {
        //             toast.error(res.message || "Could not fetch course.");
        //             navigate('/myLearning');
        //         }
        //     } catch (err) {
        //         console.error(err);
        //         toast.error("Server error.");
        //     }
        //     setProgress(100);
        // };

        // fetchCourse();
        // eslint-disable-next-line
    }, []);

    const handlePlayVideo = (url) => {
        setVideoUrl(url);
        setShowModal(true);
    };

    if (!courseData) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <span className='text-bold mx-2' >Loading...</span>
            </div>
        );
    };

    return (
        <>
            <VideoModalService
                videoUrl={videoUrl}
                show={showModal}
                onClose={() => setShowModal(false)}
            />

            <div className="bg-body-tertiary p-md-3" style={{ minHeight: "70vh" }}>
                <div className="py-3 px-3 px-md-5 shadow-sm bg-white text-black position-relative">
                    <div className='py-2 py-md-4'>
                        <h3 className="rubik-font mb-3">{courseData?.title}</h3>
                        <h6 className="text-light-emphasis my-3">{courseData?.description}</h6>
                    </div>
                    <div className='d-flex justify-content-end gap-3'>
                        <span><strong>{courseData?.mentor}</strong></span>
                        <span><strong>{courseData?.startDate?.slice(0, 10) || "N/A"}</strong></span>
                    </div>
                </div>

                <div className="container py-5">
                    <div className="row">
                        {/* Left Side */}
                        <div className="col-md-5">
                            <div className="card shadow-sm bg-white">
                                <div className="card-body">
                                    <img
                                        src={`https://lh3.googleusercontent.com/d/${courseData?.courseImage}` || "/assets/img/cource.jpg"}
                                        alt={courseData.title}
                                        className="img-fluid rounded-3 mb-4"
                                    />
                                    <div className="border-top pt-3">
                                        <h6 className="fw-bold">Benefits:</h6>
                                        <ul className="ps-3">
                                            {courseData?.benefits?.split(',').map((benefit, index) => (
                                                <li className='text-muted' key={index}>
                                                    {benefit.trim().charAt(0).toUpperCase() + benefit.trim().slice(1) + "."}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Right Side */}
                        <div className="col-md-7">
                            <div className="bg-white p-4 shadow-sm rounded-3 mb-4">
                                <h4 className="rubik-font mb-3">Your Learning Progress</h4>
                                <p>Progress: {courseData?.progress || 0}%</p>
                                {courseData?.certificateIssued && (
                                    <p className="text-success">🎉 Certificate Issued</p>
                                )}
                            </div>

                            <div className="bg-white p-4 shadow-sm rounded-3 mb-4">
                                <h4 className="rubik-font mb-3">Lectures</h4>
                                <ul className="list-group">
                                    {courseData?.lectures?.map((lecture, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>{lecture.title}</span>
                                            <button className="btn btn-outline-warning btn-sm" onClick={() => handlePlayVideo(lecture.videoUrl)}>
                                                Watch
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


            <footer className="footer">
                <Footer />
            </footer>
        </>
    );
};

export default EnrolledCoursePage;
