"use client";
import React, { useContext, useEffect } from 'react';
import NotesItem from "../../components/NotesItem"
import VideoItem from "../../components/VideoItem"
import QPaperItem from "../../components/QPaperItem"
import CourceIteam from "../../components/Home/CourceIteam"
import Footer from '../../components/Footer';
import ContentContext from '../../context/ContentContext'

export default function MyLearningPage({ setProgress = () => { } }) {
    const context = useContext(ContentContext);
    const { getDataFromMyLearning, MyLearningNotes, MyLearningVideo, MyLearningPYQ, MyLearningCourse } = context;

    useEffect(() => {
        setProgress(0);
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
            getDataFromMyLearning();
        }
        setProgress(100);
    }, []);

    return (
        <main>
            <div className="container-lg" style={{ minHeight: "70vh" }}>
                <div className="mylearning-heroSection card container-lg mt-4 shadow-sm">
                    <div className="text-center py-4">
                        <h2 className="card-title">Explore & Discover<span className="mylearning-span-section"> Your Learning </span></h2>
                        <p className="card-text">
                            View and download instructor-provided notes, Cource, Video Lectures, Previous Year Question Paper,
                            Sort and search through notes for quick access.
                        </p>
                    </div>
                </div>

                <div className='my-5'>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
                        <div className="col">
                            <div className="card border shadow-sm h-100 rounded-3">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="small text-secondary m-0">Total Notes</p>
                                        <h3 className="fw-bold text-dark m-0">{MyLearningNotes?.length || 0}</h3>
                                    </div>
                                    <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center p-3">
                                        <i className="fa-solid fa-file-lines text-success fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="card border shadow-sm h-100 rounded-3">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="small text-secondary m-0">Video Lectures</p>
                                        <h3 className="fw-bold text-dark m-0">{MyLearningVideo?.length || 0}</h3>
                                    </div>
                                    <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center p-3">
                                        <i className="fa-solid fa-circle-play text-primary fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="card border shadow-sm h-100 rounded-3">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="small text-secondary m-0">Previous Questions</p>
                                        <h3 className="fw-bold text-dark m-0">{MyLearningPYQ?.length || 0}</h3>
                                    </div>
                                    <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center p-3">
                                        <i className="fa-solid fa-circle-question text-warning fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="card h-100 border rounded-3">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="small text-secondary m-0">Total Courses</p>
                                        <h3 className="fw-bold text-dark m-0">{MyLearningCourse?.length || 0}</h3>
                                    </div>
                                    <div className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center p-3">
                                        <i className="fa-solid fa-book text-info fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {MyLearningNotes && MyLearningNotes.length > 0 && (
                    <div className='my-5'>
                        <div className="container-lg d-flex justify-content-start">
                            <div className="container-lg mt-4 shadow-sm">
                                <div className="text-start mylearning-section-heading">
                                    <h5 className="card-title mb-0 p-2">Explore & Learn<span className="mylearning-span-section"> Your Notes</span></h5>
                                </div>
                            </div>
                        </div>

                        <div className="container-lg mt-2 mt-md-4">
                            <div className="row g-4">
                                {MyLearningNotes?.map((e) => <NotesItem key={e._id} notes={e} />)}
                            </div>
                        </div>
                    </div>)}


                {MyLearningVideo && MyLearningVideo.length > 0 && (
                    <div className='my-5'>
                        <div className="container-lg d-flex justify-content-start">
                            <div className="container-lg mt-4 shadow-sm">
                                <div className="text-start mylearning-section-heading">
                                    <h5 className="card-title mb-0 p-2">Explore & Learn<span className="mylearning-span-section"> Your Lectures</span></h5>
                                </div>
                            </div>
                        </div>

                        <div className="container-lg mt-2 mt-md-4">
                            <div className="row g-4">
                                {MyLearningVideo?.map((e) => <VideoItem key={e._id} video={e} />)}
                            </div>
                        </div>
                    </div>)}

                {MyLearningPYQ && MyLearningPYQ.length > 0 && (
                    <div className='my-5'>
                        <div className="container-lg d-flex justify-content-start">
                            <div className="container-lg mt-4 shadow-sm">
                                <div className="text-start mylearning-section-heading">
                                    <h5 className="card-title mb-0 p-2">Explore & Learn<span className="mylearning-span-section"> Your PYQ</span></h5>
                                </div>
                            </div>
                        </div>

                        <div className="container-lg mt-2 mt-md-4">
                            <div className="row g-4">
                                {MyLearningPYQ?.map((e) => <QPaperItem key={e._id} pyq={e} />)}
                            </div>
                        </div>
                    </div>)}


                {MyLearningCourse && MyLearningCourse.length > 0 && (
                    <div className='my-5'>
                        <div className="container-lg d-flex justify-content-start">
                            <div className="container-lg mt-4 shadow-sm">
                                <div className="text-start mylearning-section-heading">
                                    <h5 className="card-title mb-0 p-2">Explore & Learn<span className="mylearning-span-section"> Your Course</span></h5>
                                </div>
                            </div>
                        </div>

                        <div className="container-lg mt-2 mt-md-4">
                            <div className="row g-4">
                                {MyLearningCourse?.map((e) => (
                                    <div key={e._id} className="col-xl-3 col-lg-4 col-md-6">
                                        <CourceIteam Course={e} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <footer className="footer">
                <Footer />
            </footer>
        </main>
    );
}
