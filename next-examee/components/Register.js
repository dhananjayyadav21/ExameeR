"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from '../utils/googleAuthApi';
import * as GlobalUrls from "../utils/GlobalURL"
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [Credentials, setCredentials] = useState({
        Username: "",
        Email: "",
        Password: "",
        ConfirmPassword: ""
    });

    const handleFormSumbit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { Username, Email, Password, ConfirmPassword } = Credentials;

            if (!Username || !Email || !Password) {
                setLoading(false);
                toast.error("All fields are required !", {
                    position: "top-right"
                });
            }
            else if (Password !== ConfirmPassword) {
                setLoading(false);
                toast.error("Password & Confirm Password must be same !", {
                    position: "top-right"
                });
            } else {
                const response = await fetch(`${GlobalUrls.REGISTER_URL}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Username,
                        Email,
                        Password,
                        ConfirmPassword
                    }),
                });

                const result = await response.json();

                if (result.success === true) {
                    setLoading(false);
                    router.push(`/verify-email?Email=${result.user.Email}`);
                    toast.success("Register successfully !", {
                        position: "top-right"
                    });
                } else {
                    setLoading(false);
                    toast.error(result.message, {
                        position: "top-right"
                    });
                }
            }
        } catch (error) {
            setLoading(false);
            console.error(error.message);
            toast.error("Error while register !", {
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

    //======================================= [ Google Authentication] ===============================================
    const responseGoogle = async (authResult) => {
        try {
            if (authResult['code']) {
                const result = await googleAuth(authResult['code']);

                if (result.data.success === true) {
                    const { Profile, Role, ExmeeUserId } = result.data.user;
                    const token = result.data.token;

                    localStorage.setItem("token", token);
                    localStorage.setItem("Profile", Profile);
                    localStorage.setItem("userRole", Role);
                    localStorage.setItem("userExmeeUserId", ExmeeUserId);

                    window.location.href = '/';
                    toast.success("You're now logged in !", {
                        position: "top-right"
                    });
                } else {
                    toast.error("Something went wrong. Please try again later !", {
                        position: "top-right"
                    });
                }
            }

        } catch (error) {
            console.error("Error while requesting google to code :", error);
            toast.error("Error while requesting google to code  !", {
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
            <div className="container d-flex justify-content-center align-self-center px-3 mt-2">
                <div className="form-containe col-12 col-lg-5 shadow rounded-4 py-4 px-4 p-md-5 my-3 Register">

                    {/* <!-- Register Header --> */}
                    <div className='mb-4'>
                        <h4 className="text-start mb-1 fw-bold">Register</h4>
                        <p className='text-secondary'>to continue to Examee</p>
                    </div>

                    {loading && (
                        <div className="text-center">
                            <div className="spinner-border mb-4" role="status"></div>
                        </div>
                    )}

                    {/* <!-- Google Register Button --> */}
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

                    {/* <!-- Register Form --> */}
                    <form onSubmit={handleFormSumbit}>
                        <div className='row'>
                            <div className='col-12 col-md-6'>
                                <div className="mb-3">
                                    <small><label htmlFor="Username" className="form-label">Username</label></small>
                                    <input type="text" className="form-control" id="Username" name='Username' value={Credentials.Username} onChange={handlOnchange} placeholder="Enter your username" />
                                </div>
                            </div>
                            <div className='col-12 col-md-6'>
                                <div className="mb-3">
                                    <small><label htmlFor="Email" className="form-label">Email</label></small>
                                    <input type="email" className="form-control" id="Email" name='Email' value={Credentials.Email} onChange={handlOnchange} placeholder="Enter your email" />
                                </div>
                            </div>
                            <div className='col-12 col-md-6'>
                                <div className="mb-3 position-relative">
                                    <div className="mb-3">
                                        <small><label htmlFor="Password" className="form-label">Password</label></small>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            id="Password"
                                            name='Password'
                                            value={Credentials.Password}
                                            onChange={handlOnchange}
                                            placeholder="Enter your password"
                                        />
                                        <span onClick={toggleShowPassword}
                                            style={{ position: 'absolute', top: '36px', right: '12px', cursor: 'pointer' }} >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 col-md-6'>
                                <div className="mb-3 position-relative">
                                    <div className="mb-3">
                                        <small><label htmlFor="ConfirmPassword" className="form-label">Confirm Password</label></small>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            id="ConfirmPassword"
                                            name='ConfirmPassword'
                                            value={Credentials.ConfirmPassword}
                                            onChange={handlOnchange}
                                            placeholder="Re-enter password"
                                        />
                                        <span onClick={toggleShowPassword}
                                            style={{ position: 'absolute', top: '36px', right: '12px', cursor: 'pointer' }}>{showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-green w-100">Register</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register
