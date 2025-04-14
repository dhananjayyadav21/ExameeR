import React from 'react'
import { Link } from 'react-router-dom'
import CourceIteam from '../components/CourceIteam'
import Footer from '../components/Footer'
// import TestimonialCard from '../components/TestimonialCard'
import Team from '../components/Team'
import Offers from '../components/Offers'
import { ReactTyped } from "react-typed";
import HowExameeWork from '../components/HowExameeWork'

const Home = () => {

  let arr = [{},{},{},{}]
  let team = [
    {

      "name": "Sanjay Yadav",
      "role": "Software Engineer",
      "description": "Teaches technical concepts, facilitates teamwork, and ensures project success."
    },
    {
      "name": "Dhananjay Yadav",
      "role": "RAD'27",
      "description": "Guides resource management, teaches workflow strategies, and mentor."
    },
    {
      "name": "Neel Singh",
      "role": "Junior Developer",
      "description": "Teaches coding basics, fosters collaboration, and support."
    }
  ]
  
  // let testimonals = [
  //   {
  //     "name": "Alice Carter",
  //     "role": "UI/UX Designer",
  //     "description": "The courses offered here helped me improve my design skills significantly",
  //     "img": "https://www.atlanticcouncil.org/wp-content/uploads/2022/09/JolyMelanie_Lib_t-1.jpg"
  //   },
  //   {
  //     "name": "Michael Rodriguez",
  //     "role": "Full Stack Developer",
  //     "description": "This platform has the best resources for learning modern web development. Highly recommended!",
  //     "img": "https://wallpapers.com/images/hd/professional-profile-pictures-1350-x-1080-sizz773bu8k11plw.jpg"
  //   },
  //   {
  //     "name": "Sophia Patel",
  //     "role": "Data Analyst",
  //     "description": "The analytics courses were exactly what I needed to boost my career. The instructors are amazing!",
  //     "img": "https://th.bing.com/th/id/R.65c93fce16c1532b3e15a4a52f3ef7f6?rik=nzRaktT%2fUnQRqw&riu=http%3a%2f%2fthispix.com%2fwp-content%2fuploads%2f2015%2f06%2f011.jpg&ehk=gJKh7A8T2u3z4vSqk7O6KLmxjgWQ6OsIxQN3fUiN%2bAM%3d&risl=&pid=ImgRaw&r=0"
  //   }
  // ]

  return (
    <div>    
      {/*================================================ home-main-section =================================================*/}
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
                    "Cources", ]} typeSpeed={40} backSpeed={50} loop/></span>
                  </h3>
                  <p className='text-secondary'>We provide a comprehensive collection of notes, previous year question papers, and specialized courses to
                  enhance your exam preparation. Our resources are designed to assist all college students in achieving
                  academic success</p>
                  <div className='hero-search'>
                    <input className='rounded-5 col-11 col-md-8 mt-0 my-3 form-control' type="search" placeholder="Search for Notes..."/>
                    <button className='btn btn-purple rounded-5 px-4 py-2 hero-btn'>Search</button>
                  </div>
                  
                  <div className='d-flex gap-2 justify-content-center justify-content-md-start'>
                  <button type="button" className="btn btn-green px-4 rounded-3"><Link className='nav-link' to="/auth">Login</Link></button>
                  <button type="button" className="btn btn-green px-4 rounded-3"><Link className='nav-link' to="/auth">Register</Link></button>
                  </div> 
                </div>

              <div className='col-12 col-md-6 rounded-4 mb-4'>
                  <img className='front-img' src="/assets/img/Front.png" alt="Front Examee" />
              </div>
          </section> 

          {/*======================================= Our Provide Service Section ============================================*/}
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

     

      {/*========================================== New And Latest Cources Section============================================*/}
      <section className='container-lg px-4 my-5 home-banner-section'>
        <div className='text-center'>
          <h5 className='fw-bolder purple'>Cources We Deliver</h5>
          <h1 className='fw-bolder'>Our Latest Featured Cources</h1>
          <p className='p-gray'>Our team and professionals to provide the best cources for both technical & non-technical for all your problems <br/>
          Examee's has been designing and provide afortable cources from more than 2 years</p>
        </div>
        <div className='mt-2 mt-md-3'>
            <div className="row g-4 mt-4">{arr.map((e,index)=> <CourceIteam key={index}/>)}</div>
        </div>
        <div className='d-flex justify-content-center'>
           <button className='btn btn-dark px-5 py-2 mt-5'>View All Courses</button>
        </div>
      </section>

    

      {/*================================================== team ==========================================*/}
      <section className=' bg-light'>
        <div className='container-lg px-lg-5'>
            <div className='px-2 py-4 d-flex flex-column justify-content-center align-items-center'>
              <div className='col-md-10 col-lg-8 text-center'>
                <h1 className='fw-bolder my-4'>We Provide Notes & Cources</h1>
                <p className='p-gray'>We are a team of professionals providing the best Study Material for all your needs. Examee's has been designing and developing Study Material for more than 2 years</p>
              </div>
              <div className='mt-5'>
                  <div className="row g-4">{team.map((team,index)=> <Team key={index} name={team.name} role={team.role} description={team.description}/>)}</div>
              </div>
            </div>

            <section className='hero-showcase py-3 pt-lg-5'>
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



      {/*=============================================== Examee Works ============================================*/}
      <div className='py-2 px-lg-5'>
        <HowExameeWork/>   
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


      {/* ====================================== offers ================================================================= */}
      <footer className="offers-section px-lg-5">
        <Offers/>
      </footer>


      {/* ====================================== footer ================================================================= */}
      <footer className="footer bottom-0">
         <Footer/>
      </footer>
      

    </div>
  )
}

export default Home
