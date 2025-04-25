import React, { useContext, useEffect } from 'react';
import NotesIteam from "./NotesItem.jsx"
import VideoIteam from "./VideoItem.jsx"
import PyqIteam from "./QPaperItem.jsx"
import Footer from './Footer';
import ContentContext from '../context/ContentContext'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBook,
    faFileAlt,
    faPlayCircle,
    faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";

const MyLearning = ({setProgress}) => {
    const context = useContext(ContentContext);
    const { getDataFromMyLearning, MyLearningNotes, MyLearningVideo, MyLearningPYQ } = context;

    useEffect(() => {
        setProgress(0);
        if (localStorage.getItem('token')) {
            getDataFromMyLearning();
        }
        setProgress(100);
        // eslint-disable-next-line
    }, []);
    return (
        <>
            <div className="container-lg">
                <div className="mylearning-heroSection card container-lg mt-4 shadow-sm">
                    <div className="text-center py-4">
                        <h2 className="card-title">Explore & Discover<span className="mylearning-span-section"> Your Learning </span></h2>
                        <p className="card-text">
                            View and download instructor-provided notes, Cource, Video Lectures, Previous Year Question Paper,
                            Sort and search through notes for quick access.
                        </p>
                    </div>
                </div>

                {/* ==================================================================================================== */}
                <div className='my-5'>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">


                        <div className="col">
                            <div className="card border shadow-sm h-100 rounded-3">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="small text-secondary">Total Notes</p>
                                        <h3 className="fw-bold text-dark">{MyLearningNotes?.length}</h3>
                                    </div>
                                    <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center p-3">
                                        <FontAwesomeIcon
                                            icon={faFileAlt}
                                            className="text-success fs-4"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="card border shadow-sm h-100 rounded-3">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="small text-secondary">Video Lectures</p>
                                        <h3 className="fw-bold text-dark">{MyLearningVideo?.length}</h3>
                                    </div>
                                    <div className="rounded-circle bg-purple bg-opacity-10 d-flex align-items-center justify-content-center p-3">
                                        <FontAwesomeIcon
                                            icon={faPlayCircle}
                                            className="text-purple fs-4"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="card border shadow-sm h-100 rounded-3">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="small text-secondary">Previous Questions</p>
                                        <h3 className="fw-bold text-dark">{MyLearningPYQ?.length}</h3>
                                    </div>
                                    <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center p-3">
                                        <FontAwesomeIcon
                                            icon={faQuestionCircle}
                                            className="text-warning fs-4"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card h-100 border rounded-3">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="small text-secondary">Total Courses</p>
                                        <h3 className="fw-bold text-dark">0</h3>
                                    </div>
                                    <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center p-3">
                                        <FontAwesomeIcon icon={faBook} className="text-primary fs-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* ================================================================================================== */}
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
                            {MyLearningNotes?.map((e, index) => <NotesIteam key={index} Notes={e} />)}
                        </div>
                    </div>
                </div>


                {/* <div className='my-5'>
                    <div className="container-lg d-flex justify-content-start">
                        <div className="container-lg mt-4 shadow-sm">
                            <div className="text-start mylearning-section-heading">
                                <h5 className="card-title mb-0 p-2">Explore & Learn<span className="mylearning-span-section"> Your Cource</span></h5>
                            </div>
                        </div>
                    </div>

                    <div className="container-lg mt-2 mt-md-4">
                        <div className="row g-4">
                            {Aarr.map((e, index) => <CourceIteam key={index} />)}
                        </div>
                    </div>
                </div> */}


            {MyLearningVideo && MyLearningVideo.length > 0 &&( 
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
                            {MyLearningVideo?.map((e, index) => <VideoIteam key={index} Video={e} />)}
                        </div>
                    </div>
                </div>)}

                {MyLearningPYQ && MyLearningPYQ.length > 0 &&(
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
                                {MyLearningPYQ?.map((e, index) => <PyqIteam key={index} PYQ={e} />)}
                            </div>
                        </div>
                    </div>)}
            </div>

            {/* ====================================== footer ======================================================== */}
            <footer className="footer bottom-0">
                <Footer />
            </footer>
        </>
    );
};

export default MyLearning;
