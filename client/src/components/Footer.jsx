import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <div className="container-lg py-4 px-3">
        <div className="row">

          <div className='col-lg-6' >
            <div className='container-lg'>
              <div className='row'>
                <div className="col-md-6 my-3">
                  <img src="./assets/img/brandlog.png" alt="logo" width={"140px"} style={{}} />
                  <p className='py-3 m-0'>Providing comprehensive educational resources and courses to help students achieve academic excellence.</p>
                </div>

                <div className="col-md-6 my-3">
                  <h5 className="mb-3">Quick Links</h5>
                  <ul className="list-unstyled">
                    <li><Link to="/" className="nav-link cursor-pointer my-2"> Home</Link></li>
                    <li><Link to="/about" className="nav-link cursor-pointer my-2">About Us</Link></li>
                    <li><Link to="/cource" className="nav-link cursor-pointer my-2">Courses</Link></li>
                    <li><Link to="/notes" className="nav-link cursor-pointer my-2">Notes</Link></li>
                    <li><Link to="/Q-paper" className="nav-link cursor-pointer my-2">Contact</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>



          <div className='col-lg-6'>
            <div className='container-lg'>
              <div className='row'>

                <div className="col-md-6 my-3">
                  <h5 className="mb-3">Our Courses</h5>
                  <ul className="list-unstyled">
                    <li><Link to="/cource" className="nav-link cursor-pointer my-2">Sci-Technology</Link></li>
                    <li><Link to="/cource" className="nav-link cursor-pointer my-2">Commerce</Link></li>
                    <li><Link to="/cource" className="nav-link cursor-pointer my-2">Arts & Civils</Link></li>
                    <li><Link to="/Q-paper" className="nav-link cursor-pointer my-2">Previous Papers</Link></li>
                    <li><Link to="/video" className="nav-link cursor-pointer my-2">Video Lectures</Link></li>
                  </ul>
                </div>

                <div className="col-md-6 my-3">
                  <h5 className="m-0">Connect with me</h5>
                  <p className='py-3 m-0'>Connect with me for updates and offers.</p>
                  <ul className="list-unstyled">
                    <li><a href="https://www.linkedin.com/in/dhananjayyadav18" className="nav-link"><span>Linkedin</span><i className="fa-brands fa fa-linkedin mx-2"></i></a></li>
                    <li><a href="https://www.instagram.com/iamneell_ig/" className="nav-link"> <span>Instagram</span><i className="fa-brands fa fa-instagram  mx-2"></i></a></li>
                    <li><a href="https://www.youtube.com/@exameecode" className="nav-link"><span>You Tube</span><i className="fa-brands fa fa-youtube  mx-2"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-lg text-center">
        <div>
          <hr className='m-0' />
        </div>
        <p className="py-4 m-0">&copy; 2024 Examee. All Rights Reserved.</p>
      </div>
    </>
  )
}

export default Footer
