import React from 'react'

const Login = () => {
  return (
    <>
     <div class="container d-flex justify-content-center align-self-center mt-2">
        <div class="form-containe col-12 col-md-7 shadow rounded-2 rounded-md-4 py-4 px-3 p-md-5 mt-3">
            <h3 class="text-start mb-4">LOGIN</h3>
            
            {/* <!-- LOGIN Form --> */}
            <form>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" placeholder="Enter your email" required/>
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Enter your password" required/>
                </div>

                <button type="submit" class="btn btn-green w-100">LOGIN</button>
            </form>

            <div class="text-center my-3">
                <small>or</small>
            </div>

            {/* <!-- Google Register Button --> */}
            <div class="d-grid">
                <button class="btn btn-light border">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Icon" class="me-2"  style={{width:"20px"}}/>
                    Login with Google
                </button>
            </div>
        </div>
    </div>
    </>
  )
}

export default Login
