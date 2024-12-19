import React, { useState } from 'react'
import Login from '../components/Login'
import Register from '../components/Register'

const Auth = () => {

    const [LoginDisplay, setLoginDisplay] = useState("none");
    const [RegisterDisplay, setRegisterDisplay] = useState("");

    const openLogin = ()=>{
        setLoginDisplay("");
        setRegisterDisplay("none");
    }

    const openRegister = ()=>{
        setRegisterDisplay("");
        setLoginDisplay("none");
    }

  return (
    <> 
        
        <div className="container">
        <div className="Auth-header col-12 col-md-7 container d-flex justify-content-center align-self-center gap-3 py-2 px-3 mt-4 mt-md-5 rounded-3">
            <button className="col-6 btn btn-light" onClick={openLogin}>LOGIN</button>
            <button className='col-6  btn btn-light' onClick={openRegister}>REGISTER</button>
        </div>
        </div>
        
        <div className={`d-${LoginDisplay}`}> 
        <Login/>
        </div>
           
        <div className={`d-${RegisterDisplay}`}> 
          <Register/>
        </div>
    </>
  )
}

export default Auth
