import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { toast } from 'react-toastify';
// import ContentContext from '../context/ContentContext';

const EnrolledCoursePage = ({ setProgress }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { course } = location.state || {};
    // const context = useContext(ContentContext);
    // const { getEnrolledCourseDetails } = context;

    // eslint-disable-next-line
    const [courseData, setCourseData] = useState(course);
    const [videoUrl, setVideoUrl] = useState('');
    const [startLecture, setStartLecture] = useState('');


    // handle full screen and exit
    const videoContainerRef = useRef();

    const handleFullscreen = () => {
        if (videoContainerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoContainerRef.current.requestFullscreen();
            }
        }
    };

    // extract id from videourl
    const extractId = (VideoUrl) => {
        const match = VideoUrl.match(/src="([^"]+)"/);
        const srcUrl = match ? match[1] : videoUrl;

        const iframeVideoId = srcUrl.split('/embed/')[1];

        return iframeVideoId;
    };

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

    // handle video play 
    const handlePlayVideo = (url, lecture) => {
        setVideoUrl(url);
        setStartLecture(lecture)
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
            <div className="bg-body-tertiary p-md-3" style={{ minHeight: "70vh" }}>
                <div className="px-3 py-4 p-md-5 shadow-sm rounded-2 bg-white text-black position-relative">
                    <div className="pb-3">
                        <h3 className="rubik-font fw-bold mb-3 text-primary">{courseData?.title}</h3>
                        <p className="text-secondary fs-6">{courseData?.description}</p>
                    </div>

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 border-top pt-3">
                        <div>
                            <span className="fw-semibold me-2 text-muted">Mentor:</span>
                            <span className="fw-bold text-dark">{courseData?.mentor}</span>
                        </div>
                        <div>
                            <span className="fw-semibold me-2 text-muted">Start Date:</span>
                            <span className="fw-bold text-dark">{courseData?.startDate?.slice(0, 10) || "N/A"}</span>
                        </div>
                    </div>
                </div>


                <div className="container py-5">
                    <div className="row">
                        {/* Left Side */}
                        <div className="col-md-5">
                            {!videoUrl ? (
                                <div className="card shadow-sm bg-white">
                                    <div className="card-body">
                                        <img
                                            src={`https://lh3.googleusercontent.com/d/${courseData?.courseImage}` || "/assets/img/cource.jpg"}
                                            alt={courseData?.title}
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
                                </div>) :
                                (
                                    <div className="card shadow-sm video-item my-3 p-2 rounded-3" style={{ minHeight: "400px" }}>
                                        <div className='position-relative video-container' ref={videoContainerRef}>
                                            <div className="enrolled-course-player-header bg-white d-flex justify-content-start align-items-center p-1">
                                                <div className="video-zoom bg-light cursor-pointer d-flex justify-content-center align-items-center" onClick={handleFullscreen}>
                                                    <img src="assets/img/zoom-in.png" alt="zoom" height={30} width={30} />
                                                </div>
                                                <h6 className="card-title px-2">{(startLecture).slice(0, 50)}..</h6>
                                            </div>
                                            {/* <div className="video-zoom-mobile bg-danger d-none">
                                                <img src="assets/img/zoom-in.png" alt="zoom" height={20} width={20} />
                                            </div> */}
                                            <iframe
                                                className='enrolled-course-frame'
                                                src={`https://www.youtube.com/embed/${extractId(videoUrl)}`}
                                                title="YouTube video player"
                                                FrameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            ></iframe>
                                            <div className="video-player-footer bg-white d-flex justify-content-start">
                                                <h6 className="fw-bold px-2">Benefits:</h6>
                                            </div>
                                        </div>

                                        <div className="border-top p-2">

                                            <ul className="ps-3">
                                                {courseData?.benefits?.split(',').map((benefit, index) => (
                                                    <li className='text-muted' key={index}>
                                                        {benefit.trim().charAt(0).toUpperCase() + benefit.trim().slice(1) + "."}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                        </div>


                        {/* Right Side */}
                        <div className="col-md-7 my-3 my-md-0">
                            <div className="bg-white p-4 shadow-sm rounded-3 mb-4">
                                <h4 className="rubik-font mb-3">Your Learning Progress</h4>
                                <p>Progress: {courseData?.progress || 0}%</p>
                                {courseData?.certificateIssued && (
                                    <p className="text-success">🎉 Certificate Issued</p>
                                )}
                            </div>

                            <div className="bg-white p-2 p-md-4 shadow-sm rounded-3 mb-4">
                                <h4 className="rubik-font mb-3 p-2">Lectures</h4>
                                <ul className="list-group">
                                    {courseData?.lectures?.map((lecture, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>{lecture?.title}</span>
                                            <button className="btn btn-outline-warning btn-sm" onClick={() => handlePlayVideo(lecture?.videoUrl, lecture?.title)}>
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
