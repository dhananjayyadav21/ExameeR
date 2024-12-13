import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      
      <section className='container my-5'>
        <div className='row text-center'>
            <div className='col-12 col-md-6 align-self-center'>
                <h2>Discover Your <span style={{color:"green"}}>Notes & Cources</span></h2>
                <p>We provide a comprehensive collection of notes, previous year question papers, and specialized courses to
                enhance your exam preparation. Our resources are designed to assist all college students in achieving
                academic success</p>
                <input className='p-2 rounded-4 col-8' type="text" placeholder="Search for Notes..."/>
                <div className='d-flex gap-3 justify-content-center mt-3'>
                <button type="button" className="btn btn-warning px-4 rounded-3"><Link className='nav-link' to="/login">Login</Link></button>
                <button type="button" className="btn btn-warning px-4 rounded-3"><Link className='nav-link' to="/register">Register</Link></button>
                </div> 
              </div>

            <div className='col-12 col-md-6 align-self-center '>
                <img className='front-img' src="assets/img/Front.png" alt="Front Examee" />
            </div>
        </div> 
      </section>


    </div>
  )
}

export default Home
