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
                    <ul className="list-unstyled d-flex">
                      <li><a href="https://www.linkedin.com/in/dhananjayyadav18" className="nav-link me-4"><i className="fa-brands fa-2x fa-linkedin"></i></a></li>
                      <li><a href="https://www.instagram.com/iamneell_ig/" className="nav-link me-4"><i className="fa-brands fa-2x fa-instagram"></i></a></li>
                      <li><a href="https://www.youtube.com/@exameecode" className="nav-link me-4"><i className="fa-brands fa-2x fa-youtube"></i></a></li>
                    </ul>
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
                    <h5 className="m-0">Newsletter</h5>
                    <p className='py-3 m-0'>Subscribe to our newsletter for updates and offers.</p> 
                    <form action="sumbit" className='d-flex flex-column'>
                        <input className='placeholder-white p-2 rounded-2 col-11 col-sm-12 mt-0 my-3 form-control bg-dark text-white' type="email" name='email' placeholder="Search for Notes..."/>
                        <button className='btn btn-green'>Subscribe</button>
                    </form>
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
