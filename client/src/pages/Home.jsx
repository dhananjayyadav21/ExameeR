import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CourceIteam from '../components/CourceIteam'
import Footer from '../components/Footer'
import Team from '../components/Team'
import Offers from '../components/Offers'
import { ReactTyped } from "react-typed";
import HowExameeWork from '../components/HowExameeWork'
import ContentContext from '../context/ContentContext';
import * as GlobalUrls from "../GlobalURL";
import { toast } from 'react-toastify'
const BASEURL = process.env.REACT_APP_API_KEY

const Home = ({ setProgress }) => {
  const context = useContext(ContentContext);
  const { getNote, searchContent, setSearchContentData, Course, getCourse } = context
  const navigate = useNavigate();

  //--get note--------
  useEffect(() => {
    fetch(`${BASEURL}ping`).catch(console.error);
    setProgress(0);
    getNote();
    getCourse();
    setProgress(100);
    // eslint-disable-next-line
  }, []);

  //--create states for search data--------------
  const [isFocused, setIsFocused] = useState(false);
  const [searchType, setSearchType] = useState('notes');
  const [query, setQuery] = useState('');


  //--handleSearch for search data--------------
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await searchContent(`${GlobalUrls.SEARCHCONTENT_URL}?search=${encodeURIComponent(query)}&type=${searchType}`);
      if (response.success === true) {
        setSearchContentData(response.results || []);
        navigate('/searchcontent');
      }
      else if (response.success === false) {
        toast.warning(response.message || "No matching content found !", {
          position: "top-right"
        });
      }
    } catch (err) {
      setSearchContentData([]);
      toast.error("Somthing went wrong.!", {
        position: "top-right"
      });
    }
  };

  let team = [
    {
      "name": "Dhananjay Yadav",
      "role": "RAD'27",
      "description": "Guides resource management, teaches workflow strategies, and mentor.",
      "profile":"/assets/img/dhananjay.jpg"
    },
    {
      "name": "Sanjay Yadav",
      "role": "Software Engineer",
      "description": "Teaches technical concepts, facilitates teamwork, and ensures project success."
    },
    {
      "name": "Neel Singh",
      "role": "Junior Developer",
      "description": "Teaches coding basics, fosters collaboration, and support."
    }
  ]

  return (
    <div>
      {/*===================================== home-main-section ===========================================*/}
      <section className='hero bg-light'>
        <section className='container-lg mx-md-3 my-md-5'>
          <section className='row rounded-4 p-md-4'>
            <div className='col-12 col-md-6 text-md-start px-lg-4 my-5'>
              <h1 className='fw-bold'>Discover Your <span className='green'>Notes & Cources</span></h1>
              <h3>Search Our <span className='green'>
                <ReactTyped strings={[
                  "Notes",
                  "Q-Paper",
                  "Lectures",
                  "Cources",]} typeSpeed={40} backSpeed={50} loop /></span>
              </h3>
              <p className='text-secondary'>We provide a comprehensive collection of notes, previous year question papers, and specialized courses to
                enhance your exam preparation. Our resources are designed to assist all college students in achieving
                academic success</p>

              <form onSubmit={handleSearch} className="hero-search d-flex flex-column align-items-center">
                <div className={`bg-white search w-100 rounded-5 d-flex align-items-center px-3 ${isFocused ? 'search-active' : ''}`} style={{ maxWidth: '800px' }}>
                  <input
                    type="search"
                    className="form-control rounded-5 border-0"
                    placeholder="Search anything..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                  <button type="submit" className="btn-purple rounded-5 py-2 px-4 hero-btn">
                    Search
                  </button>
                </div>
              </form>

              {/*----------------------------------------------------------------------------------*/}
              <div className='d-flex my-4 gap-2 justify-content-center justify-content-md-start'>
                {!localStorage.getItem("token") ?
                  <><Link className='nav-link' to="/auth"><button type="button" className="btn btn-green px-4  rounded-3">Login</button></Link>
                    <Link className='nav-link' to="/auth"><button type="button" className="btn btn-green px-4 rounded-3">Register</button></Link>
                  </> :
                  <> <div className='mt-3' style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className={`btn btn-sm shadow-sm ${searchType === 'notes' ? 'btn-dark' : 'btn-white'}`}
                      onClick={() => setSearchType('notes')}> Notes
                    </button>
                    <button
                      className={`btn btn-sm shadow-sm ${searchType === 'pyq' ? 'btn-dark' : 'btn-white'}`}
                      onClick={() => setSearchType('pyq')}>PYQ
                    </button>
                    <button
                      className={`btn btn-sm shadow-sm ${searchType === 'video' ? 'btn-dark' : 'btn-white'}`}
                      onClick={() => setSearchType('video')}> Video
                    </button>
                  </div> </>}
              </div>
            </div>

            <div className='col-12 col-md-6 rounded-4 mb-4'>
              <img className='front-img' src="/assets/img/Front.png" alt="Front Examee" />
            </div>
          </section>


          {/*============================= Our Provide Service Section =====================================*/}
          <section className='hero-showcase mt-5 text-secondary'>
            <div className='container-lg mb-4 mb-lg-0'>
              <div className='row g-3'>
                <div className='col-6 col-md-3'>
                  <div className=' shadow-sm border text-center p-3 rounded-3 bg-white h-100'>
                    <h3 className='m-0 p-0 fw-bolder fs-2 text-primary'>4+</h3>
                    <p className='m-0 p-0 fw-bold'>Development Notes</p>
                  </div>
                </div>
                <div className='col-6 col-md-3'>
                  <div className='shadow-sm border text-center p-3 rounded-3 bg-white h-100'>
                    <h3 className='m-0 p-0 fw-bolder fs-2 text-info'>3+</h3>
                    <p className='m-0 p-0 fw-bold'>Development Courses</p>
                  </div>
                </div>
                <div className='col-6 col-md-3'>
                  <div className='shadow-sm border text-center p-3 rounded-3 bg-white h-100'>
                    <h3 className='m-0 p-0 fw-bolder fs-2 text-warning'>150+</h3>
                    <p className='m-0 p-0 fw-bold'>Hours Lectures</p>
                  </div>
                </div>
                <div className='col-6 col-md-3'>
                  <div className='shadow-sm border text-center p-3 rounded-3 bg-white h-100'>
                    <h3 className='m-0 p-0 fw-bolder fs-2 text-danger'>2+</h3>
                    <p className='m-0 p-0 fw-bold'>Previous Year QP</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>



      {/*==================================== New And Latest Cources Section =====================================*/}
      <section className='container-lg px-3 my-5 home-banner-section'>
        <div className='text-center'>
          <h5 className='fw-bolder purple'>Cources We Deliver</h5>
          <h1 className='fw-bolder'>Our Latest Featured Cources</h1>
          <p className='p-gray'>Our team and professionals to provide the best cources for both technical & non-technical for all your problems <br />
            Examee's has been designing and provide afortable cources from more than 2 years</p>
        </div>
        <div className='container-lg mt-3'>
          <div className="row g-4 mt-4">
            {Course.length === 0 &&
              <div className="text-center">
                  <h6 className="d-flex justify-content-center text-muted text-center my-4">No Data Found!  Plese Check internet connection</h6>
                  <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                  <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
              </div>
            }
            {Course.map((Course, index) => <CourceIteam key={index} Course={Course} />)}
          </div>
        </div>
        <div className='d-flex justify-content-center'>
          <button className='btn btn-dark px-5 py-2 mt-5' onClick={() => navigate('/cource')} >View All Courses</button>
        </div>
      </section>



      {/*============================================== team ====================================*/}
      <section className=' bg-light'>
        <div className='container-lg px-lg-5'>
          <div className='px-2 py-4 d-flex flex-column justify-content-center align-items-center'>
            <div className='col-md-10 col-lg-8 text-center'>
              <h1 className='fw-bolder my-4'>We Provide Notes & Cources</h1>
              <p className='p-gray'>We are a team of professionals providing the best Study Material for all your needs. Examee's has been designing and developing Study Material for more than 2 years</p>
            </div>
            <div className='mt-5'>
              <div className="row g-4">{team.map((team, index) => <Team key={index} profile={team.profile} name={team.name} role={team.role} description={team.description} />)}</div>
            </div>
          </div>

          <section className='hero-showcase py-1'>
            <div className='container-lg mb-4'>
              <div className='row g-3'>
                <div className='col-6 col-md-3'>
                  <div className=' shadow-sm border text-center p-3 py-lg-4 rounded-3 bg-white h-100'>
                    <h6 className='m-0 p-0 fw-bolder'>Previous Papers</h6>
                    <p className='m-0 p-0 text-secondary'>Access past exam papers</p>
                  </div>
                </div>
                <div className='col-6 col-md-3'>
                  <div className='shadow-sm border text-center p-3 py-lg-4 rounded-3 bg-white h-100'>
                    <h6 className='m-0 p-0 fw-bolder'>Video Lectures</h6>
                    <p className='m-0 p-0 text-secondary'>Watch expert explanations</p>
                  </div>
                </div>
                <div className='col-6 col-md-3'>
                  <div className='shadow-sm border text-center p-3 py-lg-4 rounded-3 bg-white h-100'>
                    <h6 className='m-0 p-0'>Study Notes</h6>
                    <p className='m-0 p-0 text-secondary '>Download detailed notes</p>
                  </div>
                </div>
                <div className='col-6 col-md-3'>
                  <div className='shadow-sm border text-center p-3 py-lg-4 rounded-3 bg-white h-100'>
                    <h6 className='m-0 p-0 fw-bolder'>Mock Tests</h6>
                    <p className='m-0 p-0 text-secondary'>Practice with sample tests</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>



      {/*---------- Examee Works ----------*/}
      <div className='py-2 px-lg-5'>
        <HowExameeWork />
      </div>


      {/*=========================================== Testimonial Card 3 ==============================================*/}
      {/* <div className='bg-light py-5 px-lg-5'>
        <div className="container-lg my-5 ">
          <h2 className="fw-bolder text-center my-3">Our Testimonials</h2>
          <p className='text-center fw-bold p-gray mb-5'>Trusted By Thousands  ||  Why People Love Us  ||  Your Feedback, Our Pride</p>
          <div className="row justify-content-center g-4 px-3">
          {testimonals.map((user,index)=>
              <TestimonialCard key={index} img={user.img} name={user.name} role={user.role} description={user.description}/>)}
          </div>
        </div>
      </div> */}


      {/* ------- offers ---------------*/}
      <footer className="offers-section px-lg-5">
        <Offers />
      </footer>


      {/*------- footer ----------------- */}
      <footer className="footer bottom-0">
        <Footer />
      </footer>


    </div >
  )
}

export default Home
