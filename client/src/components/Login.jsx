import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from '../googleAuthApi';
import * as GlobalUrls from "../GlobalURL"
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [Credentials, setCredentials] = useState({
        Email: "",
        Password: "",
    });

    const handleFormSumbit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { Email, Password } = Credentials;

            // Validate if email or password not ennter
            if (!Email || !Password) {
                setLoading(false);
                toast.warning("All fields are required !", {
                    position: "top-right"
                });
            } else {
                const response = await fetch(`${GlobalUrls.LOGIN_URL}`, { //call server api 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Email,
                        Password,
                    }),
                });

                const result = await response.json(); // get response from server

                // If successfully logged in, store token and navigate
                if (result.success === true) {
                    setLoading(false);
                    localStorage.setItem("token", result.token)
                    localStorage.setItem("userRole", result.user.Role);
                    localStorage.setItem("userExmeeUserId", result.user.ExmeeUserId);
                    navigate("/");
                    toast.success("You're now logged in !", {
                        position: "top-right"
                    });
                } else if (result.success === false) { // if any error from the server
                    setLoading(false);
                    toast.error(result.message, {
                        position: "top-right"
                    });
                }
            }
        } catch (error) { // if any error during the form sumbit
            console.error("Login error:", error.message);
            setLoading(false);
            toast.error("Login error", {
                position: "top-right"
            });
        }
        setLoading(false);
    };

    const handlOnchange = (e) => {
        setCredentials({ ...Credentials, [e.target.name]: e.target.value });
    };

    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };


    //=================================== [ Google Authentication] ============================================
    const responseGoogle = async (authResult) => {
        try {
            if (authResult['code']) {
                const result = await googleAuth(authResult['code']);

                const { Profile, Role, ExmeeUserId } = result.data.user;
                const token = result.data.token;

                localStorage.setItem("token", token);
                localStorage.setItem("Profile", Profile);
                localStorage.setItem("userRole", Role);
                localStorage.setItem("userExmeeUserId", ExmeeUserId);

                if (result.data.success === true) {
                    navigate('/');
                    toast.success("You're now logged in !", {
                        position: "top-right"
                    });
                } else if (result.data.success === false) {
                    toast.error("Something went wrong. Please try again later !", {
                        position: "top-right"
                    });
                }
            }

        } catch (error) {
            console.error("Error while requesting google to code :", error);
            toast.error("Error while requesting google to code ", {
                position: "top-right"
            });
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
                <div className="form-containe col-12 col-lg-5 shadow rounded-4 py-4 px-4 p-md-5 my-3 Login">

                    {/* <!-- Login Heading --> */}
                    <div className='mb-4'>
                        <h4 className="text-start fw-bold mb-1">Login</h4>
                        <p className='text-secondary'>to continue to Examee</p>
                    </div>

                    {loading && (
                        <div className="text-center">
                            <div className="spinner-border mb-4" role="status"></div>
                        </div>
                    )}

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
                            <div className="mb-3 position-relative">
                                <div className='d-flex justify-content-between'>
                                    <small><label htmlFor="password" className="form-label ">Password</label></small>
                                    <small><Link to="/forgotPassword" className='nav-link fw-normal text-primary'>Forgot Password?</Link></small>
                                </div>
                                <input type={showPassword ? 'text' : 'password'}
                                    className="form-control" id="Password" name='Password' value={Credentials.Password} onChange={handlOnchange} placeholder="Enter your password" />
                                <span onClick={toggleShowPassword}
                                    style={{ position: 'absolute', top: '34px', right: '12px', cursor: 'pointer' }} >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-green w-100">Login</button>
                    </form>

                </div>
            </div>
        </>
    )
}

export default Login
