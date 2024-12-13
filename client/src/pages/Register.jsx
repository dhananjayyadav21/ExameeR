import React from 'react'

const Register = () => {
  return (
    <>
       <div class="container">
        <div class="form-container col-6 align-self-center border border-2 rounded-4 p-5">
            <h3 class="text-center mb-4">Register</h3>
            {/* <!-- Register Form --> */}
            <form>
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="username" placeholder="Enter your username" required/>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" placeholder="Enter your email" required/>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Enter your password" required/>
                </div>
                <div class="mb-3">
                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="confirmPassword" placeholder="Re-enter your password" required/>
                </div>
                <button type="submit" class="btn btn-primary w-100">Register</button>
            </form>
            <div class="text-center my-3">
                <small>or</small>
            </div>
            {/* <!-- Google Register Button --> */}
            <div class="d-grid">
                <button class="btn btn-light border">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Icon" class="me-2"  style={{width:"20px"}}/>
                    Register with Google
                </button>
            </div>
            <div class="text-center mt-3">
                <small>Already have an account? <a href="/login">Login</a></small>
            </div>
        </div>
    </div>
    </>
  )
}

export default Register
