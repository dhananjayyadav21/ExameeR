import React,{useState} from 'react'
import { useSearchParams,useNavigate } from 'react-router-dom';
import * as GlobalUrls from "../GlobalURL"
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const Email = searchParams.get('Email');
  const VerificationCodeParams = searchParams.get('VerificationCode');

  const [VerificationCode, setVerificationCode] = useState("" || VerificationCodeParams);

  const handleFormSumbit = async (e) => {
    e.preventDefault();

    try {
        if (!VerificationCode) {
          toast.error("VerificationCode required !", {
              position: "top-right"
          });
        }else{
          const response = await fetch(`${GlobalUrls.VERIFY_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Email: Email, VerificationCode: VerificationCode }),
          });

          const result = await response.json();

          // console.log("verifydata--------",result);

          if (result.success === true) {
            toast.success("Email verified successfully!", {
                position: "top-right"
            });
            navigate("/login");
          } else if (result.success === false) {
            toast.error(result.message ||'Verification failed.'
                , {
                position: "top-right"
            });
          }
        } 
    } catch (error) {
        console.error('Verification error:', error);
        toast.error('An error occurred during verification.'
          , {
          position: "top-right"
      });
    }
};

  return (
    <>
      <div className="container d-flex justify-content-center align-self-center my-5 px-3">
        <div className="form-containe col-12 col-md-5 shadow-sm rounded-4 rounded-md-5 py-4 px-3 p-md-5 mt-5 VerifyEmail bg-light VerifyEmail">
            <h3 className="text-start mb-4">Verify Email</h3>

            <input type="email" className="form-control rounded-4 mb-5 w-50" id="email" value={Email} placeholder="Verification@Code.com" readOnly/>       
   
            <div className='text-secondary my-4'>
               <p className='m-0'>Verification code</p>
               <p className='m-0'>Enter the code sent to your email address</p>
            </div>

            {/* <!-- Verify Email Form --> */}
            <form onSubmit={handleFormSumbit} >
                <div className="mb-3">
                    <small><label htmlFor="vcode" className="form-label">Verification Code</label></small> 
                    <input type="text" className="form-control" id="VerificationCode" value={VerificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)} placeholder="Enter Verification Code"/>
                </div>

                <button type="submit" className="btn btn-green w-100">CONTINUE</button>
            </form>
        </div>
    </div>
    </>
  )
}

export default VerifyEmail
