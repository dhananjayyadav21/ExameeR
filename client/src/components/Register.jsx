import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <>
      <div className="container d-flex justify-content-center align-self-center mt-2">
        <div className="form-containe col-12 col-md-7 shadow rounded-2 rounded-md-4 py-4 px-3 p-md-5 mt-3">
            <h3 className="text-start mb-4">REGISTER</h3>
            
            {/* <!-- Register Form --> */}
            <form>
                <div className='row'>
                    <div className='col-6'>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" className="form-control" id="username" placeholder="Enter your username" required/>
                        </div>
                    </div>
                    <div className='col-6'>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter your email" required/>
                        </div>
                    </div>

                    <div className='col-6'>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Enter your password" required/>
                        </div>
                    </div>
                    <div className='col-6'>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" id="confirmPassword" placeholder="Re-enter your password" required/>
                        </div>
                    </div>

                </div>
                <button type="submit" className="btn btn-green w-100"><Link className='nav-link' to="/verifyEmail">Register</Link></button>
            </form>

            <div className="text-center my-3">
                <small>or</small>
            </div>

            {/* <!-- Google Register Button --> */}
            <div className="d-grid">
                <button className="btn btn-light border">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Icon" className="me-2"  style={{width:"20px"}}/>
                    Register with Google
                </button>
            </div>

        </div>
    </div>
    </>
  )
}

export default Register
