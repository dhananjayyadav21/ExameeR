import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NotesIteam from "./NotesItem.jsx"
import Footer from "./Footer.jsx";
import ContentContext from '../context/ContentContext'
import * as GlobalUrls from "../GlobalURL"


const Notes = ({setProgress}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const context = useContext(ContentContext);
  const { Notes, getNote } = context;

  const category = searchParams.get('category') || 'sciTechnology';
  const sortBy = searchParams.get('sortBy') || 'latest';
  useEffect(() => {
    setProgress(0);
    if (localStorage.getItem('token')) {
      getNote(`${GlobalUrls.GETNOTE_URL}?category=${category}&sortBy=${sortBy}`);
    }
    setProgress(100);
    // eslint-disable-next-line
  }, [category, sortBy]);

  const handleShortByChange = (sortBy) => {
    searchParams.set('sortBy', sortBy);
    navigate(`?${searchParams.toString()}`);
  }

  return (
    <>
      <div className="container-lg" style={{minHeight:"50vh"}}>
        <div className="notes-heroSection card container-lg mt-4 shadow-sm">
          <div className="text-center py-4">
            <h2 className="card-title">Explore & Discover<span className="notes-span-section"> Your Notes</span></h2>
            <p className="card-text">
              View and download instructor-provided notes,
              Upload personal notes for collaborative sharing.
              Sort and search through notes for quick access.
              Sync notes with specific courses for a seamless learning experience.
            </p>
          </div>
        </div>

        <div className="container-lg mt-5 d-flex justify-content-end">
          <div className="col-4 col-sm-3 col-md-2 col-lg-1 text-center">
            <a className="nav-text nav-link p-1 border border-dark border-1 rounded-2 " href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Sort By <i className="fa-solid fa-sort"></i>
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><button className="dropdown-item" onClick={() => { handleShortByChange('latest') }}>Latest-Notes</button></li>
              <li><button className="dropdown-item" onClick={() => { handleShortByChange('oldest') }}>Oldest-Notes</button></li>
            </ul>
          </div>
        </div>

        
        <div className="container-lg mt-4 mb-5">
          <div className="row g-4">
            {Notes.length === 0 && <h5 className="d-flex justify-content-center text-muted text-center my-5">No Data Found! <br/> Plese Check internet connection</h5>}
            {Notes?.map((note, index) => <NotesIteam key={index} Notes={note} />)}
          </div>
        </div>
      </div>

      {/* ====================================== footer ================================================================= */}
      <footer className="footer bottom-0">
        <Footer />
      </footer>

    </>
  );
};

export default Notes;
