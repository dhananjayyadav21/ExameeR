import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CourceIteam from './CourceIteam'
import Footer from './Footer'
import ContentContext from '../context/ContentContext';
import * as GlobalUrls from "../GlobalURL";


const Cource = ({ setProgress }) => {

  useEffect(() => {
    setProgress(0);
    setProgress(100);
    // eslint-disable-next-line
  }, []);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const context = useContext(ContentContext);
  const { Course, getCourse } = context;

  const category = searchParams.get('category') || 'sciTechnology';
  const sortBy = searchParams.get('sortBy') || 'latest';

  useEffect(() => {
    setProgress(0);
    if (localStorage.getItem('token')) {
      getCourse(`${GlobalUrls.GETCourse_URL}?category=${category}&sortBy=${sortBy}`);
    }
    setProgress(100);
    // eslint-disable-next-line
  }, [category, sortBy]);

  //-- handle sorting
  const handleShortByChange = (sortBy) => {
    searchParams.set('sortBy', sortBy);
    navigate(`?${searchParams.toString()}`);
  }

  //-- handle paging nation 
  const [currentPage, setCurrentPage] = useState(1);
  const CoursePerPage = 4;
  // Calculate total pages
  const totalPages = Math.ceil(Course.length / CoursePerPage);
  // Slice Course for current page
  const indexOfLastCourse = currentPage * CoursePerPage;
  const indexOfFirstCourse = indexOfLastCourse - CoursePerPage;
  const currentCourse = Course.slice(indexOfFirstCourse, indexOfLastCourse);

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

      <div className='Course-header'>
        <div className='container-lg p-3'>
          <p className='my-3'> Your Cources   <span><i className="fa-solid fa-laptop-code"></i> Enroll Courses</span></p>
          <h5 className='my-3'>Discover Your Courses online</h5>
          <p>Explore a world of knowledge, curated by passionate mentors.
            From foundational skills to advanced mastery, every course is built to empower you.
            Learn at your pace, on your terms.
            Your journey to growth starts here.</p>
        </div>
      </div>

      <div className="container-lg my-3" style={{minHeight:"70vh"}}>
        <div className="row g-4">
          {/*=========================================== right container ===========================================*/}
          <div className="col-12 col-md-12 main-CoursesSection">
            <div className="px-2 pb-4 pt-md-4">
              {/*========= Cource Section =============*/}
              <div className="d-sm-flex justify-content-between">
                <div className='my-4 my-sm-0'><h5>{`<> Find courses that fit your pace and passion`}</h5> </div>
                <div className="col-4 col-md-2 col-lg-1 text-center">
                  <a className="nav-text nav-link p-1 border border-dark border-1 rounded-2 " href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Sort By <i className="fa-solid fa-sort"></i>
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><button className="dropdown-item" onClick={() => { handleShortByChange('latest') }}>Latest-Course</button></li>
                    <li><button className="dropdown-item" onClick={() => { handleShortByChange('oldest') }}>Oldest-Course</button></li>
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <div className="row g-4">
                  {Course.length === 0 &&
                    <div className="text-center">
                      <h6 className="d-flex justify-content-center text-muted text-center my-4">No Data Found! Wait or refresh page</h6>
                      <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                      <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                      <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                      <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                    </div>
                  }
                  {currentCourse?.map((Course, index) => <CourceIteam key={index} Course={Course} />)}
                </div>
              </div>


              {/* Pagination controls */}
              {currentCourse.length !== 0 && (
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
          </div>
        </div>
      </div>

      {/* ====================================== footer ================================================================= */}
      <footer className="footer">
        <Footer />
      </footer>

    </>
  )
}

export default Cource
