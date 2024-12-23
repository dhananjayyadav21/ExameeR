import React from 'react'
import { Link } from 'react-router-dom'
import CourceIteam from '../components/CourceIteam'
import NotesIteam from '../components/NotesItem'
import Footer from '../components/Footer'
import TestimonialCard from '../components/TestimonialCard'
import { ReactTyped } from "react-typed";

const Home = () => {

  let arr = [{},{},{},{},{}]
  let testimonals = [
    {
      "name": "Alice Carter",
      "role": "UI/UX Designer",
      "description": "The courses offered here helped me improve my design skills significantly. The hands-on approach is fantastic!",
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
    },
    {
      "name": "David Johnson",
      "role": "Project Manager",
      "description": "I gained a lot of practical knowledge about project management. This platform is a game-changer.",
      "img": "https://sb.kaleidousercontent.com/67418/1920x1545/c5f15ac173/samuel-raita-ridxdghg7pw-unsplash.jpg"
    },
    {
      "name": "Emma Williams",
      "role": "Marketing Specialist",
      "description": "The marketing courses helped me implement strategies that actually work. I couldn’t be happier!",
      "img": "https://th.bing.com/th/id/OIP.q-B2ThvnC9isZGodVyFKCAHaHZ?rs=1&pid=ImgDetMain"
    }
  ]

  return (
    <div>
          
      {/*================================================ home-main-section =================================================*/}
      <section className='hero'>
        <section className='container-lg mx-md-3 my-md-5'>
          <div className='row rounded-4 p-md-4 bg-light'>
              <div className='col-12 col-md-6 text-md-start px-lg-4 my-5'>
                  <h1 className='fw-bold'>Discover Your <span className='green'>Notes & Cources</span></h1>
                  <h3>Search Our <span className='green'>
                  <ReactTyped strings={[
                    "Notes",
                    "Q-Paper",
                    "Lectures",
                    "Cources", ]} typeSpeed={40} backSpeed={50} loop/></span>
                  </h3>
                  <p>We provide a comprehensive collection of notes, previous year question papers, and specialized courses to
                  enhance your exam preparation. Our resources are designed to assist all college students in achieving
                  academic success</p>
                  <input className='p-2 rounded-5 col-11 col-md-8 mt-0 my-3 form-control' type="text" placeholder="Search for Notes..."/>
                  <div className='d-flex gap-2 justify-content-center justify-content-md-start'>
                  <button type="button" className="btn btn-green px-4 rounded-3"><Link className='nav-link' to="/auth">Login</Link></button>
                  <button type="button" className="btn btn-green px-4 rounded-3"><Link className='nav-link' to="/auth">Register</Link></button>
                  </div> 
                </div>

              <div className='col-12 col-md-6 rounded-4 mb-4'>
                  <img className='front-img' src="assets/img/Front.png" alt="Front Examee" />
              </div>
          </div> 
        </section>  
      </section>  

      {/*========================================== New And Latest Cources Section============================================*/}
      <section className='container-md px-4 my-5 home-banner-section'>
        <div className='text-center'>
          <h5 className='fw-bolder purple'>Cources We Deliver</h5>
          <h1 className='fw-bolder'>Our Latest Featured Cources</h1>
          <p className='p-gray'>Our team and professionals to provide the best cources for both technical & non-technical for all your problems <br/>
          Examee's has been designing and provide afortable cources from more than 2 years</p>
        </div>
        <div className='mt-2 mt-md-3'>
            <div className="row g-4 mt-4">{arr.map((e,index)=> <CourceIteam key={index}/>)}</div>
        </div>
      </section>

       {/*=============================================== Our Provide Service Section ============================================*/}
       <section className='container-fluid'>
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
      <section className='container-md px-4 my-5'>
        <div className='text-center'>
          <h5 className='fw-bolder purple'>Devlopment Cources We Deliver</h5>
          <h1 className='fw-bolder my-4'>We Provide Notes & Cources</h1>
          <p className='p-gray'>We are a team and professionals to provide the best Study Material for all your problems <br/>
          Examee's has been designing and developing s Study Material from more than 2 years</p>
        </div>
        <div className='mt-5'>
            <div className="row g-4">{arr.map((e,index)=> <NotesIteam key={index}/>)}</div>
        </div>
      </section>


       {/*=============================================== Get Offers Section ============================================*/}
       <section className='container-fluid'>
        <div className='p-md-5 p-4 rounded-2 d-sm-flex justify-content-between align-items-center green-bg text-center home-banner-section'>
          <h1 className='fw-bolder mb-2 my-sm-0'>Try With Latest Offers</h1>
          <button className='btn btn-warning mt-2 my-sm-0'> <a className='nav-link' href="/">Get New Offesrs<i className="fa-solid fa-up-right-from-square mx-1 mx-md-3"></i></a></button>
        </div>
      </section>


      {/*==================================================== Testimonial Card 3 ==============================================*/}
      <div className="container my-5">
        <h2 className="fw-bolder text-center my-3">Our Testimonials</h2>
        <p className='text-center p-gray mb-5'>Trusted By Thousands  ||  Why People Love Us  ||  Your Feedback, Our Pride</p>
        <div className="row justify-content-center g-4 px-3">
         {testimonals.map((user,index)=>
             <TestimonialCard key={index} img={user.img} name={user.name} role={user.role} description={user.description}/>)}
        </div>
      </div>


      {/* ====================================== footer ================================================================= */}
      <footer className="footer text-center py-4">
         <Footer/>
      </footer>
      

    </div>
  )
}

export default Home
