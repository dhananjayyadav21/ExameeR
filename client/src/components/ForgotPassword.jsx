import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom';
import * as GlobalUrls from "../GlobalURL"
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [Email, setEmail] = useState("");

    const handleFogotPasswordEmail = async(e)=>{
        e.preventDefault();

        try {
            // validate email 
            if (!Email) {
                toast.error("Please fill out email fields !", {
                    position: "top-right"
                });
            }else{
                const response = await fetch(`${GlobalUrls.FOGOTCODE_URL}`, { // call server api
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Email: Email}),
                });
    
                localStorage.setItem("FogotEmail",Email);
                const result = await response.json(); // response from server
    
                // If successfully code send, and navigate
                if (result.success === true) {
                toast.success("Verification code sent to your email!", {
                    position: "top-right"
                });
                } else if (result.success === false) { // if error acoured from server
                toast.error(result.message ||'Verification Code failed.'
                    , {
                    position: "top-right"
                });
                }
            } 
        } catch (error) { // if any error during the form sumbit
            console.error('FogotPasswordEmail error:', error);
            toast.error('An error occurred during FogotPassword when sending email code.'
                , {
                position: "top-right"
            });
        }
    }

    //======================================== [Password reset] =================================
    const [ForgotPasswordData, setForgotPassword] = useState({ // create state for form data
        ForgotPasswordCode:"",
        NewPassword:"",
        ConfirmNewPassword:""
    });

    const handleForgotPassword = async(e) =>{
        e.preventDefault();
        
        try {
            const {ForgotPasswordCode, NewPassword, ConfirmNewPassword} = ForgotPasswordData;

            console.log("formfogo=====",ForgotPasswordData)
            
            // Validate if email or password 
            if (!ForgotPasswordCode || !NewPassword || !ConfirmNewPassword) {
                toast.error("Please fill out all fields !", {
                    position: "top-right"
                });
            }else if(NewPassword !== ConfirmNewPassword) { // compare password or confirmpassword
                toast.error("NewPassword and ConfirmPassword do not match!", {
                    position: "top-right"
                });
            }else{
                const response = await fetch(`${GlobalUrls.FOGOTPASSWORD_URL}`, { //call server api 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Email:localStorage.getItem("FogotEmail"), ForgotPasswordCode:ForgotPasswordCode, NewPassword:NewPassword, ConfirmNewPassword:ConfirmNewPassword }),
                });
    
                const result = await response.json();  // get response from server
                console.log(result)
               
                // If successfully reset password, and navigate
                if (result.success === true) {
                toast.success( result.message || "Password reset successfully !", {
                    position: "top-right"
                });
                navigate('/login');
                } else if (result.success === false) { // if error acoured from server
                toast.error(result.message ||'Password reseting failed.'
                    , {
                    position: "top-right"
                });
                }
            } 
        } catch (error) { // if any error during the form sumbit
            console.error('FogotPassword error:', error);
            toast.error('An error occurred during FogotPassword when sumbiting data.'
                , {
                position: "top-right"
            });
        }
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
                    <input type="email" className="form-control" id="email" name='FogotPasswordEmail' value={Email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"/>
                </div>

                <button type="submit" className="btn btn-light w-100 mb-3">Get Verification Code</button> 
            </form>    
             
            <form onSubmit={handleForgotPassword}>
                <div className='text-secondary my-4'>
                    <p className='fw-normal m-0'>Get Verification code</p>
                    <p className='fw-normal m-0'>Enter the code sent to your email address</p> 
                </div>

                <div className="mb-3">
                    <small><label htmlFor="vcode" className="form-label">Verification Code</label></small> 
                    <input type="number" className="form-control" id="vcode" name='ForgotPasswordCode' value={ForgotPasswordData.ForgotPasswordCode} onChange={handlOnchange} placeholder="Enter Verification Code" required/>
                </div>

                <div className="mb-3">
                    <small><label htmlFor="password" className="form-label">New Password</label></small> 
                    <input type="password" className="form-control" id="NewPassword" name='NewPassword' value={ForgotPasswordData.NewPassword} onChange={handlOnchange} placeholder="password" required/>
                </div>

                <div className="mb-3">
                    <small><label htmlFor="Cpassword" className="form-label">Confirm Password</label></small>
                    <input type="password" className="form-control" id="ConfirmNewPassword" name='ConfirmNewPassword' value={ForgotPasswordData.ConfirmNewPassword} onChange={handlOnchange} placeholder="Confirm password" required/>
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
