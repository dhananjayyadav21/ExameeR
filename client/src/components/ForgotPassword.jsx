import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import * as GlobalUrls from "../GlobalURL"
import { toast } from "react-toastify";

const ForgotPassword = ({setProgress}) => {

    //----[useEffect]---------
    useEffect(() => {
        setProgress(0);
        setProgress(100);
        // eslint-disable-next-line
    }, []);

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [Email, setEmail] = useState("");

    const handleFogotPasswordEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // validate email 
            if (!Email) {
                setLoading(false);
                toast.error("Please fill out email fields !", {
                    position: "top-right"
                });
            } else {
                const response = await fetch(`${GlobalUrls.FOGOTCODE_URL}`, { // call server api
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Email: Email }),
                });

                localStorage.setItem("FogotEmail", Email);
                const result = await response.json(); // response from server

                // If successfully code send, and navigate
                if (result.success === true) {
                    setLoading(false);
                    toast.success("Verification code sent to your email!", {
                        position: "top-right"
                    });
                } else if (result.success === false) { // if error acoured from server
                    setLoading(false);
                    toast.error(result.message || 'Verification Code failed.'
                        , {
                            position: "top-right"
                        });
                }
            }
        } catch (error) { // if any error during the form sumbit
            setLoading(false);
            console.error('FogotPasswordEmail error:', error);
            toast.error('An error occurred during FogotPassword when sending email code.'
                , {
                    position: "top-right"
                });
        }
        setLoading(false);
    }

    //======================================== [Password reset] =================================
    const [ForgotPasswordData, setForgotPassword] = useState({ // create state for form data
        ForgotPasswordCode: "",
        NewPassword: "",
        ConfirmNewPassword: ""
    });

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { ForgotPasswordCode, NewPassword, ConfirmNewPassword } = ForgotPasswordData;

            // Validate if email or password 
            if (!ForgotPasswordCode || !NewPassword || !ConfirmNewPassword) {
                setLoading(false);
                toast.error("Please fill out all fields !", {
                    position: "top-right"
                });
            } else if (NewPassword !== ConfirmNewPassword) { // compare password or confirmpassword
                setLoading(false);
                toast.error("NewPassword and ConfirmPassword do not match!", {
                    position: "top-right"
                });
            } else {
                const response = await fetch(`${GlobalUrls.FOGOTPASSWORD_URL}`, { //call server api 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Email: localStorage.getItem("FogotEmail"), ForgotPasswordCode: ForgotPasswordCode, NewPassword: NewPassword, ConfirmNewPassword: ConfirmNewPassword }),
                });

                const result = await response.json();  // get response from server

                // If successfully reset password, and navigate
                if (result.success === true) {
                    setLoading(false);
                    toast.success(result.message || "Password reset successfully !", {
                        position: "top-right"
                    });
                    navigate('/login');
                } else if (result.success === false) { // if error acoured from server
                    setLoading(false);
                    toast.error(result.message || 'Password reseting failed.'
                        , {
                            position: "top-right"
                        });
                }
            }
        } catch (error) { // if any error during the form sumbit
            setLoading(false);
            console.error('FogotPassword error:', error);
            toast.error('An error occurred during FogotPassword when sumbiting data.'
                , {
                    position: "top-right"
                });
        }
        setLoading(false);
    }

    const handlOnchange = (e) => {
        setForgotPassword({ ...ForgotPasswordData, [e.target.name]: e.target.value });
    };


    return (
        <>
            <div className="container d-flex justify-content-center align-self-center my-3">
                <div className="form-containe col-12 col-md-5 shadow rounded-4 py-4 px-3 p-md-5 mt-3 ForgotPass">
                    <h4 className="text-start mb-4">Forgot Password?</h4>

                    <form onSubmit={handleFogotPasswordEmail}>
                        <div className="mb-3">
                            <small><label htmlFor="email" className="form-label">Email</label></small>
                            <input type="email" className="form-control" id="email" name='FogotPasswordEmail' value={Email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                        </div>

                        <button type="submit" className="btn btn-light w-100 mb-3">Get Verification Code</button>
                    </form>

                    {loading && (
                        <div className="text-center">
                            <div className="spinner-border mt-2" role="status"></div>
                        </div>
                    )}

                    <form onSubmit={handleForgotPassword}>
                        <div className='text-secondary my-4'>
                            <p className='fw-normal m-0'>Get Verification code</p>
                            <p className='fw-normal m-0'>Enter the code sent to your email address</p>
                        </div>

                        <div className="mb-3">
                            <small><label htmlFor="vcode" className="form-label">Verification Code</label></small>
                            <input type="number" className="form-control" id="vcode" name='ForgotPasswordCode' value={ForgotPasswordData.ForgotPasswordCode} onChange={handlOnchange} placeholder="Enter Verification Code" required />
                        </div>

                        <div className="mb-3">
                            <small><label htmlFor="password" className="form-label">New Password</label></small>
                            <input type="password" className="form-control" id="NewPassword" name='NewPassword' value={ForgotPasswordData.NewPassword} onChange={handlOnchange} placeholder="password" required />
                        </div>

                        <div className="mb-3">
                            <small><label htmlFor="Cpassword" className="form-label">Confirm Password</label></small>
                            <input type="password" className="form-control" id="ConfirmNewPassword" name='ConfirmNewPassword' value={ForgotPasswordData.ConfirmNewPassword} onChange={handlOnchange} placeholder="Confirm password" required />
                        </div>

                        <button type="submit" className="btn btn-green w-100">Save Password</button>
                    </form>

                    <div className="my-3">
                        <small>Dont have Acount </small><Link to="/auth">Register</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword
