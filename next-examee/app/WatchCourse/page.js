"use client";
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import VideoTemplate from '../../components/VideoTemplate';
import ContentContext from '../../context/ContentContext';
import StudentLayout from '../../components/Home/StudentLayout';

export default function WatchCoursePage({ setProgress = () => { } }) {
    const router = useRouter();
    const { selectedCourse: course } = useContext(ContentContext);
    const [courseData, setCourseData] = useState(course);
    const [videoUrl, setVideoUrl] = useState('');
    const [activeLecIdx, setActiveLecIdx] = useState(null);
    const [startLecture, setStartLecture] = useState('');
    const videoContainerRef = useRef();

    const handleFullscreen = () => {
        if (videoContainerRef.current) {
            if (document.fullscreenElement) document.exitFullscreen();
            else videoContainerRef.current.requestFullscreen();
        }
    };

    useEffect(() => {
        setProgress(100);
        if (!course?._id) { toast.error("Invalid course."); router.push('/myLearning'); }
    }, [course]);

    const handlePlayVideo = (url, lecture, idx) => {
        setVideoUrl(url);
        setStartLecture(lecture);
        setActiveLecIdx(idx);
    };

    if (!courseData) return (
        <div className="d-flex align-items-center justify-content-center gap-3 min-vh-100" style={{ background: '#f8fafc' }}>
            <div className="spinner-border text-success"></div>
            <span className="fw-semibold text-muted">Loading course…</span>
        </div>
    );

    const lectureCnt = courseData?.lectures?.length || 0;
    const progress = courseData?.progress || 0;
    const completedCount = Math.round((progress / 100) * lectureCnt);

    return (
        <StudentLayout title="Watch Course">
            <div className="container-fluid px-0">
                {/* Slim Header Info */}
                <div className="mb-4">
                    <h2 className="fw-black mb-1" style={{ fontSize: '1.8rem' }}>{courseData?.title}</h2>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                        <span className="text-muted small">
                            <i className="fa-solid fa-person-chalkboard me-1 text-success"></i>
                            {courseData?.mentor}
                        </span>
                        <span className="text-muted small">
                            <i className="fa-solid fa-video me-1 text-success"></i>
                            {lectureCnt} lectures
                        </span>
                        {courseData?.certificateIssued && (
                            <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-20 px-3 py-1 fw-bold" style={{ fontSize: '0.7rem' }}>
                                <i className="fa-solid fa-certificate me-1"></i> Certificate Issued
                            </span>
                        )}
                    </div>
                </div>

                <div className="row g-4">
                    {/* Video player — left/top */}
                    <div className="col-lg-8">
                        {videoUrl ? (
                            <VideoTemplate
                                videoUrl={videoUrl}
                                footer={courseData?.benefits}
                                header={startLecture}
                                videoContainerRef={videoContainerRef}
                                handleFullscreen={handleFullscreen}
                            />
                        ) : (
                            /* Placeholder before selecting a lecture */
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                                <div className="position-relative">
                                    <img
                                        src={courseData?.courseImage ? `https://lh3.googleusercontent.com/d/${courseData?.courseImage}` : '/assets/img/cource.jpg'}
                                        alt={courseData?.title}
                                        style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                                    />
                                    <div className="position-absolute inset-0 d-flex flex-column align-items-center justify-content-center gap-3 bg-dark bg-opacity-50 text-white">
                                        <i className="fa-solid fa-circle-play fs-1 opacity-75"></i>
                                        <p className="fw-bold mb-0">Select a lecture to start watching</p>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h6 className="fw-bold mb-3 text-uppercase ls-wide small">Course Description</h6>
                                    <p className="text-muted small">{courseData?.description}</p>
                                    <h6 className="fw-bold mt-4 mb-3 text-uppercase ls-wide small">What you'll learn</h6>
                                    <ul className="ps-3 mb-0 small text-muted">
                                        {courseData?.benefits?.split(',').map((b, i) => (
                                            <li key={i} className="mb-2">{b.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Progress card */}
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h6 className="fw-bold mb-0">Learning Progress</h6>
                                <span className="fw-bold text-success">{progress}%</span>
                            </div>
                            <div className="progress rounded-pill mb-2" style={{ height: '8px' }}>
                                <div className="progress-bar bg-success rounded-pill" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="smaller text-muted mb-0">{completedCount} of {lectureCnt} lectures completed</p>
                        </div>
                    </div>

                    {/* Lectures list — right */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="px-4 py-3 bg-light border-bottom">
                                <h6 className="fw-bold mb-0">Lectures List</h6>
                                <p className="smaller text-muted mb-0">{lectureCnt} Video Lessons</p>
                            </div>

                            <div className="lectures-container custom-scrollbar" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                {courseData?.lectures?.map((lecture, index) => (
                                    <div
                                        key={index}
                                        className={`px-4 py-3 d-flex align-items-center gap-3 transition-all cursor-pointer ${activeLecIdx === index ? 'bg-success bg-opacity-5 border-start border-4 border-success' : 'border-bottom border-light'}`}
                                        onClick={() => handlePlayVideo(lecture?.videoUrl, lecture?.title, index)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${activeLecIdx === index ? 'bg-success text-white' : 'bg-light text-muted'}`}
                                            style={{ width: '32px', height: '32px', fontSize: '0.8rem', fontWeight: 700 }}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className={`mb-0 text-truncate small fw-bold ${activeLecIdx === index ? 'text-success' : 'text-dark'}`}>
                                                {lecture?.title}
                                            </p>
                                        </div>
                                        <i className={`fa-solid fa-play smaller ${activeLecIdx === index ? 'text-success' : 'text-muted opacity-50'}`}></i>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </StudentLayout>
    );
}

