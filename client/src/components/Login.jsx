import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <>
     <div className="container d-flex justify-content-center align-self-center px-3 mt-2 mb-3">
        <div className="form-containe col-12 col-lg-5 shadow rounded-4 py-4 px-4 p-md-5 mt-3 Login">

            {/* <!-- Login Heading --> */}
            <div className='mb-4'>
                <h4 className="text-start fw-bold mb-1">Login</h4>
                <p className='text-secondary'>to continue to Examee</p>
            </div> 
           
            {/* <!-- Google Login Button --> */}
            <div className="d-grid">
                <button className="btn btn-light border">
                    <img  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Icon" className="me-2"  style={{width:"20px"}}/>
                    Login with Google
                </button>
            </div>

            {/* <!-- Divider --> */}
            <div className="text-center my-3">
               <small>or</small>
            </div>
            
            {/* <!-- LOGIN Form --> */}
            <form noValidate>
                <div className="mb-3">
                    <small><label htmlFor="email" className="form-label">Email</label></small>
                    <input type="email" className="form-control" id="email" placeholder="Enter your email"/>
                </div>

                <div className="mb-3">
                   <div className='d-flex justify-content-between'>
                        <small><label htmlFor="password" className="form-label ">Password</label></small>
                        <small><Link to="/forgotPassword" className='nav-link fw-normal text-primary'>Forgot Password?</Link></small>
                    </div> 
                    <input type="password" className="form-control" id="password" placeholder="Enter your password"/>
                </div>

                <button type="submit" className="btn btn-green w-100">Login</button>
            </form>

        </div>
    </div>
    </>
  )
}

export default Login
