import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NotesIteam from "./NotesItem.jsx"
import Footer from "./Footer.jsx";
import ContentContext from '../context/ContentContext'
import * as GlobalUrls from "../GlobalURL"


const Notes = ({ setProgress }) => {
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

  //-- handel sort
  const handleShortByChange = (sortBy) => {
    searchParams.set('sortBy', sortBy);
    navigate(`?${searchParams.toString()}`);
  }

  //-- handle paging nation 
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 10;
  // Calculate total pages
  const totalPages = Math.ceil(Notes.length / notesPerPage);
  // Slice notes for current page
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = Notes.slice(indexOfFirstNote, indexOfLastNote);

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <>
      <div className="container-lg"  style={{minHeight:"70vh"}}>
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
            {Notes.length === 0 &&
              <div className="text-center">
                <h6 className="d-flex justify-content-center text-muted text-center my-4">No Data Found! Wait or refresh page</h6>
                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
              </div>
            }
            {currentNotes?.map((note) => <NotesIteam key={note._id} notes={note} />)}
          </div>
        </div>



        {/* Pagination controls */}
        {currentNotes.length !== 0 && (
          <div className="pagination my-4 d-flex justify-content-center gap-2">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="btn btn-outline-dark btn-sm">
              Previous
            </button>

            {currentPage > 2 && (
              <>
                <button onClick={() => setCurrentPage(1)} className="btn btn-outline-dark btn-sm">
                  1
                </button>
                {currentPage > 3 && <span className="btn btn-sm disabled">...</span>}
              </>
            )}

            {getPageNumbers().map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`btn btn-sm ${currentPage === page ? 'btn-dark' : 'btn-outline-dark'}`} >
                {page}
              </button>
            ))}

            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <span className="btn btn-sm disabled">...</span>}
                <button onClick={() => setCurrentPage(totalPages)} className="btn btn-outline-dark btn-sm">
                  {totalPages}
                </button>
              </>
            )}

            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
              className="btn btn-outline-dark btn-sm">
              Next
            </button>
          </div>
        )}
      </div>

      {/* ====================================== footer ================================================================= */}
      <footer className="footer">
        <Footer />
      </footer>

    </>
  );
};

export default Notes;
