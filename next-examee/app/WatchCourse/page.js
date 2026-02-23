"use client";
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';
import VideoTemplate from '../../components/VideoTemplate';
import ContentContext from '../../context/ContentContext';

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
        <div className="d-flex align-items-center justify-content-center gap-3" style={{ height: '90vh', background: '#f8fafc' }}>
            <div className="spinner-border" style={{ color: '#04bd20' }}></div>
            <span className="fw-semibold text-muted">Loading course…</span>
        </div>
    );

    const lectureCnt = courseData?.lectures?.length || 0;
    const progress = courseData?.progress || 0;
    const completedCount = Math.round((progress / 100) * lectureCnt);

    return (
        <main className="min-vh-100" style={{ background: '#f8fafc' }}>
            {/* Slim breadcrumb */}
            <div className="bg-white border-bottom py-3">
                <div className="container-fluid px-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0" style={{ fontSize: '0.78rem' }}>
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Home</a></li>
                            <li className="breadcrumb-item"><a href="/myLearning" className="text-decoration-none text-muted">My Learning</a></li>
                            <li className="breadcrumb-item active fw-medium" style={{ color: '#04bd20' }}>Watch Course</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Course header */}
            <div style={{ background: 'linear-gradient(135deg,#0f172a,#064e3b)' }} className="py-4">
                <div className="container-fluid px-4">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
                        <div>
                            <h1 className="text-white mb-1" style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                                {courseData?.title}
                            </h1>
                            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem' }}>
                                {courseData?.description}
                            </p>
                            <div className="d-flex align-items-center gap-3 mt-2 flex-wrap">
                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
                                    <i className="fa-solid fa-person-chalkboard me-1" style={{ color: '#04bd20' }}></i>
                                    {courseData?.mentor}
                                </span>
                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
                                    <i className="fa-solid fa-video me-1" style={{ color: '#04bd20' }}></i>
                                    {lectureCnt} lectures
                                </span>
                            </div>
                        </div>
                        {courseData?.certificateIssued && (
                            <span className="badge rounded-pill px-3 py-2 flex-shrink-0"
                                style={{ background: 'rgba(4,189,32,0.15)', color: '#4dfa6a', border: '1px solid rgba(4,189,32,0.3)', fontSize: '0.8rem' }}>
                                <i className="fa-solid fa-certificate me-1"></i> Certificate Issued
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="container-fluid px-3 px-md-4 py-4">
                <div className="row g-4">
                    {/* Video player — left/top */}
                    <div className="col-lg-7 col-xl-8">
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
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                                <div className="position-relative">
                                    <img
                                        src={courseData?.courseImage ? `https://lh3.googleusercontent.com/d/${courseData?.courseImage}` : '/assets/img/cource.jpg'}
                                        alt={courseData?.title}
                                        style={{ width: '100%', height: '280px', objectFit: 'cover' }}
                                    />
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                        <i className="fa-solid fa-circle-play" style={{ fontSize: '3rem', color: 'white', opacity: 0.85 }}></i>
                                        <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>
                                            Select a lecture from the list to start watching
                                        </p>
                                    </div>
                                </div>
                                {/* Benefits */}
                                <div className="p-4">
                                    <p className="fw-bold mb-2" style={{ fontSize: '0.82rem', color: '#374151', letterSpacing: '0.03em' }}>COURSE BENEFITS</p>
                                    <ul className="ps-3 mb-0" style={{ fontSize: '0.875rem' }}>
                                        {courseData?.benefits?.split(',').map((b, i) => (
                                            <li key={i} className="text-muted mb-1">
                                                {b.trim().charAt(0).toUpperCase() + b.trim().slice(1)}.
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Progress card */}
                        <div className="card border-0 shadow-sm rounded-4 p-4 mt-3">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                                    <i className="fa-solid fa-chart-line me-2" style={{ color: '#04bd20' }}></i>
                                    Your Progress
                                </h2>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#04bd20' }}>{progress}%</span>
                            </div>
                            <div className="rounded-pill overflow-hidden" style={{ height: '8px', background: '#e5e7eb' }}>
                                <div className="rounded-pill" style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#04bd20,#03a61c)', transition: 'width 0.5s' }}></div>
                            </div>
                            <p className="mb-0 mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
                                {completedCount} of {lectureCnt} lectures completed
                            </p>
                        </div>
                    </div>

                    {/* Lectures list — right */}
                    <div className="col-lg-5 col-xl-4">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="px-4 py-3 border-bottom" style={{ background: '#fafafa' }}>
                                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                                    <i className="fa-solid fa-list me-2" style={{ color: '#04bd20' }}></i>
                                    Course Lectures
                                </h2>
                                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>{lectureCnt} lectures in this course</p>
                            </div>

                            <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                                {courseData?.lectures?.map((lecture, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-3 d-flex align-items-center gap-3 lecture-row"
                                        style={{
                                            borderBottom: '1px solid #f1f1f1',
                                            cursor: 'pointer',
                                            background: activeLecIdx === index ? 'rgba(4,189,32,0.05)' : 'white',
                                            borderLeft: activeLecIdx === index ? '3px solid #04bd20' : '3px solid transparent',
                                            transition: 'all 0.15s'
                                        }}
                                        onClick={() => handlePlayVideo(lecture?.videoUrl, lecture?.title, index)}
                                    >
                                        <div className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: '34px', height: '34px', background: activeLecIdx === index ? 'rgba(4,189,32,0.15)' : 'rgba(245,158,11,0.12)', flexShrink: 0 }}>
                                            {activeLecIdx === index
                                                ? <i className="fa-solid fa-circle-play" style={{ color: '#04bd20', fontSize: '1rem' }}></i>
                                                : <span style={{ fontWeight: 700, fontSize: '0.75rem', color: '#f59e0b' }}>{index + 1}</span>}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p className="mb-0 text-truncate" style={{ fontSize: '0.85rem', fontWeight: activeLecIdx === index ? 600 : 500, color: activeLecIdx === index ? '#039419' : '#374151' }}>
                                                {lecture?.title}
                                            </p>
                                        </div>
                                        <i className="fa-solid fa-play flex-shrink-0" style={{ fontSize: '0.65rem', color: activeLecIdx === index ? '#04bd20' : '#d1d5db' }}></i>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <style jsx>{`
                .lecture-row:hover { background: #f8fef8 !important; }
            `}</style>
        </main>
    );
}
