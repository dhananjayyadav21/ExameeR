import React, { useContext, useEffect } from "react";
import VideoItem from "./VideoItem";
import Footer from './Footer';
import ContentContext from '../context/ContentContext';
import * as GlobalUrls from "../GlobalURL";
import { useNavigate, useSearchParams } from "react-router-dom";

const Video = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const context = useContext(ContentContext);
    const { Video, getVideo } = context;

    const category = searchParams.get('category') || 'sciTechnology';
    const sortBy = searchParams.get('sortBy') || 'latest';
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getVideo(`${GlobalUrls.GETVideo_URL}?category=${category}&sortBy=${sortBy}`);
        }
    // eslint-disable-next-line
    }, [category,sortBy]);

    const handleShortByChange = (sortBy) => {
        searchParams.set('sortBy', sortBy);
        navigate(`?${searchParams.toString()}`);
    }

    return (
        <>
            <div className="container-fluid">
                <div className="row g-4">
                    {/*=========================================== left container ===========================================*/}
                    <div className="col-12 col-md-3 sidebar-VideoSection">
                        <div className='p-4 my-3 rounded-3' style={{ backgroundColor: "white" }}>
                            <h4 className='text-center'>SELECT VIDEO LECTURES</h4>
                            <div className='row g-2 p-2 mt-3 rounded-3' >
                                <button className="btn btn-light">Free Lectures</button>
                                <button className='btn btn-light'> Enrolled Lectures</button>
                            </div>
                        </div>
                    </div>

                    {/*=========================================== right container ===========================================*/}
                    <div className="col-12 col-md-9 main-VideoSection scrollable">
                    <div className="video-heroSection card container-lg mt-4 shadow-sm">
                       <div className="text-center py-3">
                         <h4 className="card-title">Explore Your <span className="notes-span-section">Video Lectures</span></h4>
                         <p>"Learn Anytime, Anywhere with Expert-Led Video Lectures" || "Your Digital Classroom, One Video at a Time"</p>
                       </div>
                     </div>
                        <div className="p-4">
                            {/*========= video Section =============*/}
                            <div>
                                <div className="mt-2 d-flex justify-content-end">
                                    <div className="col-4 col-sm-3 col-md-4 col-lg-2 text-center">
                                        <a className="nav-text nav-link p-1 border border-dark border-1 rounded-2 " href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Sort By <i className="fa-solid fa-sort"></i>
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><button className="dropdown-item" onClick={() => { handleShortByChange('latest') }}>Latest-Notes</button></li>
                                            <li><button className="dropdown-item" onClick={() => { handleShortByChange('oldest') }}>Oldest-Notes</button></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <div className="row g-4">
                                        {Video.map((video, index) => <VideoItem key={index} Video={video} />)}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ====================================== footer ================================================================= */}
            <footer className="footer bottom-0">
                <Footer />
            </footer>
        </>
    )
}

export default Video
