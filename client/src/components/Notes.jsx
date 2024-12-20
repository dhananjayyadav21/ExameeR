import React from "react";
import NotesIteam from "./NotesItem.jsx"
import Footer from "./Footer.jsx";

const Notes = () => {

  let Aarr = [ {},{},{},{},{},{},]

  console.log(Aarr);

  return (
    <>
      <div className="container">
        <div className="notes-heroSection card container mt-4 shadow-sm">
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

        <div className="container mt-5 d-flex justify-content-end">
          <div className="col-4 col-sm-3 col-md-2 col-lg-1 text-center">
              <a className="nav-text nav-link p-1 border border-dark border-1 rounded-2 " href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Sort By <i className="fa-solid fa-sort"></i>
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="/">Sem-I</a></li>
                  <li><a className="dropdown-item" href="/">Sem-II</a></li>
                  <li><a className="dropdown-item" href="/">Sem-III</a></li>
                  <li><a className="dropdown-item" href="/">Sem-IV</a></li>
                  <li><a className="dropdown-item" href="/">Sem-V</a></li>
                  <li><a className="dropdown-item" href="/">Sem-VI</a></li>
                  <li><a className="dropdown-item" href="/">Sem-VII</a></li>
                  <li><a className="dropdown-item" href="/">Sem-VIII</a></li>
              </ul>
          </div>
        </div> 

        <div className="container mt-2 mb-5">
          <div className="row g-4">
            {Aarr.map((e,index)=> <NotesIteam key={index}/>)}
          </div>
        </div>
      </div>   

      {/* ====================================== footer ================================================================= */}
      <footer className="footer text-center py-4">
        <Footer/>
      </footer>

    </>
  );
};

export default Notes;
