import React, { useContext, useEffect } from "react";
import NotesIteam from "./NotesItem.jsx"
import Footer from "./Footer.jsx";
import ContentContext from '../context/ContentContext'
import * as GlobalUrls from "../GlobalURL"

const Notes = () => {
  const context = useContext(ContentContext);
  const { Notes, getNote } = context;

  useEffect( () => {
    if (localStorage.getItem('token')) {
      getNote();
    }
    // eslint-disable-next-line
  },[]);

  const handleShortByChange = (sortBy)=>{
    getNote(`${GlobalUrls.GETNOTE_URL}?sortBy=${sortBy}`);
  }

  return (
    <>
      <div className="container-lg">
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
                  <li><button className="dropdown-item" onClick={()=>{ handleShortByChange('latest')}}>Latest-Notes</button></li>
                  <li><button className="dropdown-item" onClick={()=>{ handleShortByChange('oldest')}}>Oldest-Notes</button></li>
              </ul>
          </div>
        </div> 

        <div className="container-lg mt-2 mb-5">
          <div className="row g-4">
            {Notes.map((note,index)=> <NotesIteam key={index} Notes={note}/>)}
          </div>
        </div>
      </div>   

      {/* ====================================== footer ================================================================= */}
      <footer className="footer bottom-0">
         <Footer/>
      </footer>

    </>
  );
};

export default Notes;
