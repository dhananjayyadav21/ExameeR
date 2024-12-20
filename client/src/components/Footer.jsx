import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
       <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h4 className="text-uppercase fw-bold mb-3">About Us</h4>
              <p>We are dedicated to providing the best online learning experience. Our platform offers a wide range of courses to help you achieve your learning goals.</p>
              <h5 className='mt-3 text-center'><a href="/cources" className="nav-link cursor-pointer my-2">Courses<i className="fa-solid fa-tv mx-2"></i></a></h5>
            </div>

            <div className="col-md-4 mb-3">
              <h4 className="text-uppercase fw-bold mb-3">Quick Links</h4>
              <ul className="list-unstyled">
                <li><Link to="/video" className="nav-link cursor-pointer my-2"> Lectures</Link></li>
                <li><Link to="/cources" className="nav-link cursor-pointer my-2">Courses</Link></li>
                <li><Link to="/notes" className="nav-link cursor-pointer my-2">Notes</Link></li>
                <li><Link to="/Q-paper" className="nav-link cursor-pointer my-2">Q-Papers</Link></li>
              </ul>
            </div>

            <div className="col-md-4 mb-3">
              <h4 className="text-uppercase fw-bold mb-3">Follow Us</h4>
              <ul className="list-unstyled d-flex justify-content-center">
                <li><a href="https://www.linkedin.com/in/dhananjayyadav18" className="nav-link me-4"><i className="fa-brands fa-linkedin"></i></a></li>
                <li><a href="https://www.instagram.com/iamneell_ig/" className="nav-link me-4"><i className="fa-brands fa-instagram"></i></a></li>
                <li><a href="https://www.youtube.com/@exameecode" className="nav-link me-4"><i className="fa-brands fa-youtube"></i></a></li>
              </ul>
            </div>
          </div>

        </div>
        <div className="text-center mt-3">
          <p className="mb-0">&copy; 2024 Examee. All Rights Reserved.</p>
        </div>
    </>
  )
}

export default Footer
