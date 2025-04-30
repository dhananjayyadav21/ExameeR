import React, { useContext, useEffect } from "react";
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

  const handleShortByChange = (sortBy) => {
    searchParams.set('sortBy', sortBy);
    navigate(`?${searchParams.toString()}`);
  }


  return (
    <>

      <div className='Course-header'>
        <div className='container-lg p-3'>
          <p className='my-3'> Your Cources   <span><i className="fa-solid fa-laptop-code"></i> Enroll Courses</span></p>
          <h5 className='my-3'>Discover Your Courses online</h5>
          <p>Explore Web Development courses that cover skills in HTML, CSS, JavaScript, and responsive design. Build expertise for careers in front-end development, full-stack development, and web design.</p>
        </div>
      </div>

      <div className="container-md ">
        <div className="row g-4">
          {/*=========================================== left container ===========================================*/}
          {/* <div className="col-12 col-md-2 sidebar-CoursesSection">
            <div className='px-2 my-4 rounded-3'>
              <h5>Filter Courses</h5>
              <div className='row g-2 px-2 rounded-3' >
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="" id="FreeCourses" />
                  <label className="form-check-label" htmlFor="FreeCourses">
                    Free Courses
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="" id="PaidCourses" />
                  <label className="form-check-label" htmlFor="PaidCourses">
                    Paid Courses
                  </label>
                </div>
              </div>
            </div>
          </div> */}

          {/*=========================================== right container ===========================================*/}
          <div className="col-12 col-md-12 main-CoursesSection">
            <div className="px-2 py-4">
              {/*========= Cource Section =============*/}
              <div className="my-md-4 d-sm-flex justify-content-between">
                <div className='my-4 my-sm-0'><h5>Explore the Web Development Courses</h5> </div>
                <div className="col-3 col-sm-2 text-center">
                  <a className="nav-text nav-link p-1 border border-dark border-1 rounded-2 " href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Sort By <i className="fa-solid fa-sort"></i>
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><button className="dropdown-item" onClick={() => { handleShortByChange('latest') }}>Latest-Notes</button></li>
                    <li><button className="dropdown-item" onClick={() => { handleShortByChange('oldest') }}>Oldest-Notes</button></li>
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <div className="row g-4">
                  {Course.length === 0 && <h5 className="d-flex justify-content-center text-center my-5">No Data Found! <br /> Plese Check internet connection</h5>}
                  {Course?.map((Course, index) => <CourceIteam key={index} Course={Course} />)}
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

export default Cource
