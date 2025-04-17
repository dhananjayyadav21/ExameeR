import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from '../googleAuthApi';
import * as GlobalUrls from "../GlobalURL"
import { toast } from "react-toastify";

const Register = () => {
    const navigate = useNavigate();

    const [Credentials, setCredentials] = useState({ // create state for form data
        Username:"",
        Email: "",
        Password: "",
        ConfirmPassword:""
    });
    
    const handleFormSumbit = async (e) => {
        e.preventDefault();

        try {
            const { Username, Email, Password, ConfirmPassword } = Credentials;
        
            if (!Username || !Email || !Password) { // check all fields enter
                toast.error("All fields are required !", {
                    position: "top-right"
                });
            } 
            else if (Password !== ConfirmPassword) { // comapare password and confirmpassword
                toast.error("Password & Confirm Password must be same !", {
                    position: "top-right"
                });
            } 
            else {
                const response = await fetch(`${GlobalUrls.REGISTER_URL}`, { // server api call 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Username,
                        Email,
                        Password,
                    }),
                });
        
                const result = await response.json(); // result from server
        
                // If successfully registered, navigate to verify email page
                if (result.success === true) {
                    navigate(`/verifyEmail?Email=${result.user.Email}`);
                    toast.success("Register successfully !", {
                        position: "top-right"
                    });
                } else if (result.success === false) { // if any error acoured from server
                    toast.error(result.message
                        , {
                        position: "top-right"
                    });
                }
            }
            }catch (error) { // if any error during the form sumbit 
            console.error(error.message);
            toast.error("Error while verify !", {
                position: "top-right"
            });
        }
    };    
    
    const handlOnchange = (e) => {
        setCredentials({ ...Credentials, [e.target.name]: e.target.value });
    };

    //======================================= [ Google Authentication] ===============================================
    const responseGoogle = async (authResult)=>{
        try {
            if(authResult['code']){
                const result = await googleAuth(authResult['code']);

                const {Username, Email, Profile} = result.data.user;
                const token = result.data.token;

                // eslint-disable-next-line
                const userObj = {Username, Email, Profile};
                // localStorage.setItem("user-info",JSON.stringify(userObj));
                localStorage.setItem("token",token);
                localStorage.setItem("user", Email);
                localStorage.setItem("Profile",Profile);
                
                // If successfully logged in, store token and navigate
                if(result.data.success === true){
                    navigate('/');
                    toast.success("You're now logged in !", {
                        position: "top-right"
                    });
                }else if(result.data.success === false){ // if error from google authentication
                    toast.error("Something went wrong. Please try again later !", {
                        position: "top-right"
                    });
                }   
            }

          } catch (error) {
            console.error("Error while requesting google to code :",error);
            toast.error("Error while requesting google to code  !", {
                position: "top-right"
            });
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess:responseGoogle,
        onError:responseGoogle,
        flow: 'auth-code'
    })

  return (
    <>
      <div className="container d-flex justify-content-center align-self-center px-3 mt-2">
        <div className="form-containe col-12 col-lg-5 shadow rounded-4 py-4 px-4 p-md-5 mt-3 Register">

            {/* <!-- Register Header --> */}
            <div className='mb-4'>
                <h4 className="text-start mb-1 fw-bold">Register</h4>
                 <p className='text-secondary'>to continue to Examee</p>
            </div>

            {/* <!-- Google Register Button --> */}
            <div className="d-grid">
                <button className="btn btn-light border" onClick={googleLogin}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Icon" className="me-2"  style={{width:"20px"}}/>
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
                            <small><label htmlFor="username" className="form-label">Username</label></small>
                            <input type="text" className="form-control" id="Username" name='Username' value={Credentials.Username} onChange={handlOnchange} placeholder="Enter your username"/>
                        </div>
                    </div>
                    <div className='col-12 col-md-6'>
                        <div className="mb-3">
                            <small><label htmlFor="email" className="form-label">Email</label></small>
                            <input type="email" className="form-control" id="Email" name='Email' value={Credentials.Email} onChange={handlOnchange} placeholder="Enter your email"/>
                        </div>
                    </div>
                    <div className='col-12 col-md-6'>
                        <div className="mb-3">
                            <small><label htmlFor="password" className="form-label">Password</label></small>
                            <input type="password" className="form-control" id="Password" name='Password' value={Credentials.Password} onChange={handlOnchange} placeholder="Enter your password"/>
                        </div>
                    </div>
                    <div className='col-12 col-md-6'>
                        <div className="mb-3">
                            <small><label htmlFor="confirmPassword" className="form-label">Confirm Password</label></small>
                            <input type="password" className="form-control" id="ConfirmPassword" name='ConfirmPassword' value={Credentials.ConfirmPassword} onChange={handlOnchange}  placeholder="Re-enter your password"/>
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
