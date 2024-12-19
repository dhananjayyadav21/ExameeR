import React from 'react'

const VerifyEmail = () => {
  return (
    <>
      <div className="container d-flex justify-content-center align-self-center my-5">
        <div className="form-containe col-12 col-md-7 shadow rounded-3 rounded-md-5 py-4 px-3 p-md-5 mt-5">
            <h3 className="text-start mb-4">VERIFY EMAIL</h3>
            
            {/* <!-- Verify Email Form --> */}
            <form>
                <div className="mb-3">
                    <label htmlFor="vcode" className="form-label">Verification Code</label>
                    <input type="number" className="form-control" id="vcode" placeholder="Enter Verification Code" required/>
                </div>

                <button type="submit" className="btn btn-green w-100">Save</button>
            </form>
        </div>
    </div>
    </>
  )
}

export default VerifyEmail
