import React from 'react'

const VerifyEmail = () => {
  return (
    <>
      <div className="container d-flex justify-content-center align-self-center my-5 px-3">
        <div className="form-containe col-12 col-md-5 shadow-sm rounded-4 rounded-md-5 py-4 px-3 p-md-5 mt-5 VerifyEmail bg-light VerifyEmail">
            <h3 className="text-start mb-4">Verify Email</h3>

            <input type="email" className="form-control rounded-4 mb-5 w-50" id="email" placeholder="Verification@Code.com" readOnly/>       
   
            <div className='text-secondary my-4'>
               <p className='m-0'>Verification code</p>
               <p className='m-0'>Enter the code sent to your email address</p>
            </div>

            {/* <!-- Verify Email Form --> */}
            <form noValidate>
                <div className="mb-3">
                    <small><label htmlFor="vcode" className="form-label">Verification Code</label></small> 
                    <input type="number" className="form-control" id="vcode" placeholder="Enter Verification Code"/>
                </div>

                <button type="submit" className="btn btn-green w-100">CONTINUE</button>
            </form>
        </div>
    </div>
    </>
  )
}

export default VerifyEmail
