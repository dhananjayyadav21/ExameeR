import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <>
     <div className="container d-flex justify-content-center align-self-center mt-2">
        <div className="form-containe col-12 col-md-7 shadow rounded-2 rounded-md-4 py-4 px-3 p-md-5 mt-3">
            <h3 className="text-start mb-4">LOGIN</h3>
            
            {/* <!-- LOGIN Form --> */}
            <form>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter your email" required/>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Enter your password" required/>
                </div>

                <div className="text-end my-3">
                   <Link to="/forgotPassword">Forgot Password</Link>
                </div>

                <button type="submit" className="btn btn-green w-100">LOGIN</button>
            </form>

            <div className="text-center my-3">
                <small>or</small>
            </div>

            {/* <!-- Google Register Button --> */}
            <div className="d-grid">
                <button className="btn btn-light border">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Icon" className="me-2"  style={{width:"20px"}}/>
                    Login with Google
                </button>
            </div>

        </div>
    </div>
    </>
  )
}

export default Login
