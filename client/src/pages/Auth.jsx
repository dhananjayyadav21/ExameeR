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
        <div className="Auth-header shadow-sm col-12 col-md-5 container d-flex justify-content-center align-self-center gap-3 py-2 px-3 mt-5 rounded-3">
            <button className="col-6 btn rounded-2" onClick={openRegister}>REGISTER</button>
            <button className='col-6 btn rounded-2' onClick={openLogin} >LOGIN</button>
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
