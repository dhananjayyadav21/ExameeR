import React from 'react'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
  return (
    <>
       <div className="container d-flex justify-content-center align-self-center my-3">
        <div className="form-containe col-12 col-md-7 shadow rounded-2 rounded-md-4 py-4 px-3 p-md-5 mt-3">
            <h3 className="text-start mb-4">FORGOT PASSWORD</h3>
            
            {/* <!-- Forgot password Form --> */}
            <form>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter your email" required/>
                </div>

                <button type="submit" className="btn btn-green w-100 mb-3">Get Verification Code</button>

                <div className="mb-3">
                    <label htmlFor="vcode" className="form-label">Verification Code</label>
                    <input type="number" className="form-control" id="vcode" placeholder="Enter Verification Code" required/>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">New Password</label>
                    <input type="password" className="form-control" id="password" placeholder="password" required/>
                </div>

                <div className="mb-3">
                    <label htmlFor="Cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="Cpassword" placeholder="Confirm password" required/>
                </div>

                <button type="submit" className="btn btn-green w-100">Save Password</button>
            </form>

            <div className="text-center my-3">
                <small>Dont have Acount </small><Link to="/auth">Register</Link>
            </div>
        </div>
    </div>
    </>
  )
}

export default ForgotPassword
