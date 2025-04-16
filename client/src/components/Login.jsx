import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from '../googleAuthApi';
import * as GlobalUrls from "../GlobalURL"
import { toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate();

    const [Credentials, setCredentials] = useState({
        Email: "",
        Password: "",
    });

    const handleFormSumbit = async (e) => {
        e.preventDefault();

        try {
            const { Email, Password } = Credentials;
        
            if (!Email || !Password) {
                toast.warning("All fields are required !", {
                    position: "top-right"
                });
            } else {
                const response = await fetch(`${GlobalUrls.LOGIN_URL}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Email,
                        Password,
                    }),
                });
        
                const result = await response.json();
                console.log(result);
                console.log(result.success);
        
                // If successfully logged in, store token and navigate
                if (result.success === true) {
                    localStorage.setItem("token",result.token)
                    console.log(result.token)
                    navigate("/");
                    toast.success("You're now logged in !", {
                        position: "top-right"
                    });
                } else {
                    alert("");
                    toast.warning("Please try with the correct credentials !", {
                        position: "top-right"
                    });
                }
            }
        } catch (error) {
            console.error("Login error:", error.message);
        }
        
    };

    const handlOnchange = (e) => {
        setCredentials({ ...Credentials, [e.target.name]: e.target.value });
    };

    //============================================== [ Google Authentication] ================================================
    const responseGoogle = async (authResult) => {
        try {
            if (authResult['code']) {
                const result = await googleAuth(authResult['code']);

                const { Username, Email, Profile } = result.data.user;
                const token = result.data.token;

                const userObj = { Username, Email, Profile };
                localStorage.setItem("user-info", JSON.stringify(userObj));
                localStorage.setItem("token", token);

                if(result.data.success === true){
                    navigate('/');
                    toast.success("You're now logged in !", {
                        position: "top-right"
                    });
                }else if(result.data.success === false){
                    toast.error("Something went wrong. Please try again later !", {
                        position: "top-right"
                    });
                } 
            }

        } catch (error) {
            console.error("Error while requesting google to code :", error);
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code'
    })

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
                        <button className="btn btn-light border" onClick={googleLogin}>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Icon" className="me-2" style={{ width: "20px" }} />
                            Login with Google
                        </button>
                    </div>

                    {/* <!-- Divider --> */}
                    <div className="text-center my-3">
                        <small>or</small>
                    </div>

                    {/* <!-- LOGIN Form --> */}
                    <form onSubmit={handleFormSumbit}>
                        <div className="mb-3">
                            <small><label htmlFor="email" className="form-label">Email</label></small>
                            <input type="email" className="form-control" id="Email" name='Email' value={Credentials.Email} onChange={handlOnchange} placeholder="Enter your email" />
                        </div>

                        <div className="mb-3">
                            <div className='d-flex justify-content-between'>
                                <small><label htmlFor="password" className="form-label ">Password</label></small>
                                <small><Link to="/forgotPassword" className='nav-link fw-normal text-primary'>Forgot Password?</Link></small>
                            </div>
                            <input type="password" className="form-control" id="Password" name='Password' value={Credentials.Password} onChange={handlOnchange} placeholder="Enter your password" />
                        </div>

                        <button type="submit" className="btn btn-green w-100">Login</button>
                    </form>

                </div>
            </div>
        </>
    )
}

export default Login
