import React from 'react'
import { Link } from 'react-router-dom'
import VideoIteam from '../components/VideoItem'
import NotesIteam from '../components/NotesItem'

const Home = () => {

  let arr = [{},{},{},{},{}]

  return (
    <div>
      
      {/*================================================ home-main-section =================================================*/}
      <section className='container my-5'>
        <div className='row text-center'>
            <div className='col-12 col-md-6 align-self-center'>
                <h2>Discover Your <span style={{color:"green"}}>Notes & Cources</span></h2>
                <p>We provide a comprehensive collection of notes, previous year question papers, and specialized courses to
                enhance your exam preparation. Our resources are designed to assist all college students in achieving
                academic success</p>
                <input className='p-2 rounded-4 col-11 col-md-8' type="text" placeholder="Search for Notes..."/>
                <div className='d-flex gap-3 justify-content-center mt-3'>
                <button type="button" className="btn btn-green px-4 rounded-3"><Link className='nav-link' to="/auth">Login</Link></button>
                <button type="button" className="btn btn-green px-4 rounded-3"><Link className='nav-link' to="/auth">Register</Link></button>
                </div> 
              </div>

            <div className='col-12 col-md-6 align-self-center '>
                <img className='front-img' src="assets/img/Front.png" alt="Front Examee" />
            </div>
        </div> 
      </section>    

      {/*========================================== New And Latest Cources Section============================================*/}
      <section className='container my-5 home-banner-section'>
        <div className='text-center'>
          <h5 className='fw-bolder purple'>Cources We Deliver</h5>
          <h1 className='fw-bolder'>Our Latest Featured Cources</h1>
          <p>Our team and professionals to provide the best cources for both technical & non-technical for all your problems <br/>
          Examee's has been designing and provide afortable cources from more than 2 years</p>
        </div>
        <div className='container align-items-center'>
            <div className="container row g-4 mt-4">{arr.map((e)=> <VideoIteam/>)}</div>
        </div>
      </section>

       {/*=============================================== Our Provide Service Section ============================================*/}
       <section className='container-fluid my-5 '>
        <div className='p-md-5 p-4 rounded-2 d-sm-flex justify-content-between align-items-center Home-Products-Section text-center fw-bold home-banner-section'>
          <div className='my-5 my-sm-0'>
            <h1>4+</h1>
            <h5>Development Notes</h5>
          </div>
          <div className='my-5 my-sm-0'>
            <h1>3+</h1>
            <h5>Development Cources</h5>
          </div>
          <div className='my-5 my-sm-0'>
            <h1>150+</h1>
            <h5>Hours Lectures</h5>
          </div>
          <div className='my-5 my-sm-0'>
            <h1>2+</h1>
            <h5>Previous Year Q-P</h5>
          </div>
        </div>
      </section>


      {/*================================= New And Latest Devlopmemnt Notes Section ==========================================*/}
      <section className='container my-5'>
        <div className='text-center'>
          <h5 className='fw-bolder purple'>Devlopment Cources We Deliver</h5>
          <h1 className='fw-bolder my-4'>We Provide Notes & Cources</h1>
          <p>We are a team and professionals to provide the best Study Material for all your problems <br/>
          Examee's has been designing and developing s Study Material from more than 2 years</p>
        </div>
        <div className='container align-items-center mt-5'>
            <div className="container row g-4">{arr.map((e)=> <NotesIteam/>)}</div>
        </div>
      </section>


       {/*=============================================== Get Offers Section ============================================*/}
       <section className='container-fluid my-5'>
        <div className='p-md-5 p-4 rounded-2 d-sm-flex justify-content-between align-items-center green text-center home-banner-section'>
          <h1 className='fw-bolder mb-2 my-sm-0'>Try With Latest Offers</h1>
          <button className='btn btn-warning mt-2 my-sm-0'> <a className='nav-link' href="/">Get New Offesrs<i className="fa-solid fa-up-right-from-square mx-1 mx-md-3"></i></a></button>
        </div>
      </section>
    

    </div>
  )
}

export default Home
