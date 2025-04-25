import React, { useState, useEffect } from 'react'
import Login from '../components/Login'
import Register from '../components/Register'

const Auth = ({setProgress}) => {

  //----[useEffect]---------
  useEffect(() => {
    setProgress(0);
    setProgress(100);
    // eslint-disable-next-line
  }, []);

  const [LoginDisplay, setLoginDisplay] = useState({ D: "none", TextColor: "#000000", BackgroundColorColor: "#ffffff" });
  const [RegisterDisplay, setRegisterDisplay] = useState({ D: "", TextColor: "#04bd20", BackgroundColorColor: "#f8f9fa" });

  const openLogin = () => {
    setLoginDisplay({ D: "", TextColor: "#04bd20", BackgroundColorColor: "#f8f9fa" });
    setRegisterDisplay({ D: "none", TextColor: "#000000", BackgroundColorColor: "#ffffff" });
  }

  const openRegister = () => {
    setRegisterDisplay({ D: "", TextColor: "#04bd20", BackgroundColorColor: "#f8f9fa" });
    setLoginDisplay({ D: "none", TextColor: "#000000", BackgroundColorColor: "#ffffff" });
  }

  return (
    <>
      <div className="container">
        <div className="Auth-header shadow-sm col-12 col-lg-5 container d-flex justify-content-center align-self-center gap-3 py-2 px-3 mt-5 rounded-3">
          <button className="col-6 btn rounded-2" style={{ color: RegisterDisplay.TextColor, backgroundColor: RegisterDisplay.BackgroundColorColor }} onClick={openRegister}>REGISTER</button>
          <button className="col-6 btn rounded-2" style={{ color: LoginDisplay.TextColor, backgroundColor: LoginDisplay.BackgroundColorColor }} onClick={openLogin} >LOGIN</button>
        </div>
      </div>

      <div className={`d-${LoginDisplay.D}`}>
        <Login />
      </div>

      <div className={`d-${RegisterDisplay.D}`}>
        <Register />
      </div>
    </>
  )
}

export default Auth
