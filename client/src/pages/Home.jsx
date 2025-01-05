import React from 'react'
import { Link } from 'react-router-dom'
import CourceIteam from '../components/CourceIteam'
// import NotesIteam from '../components/NotesItem'
import Footer from '../components/Footer'
import TestimonialCard from '../components/TestimonialCard'
import Team from '../components/Team'
import { ReactTyped } from "react-typed";

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
  
  let testimonals = [
    {
      "name": "Alice Carter",
      "role": "UI/UX Designer",
      "description": "The courses offered here helped me improve my design skills significantly",
      "img": "https://www.atlanticcouncil.org/wp-content/uploads/2022/09/JolyMelanie_Lib_t-1.jpg"
    },
    {
      "name": "Michael Rodriguez",
      "role": "Full Stack Developer",
      "description": "This platform has the best resources for learning modern web development. Highly recommended!",
      "img": "https://wallpapers.com/images/hd/professional-profile-pictures-1350-x-1080-sizz773bu8k11plw.jpg"
    },
    {
      "name": "Sophia Patel",
      "role": "Data Analyst",
      "description": "The analytics courses were exactly what I needed to boost my career. The instructors are amazing!",
      "img": "https://th.bing.com/th/id/R.65c93fce16c1532b3e15a4a52f3ef7f6?rik=nzRaktT%2fUnQRqw&riu=http%3a%2f%2fthispix.com%2fwp-content%2fuploads%2f2015%2f06%2f011.jpg&ehk=gJKh7A8T2u3z4vSqk7O6KLmxjgWQ6OsIxQN3fUiN%2bAM%3d&risl=&pid=ImgRaw&r=0"
    }
  ]

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
                    <input className='rounded-5 col-11 col-md-8 mt-0 my-3 form-control' type="text" placeholder="Search for Notes..."/>
                    <button className='btn btn-purple rounded-5 px-4 py-2 hero-btn'>Search</button>
                  </div>
                  
                  <div className='d-flex gap-2 justify-content-center justify-content-md-start'>
                  <button type="button" className="btn btn-green px-4 rounded-3"><Link className='nav-link' to="/auth">Login</Link></button>
                  <button type="button" className="btn btn-green px-4 rounded-3"><Link className='nav-link' to="/auth">Register</Link></button>
                  </div> 
                </div>

              <div className='col-12 col-md-6 rounded-4 mb-4'>
                  <img className='front-img' src="assets/img/Front.png" alt="Front Examee" />
              </div>
          </section> 

          {/*======================================= Our Provide Service Section ============================================*/}
          <section className='hero-showcase mt-5 text-secondary'>
            <div className='container-lg mb-4 mb-lg-0'>
              <div className='row g-3'>
                <div className='col-6 col-md-3'>
                  <div className=' shadow-sm border text-center p-3 rounded-3 bg-white'>
                    <h3 className='m-0 p-0 fw-bolder fs-2 text-primary'>4+</h3>
                    <p className='m-0 p-0 fw-bold'>Development Notes</p>  
                  </div>
                </div>
                <div className='col-6 col-md-3'>
                  <div className='shadow-sm border text-center p-3 rounded-3 bg-white'>
                    <h3 className='m-0 p-0 fw-bolder fs-2 text-info'>3+</h3>
                    <p className='m-0 p-0 fw-bold'>Development Courses</p>  
                  </div>
                </div>
                <div className='col-6 col-md-3'>
                  <div className='shadow-sm border text-center p-3 rounded-3 bg-white'>
                    <h3 className='m-0 p-0 fw-bolder fs-2 text-warning'>150+</h3>
                    <p className='m-0 p-0 fw-bold'>Hours Lectures</p>  
                  </div>
                </div>
                <div className='col-6 col-md-3'>
                  <div className='shadow-sm border text-center p-3 rounded-3 bg-white'>
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

    

      {/*================================= New And Latest Devlopmemnt Notes Section ==========================================*/}
      <section className='bg-light'>
        <div className='container-lg'>
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
                    <div className=' shadow-sm border text-center p-3 py-lg-4 rounded-3 bg-white'>
                      <h6 className='m-0 p-0 fw-bolder'>Previous Papers</h6>
                      <p className='m-0 p-0 text-secondary'>Access past exam papers</p>  
                    </div>
                  </div>
                  <div className='col-6 col-md-3'>
                    <div className='shadow-sm border text-center p-3 py-lg-4 rounded-3 bg-white'>
                      <h6 className='m-0 p-0 fw-bolder'>Video Lectures</h6>
                      <p className='m-0 p-0 text-secondary'>Watch expert explanations</p>  
                    </div>
                  </div>
                  <div className='col-6 col-md-3'>
                    <div className='shadow-sm border text-center p-3 py-lg-4 rounded-3 bg-white'>
                      <h6 className='m-0 p-0'>Study Notes</h6>
                      <p className='m-0 p-0 text-secondary '>Download detailed notes</p>  
                    </div>
                  </div>
                  <div className='col-6 col-md-3'>
                    <div className='shadow-sm border text-center p-3 py-lg-4 rounded-3 bg-white'>
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
        <section id="howItWorks" className="container-lg pt-5">
          <div className="px-lg-4">

            {/* <!-- Section Header --> */}
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-2">How Examee Works</h2>
              <p className="text-secondary">Simple steps to start your learning journey with us</p>
            </div>

            <div className="row my-5">
              {/* <!-- Step 1 --> */}
              <div className='col-md-4'>
                <div className="text-center py-3">
                  <div className="Step-blue mx-auto">
                    <h1 className="fw-bold">1</h1>
                  </div>
                  <h4 className="text-xl font-bold my-2 my-md-4">Choose Your Course</h4>
                  <p className="text-neutral-600">Browse through our wide range of courses and select the one that matches your learning goals.</p>
                </div>
              </div>

              {/* <!-- Step 2 --> */}
              <div className='col-md-4'>
                <div className="text-center py-3">
                  <div className="Step-green mx-auto">
                    <h2 className="fw-bold text-success">2</h2>
                  </div>
                  <h4 className="text-xl font-bold my-2 my-md-4">Access Materials</h4>
                  <p className="text-neutral-600">Get instant access to comprehensive study materials, notes, and video lectures.</p>
                </div>
              </div>

              {/* <!-- Step 3 --> */}
              <div className='col-md-4'>
                <div className="text-center py-3" >
                  <div className="Step-purple mx-auto">
                    <h2 className="fw-bold">3</h2>
                  </div>
                  <h4 className="text-xl font-bold  my-2 my-md-4">Start Learning</h4>
                  <p className="text-neutral-600">Begin your learning journey with structured content and practice materials.</p>
                </div>
              </div>
            </div>

            <div className='container my-5 Feature-examee' >
              <div className="row g-3">
                {/* <!-- Feature 1 --> */}
                <div className="col-md-6 col-lg-3">
                  <div className='shadow-sm rounded-3 border p-3 p-lg-3 bg-light'>
                    <div className="svg-blue mb-4" style={{width:"40px"}}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h5 className="font-semibold mb-2">Expert Verified</h5>
                    <p className="text-neutral-600 text-sm">All content verified by subject matter experts</p>
                  </div>
                </div>

                {/* <!-- Feature 2 --> */}
                <div className="col-md-6 col-lg-3">
                <div className='shadow-sm rounded-3 border p-3 p-lg-3 bg-light'>
                  <div className="svg-green mb-3" style={{width:"40px"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <h5 className="font-semibold mb-2">Regular Updates</h5>
                  <p className="text-neutral-600 text-sm">Content updated as per latest syllabus</p>
                </div>
                </div>

                {/* <!-- Feature 3 --> */}
                <div className="col-md-6 col-lg-3" >
                <div className=' shadow-sm rounded-3 border p-3 p-lg-3 bg-light'>
                  <div className="svg-purple mb-3" style={{width:"40px"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h5 className="font-semibold mb-2">24/7 Access</h5>
                  <p className="text-neutral-600 text-sm">Learn at your own pace, anytime</p>
                </div>
                </div>

                {/* <!-- Feature 4 --> */}
                <div className="col-md-6 col-lg-3" >
                <div className=' shadow-sm rounded-3 border p-3 p-lg-3 bg-light'>
                  <div className="svg-red mb-3" style={{width:"40px"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <h5 className="font-semibold mb-2">Support</h5>
                  <p className="text-neutral-600 text-sm">Get help whenever you need it</p>
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      {/*==================================================== Testimonial Card 3 ==============================================*/}
      <div className='bg-light py-5'>
        <div className="container-lg my-5 ">
          <h2 className="fw-bolder text-center my-3">Our Testimonials</h2>
          <p className='text-center fw-bold p-gray mb-5'>Trusted By Thousands  ||  Why People Love Us  ||  Your Feedback, Our Pride</p>
          <div className="row justify-content-center g-4 px-3">
          {testimonals.map((user,index)=>
              <TestimonialCard key={index} img={user.img} name={user.name} role={user.role} description={user.description}/>)}
          </div>
        </div>
      </div>


      {/* ====================================== footer ================================================================= */}
      <footer className="footer bottom-0">
         <Footer/>
      </footer>
      

    </div>
  )
}

export default Home
