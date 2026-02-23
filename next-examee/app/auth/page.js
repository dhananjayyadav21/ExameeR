"use client";
import React, { useState, useEffect } from 'react'
import Login from '../../components/Login'
import Register from '../../components/Register'

export default function AuthPage({ setProgress = () => { } }) {
    useEffect(() => {
        setProgress(0);
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
        <main>
            <div className="container">
                <div className="Auth-header shadow-sm col-12 col-lg-5 container d-flex justify-content-center align-self-center gap-3 py-2 px-3 mt-5 rounded-3">
                    <button className="col-6 btn rounded-2" style={{ color: RegisterDisplay.TextColor, backgroundColor: RegisterDisplay.BackgroundColorColor }} onClick={openRegister}>REGISTER</button>
                    <button className="col-6 btn rounded-2" style={{ color: LoginDisplay.TextColor, backgroundColor: LoginDisplay.BackgroundColorColor }} onClick={openLogin} >LOGIN</button>
                </div>
            </div>

            <div className={LoginDisplay.D === "none" ? "d-none" : "d-block"}>
                <Login />
            </div>

            <div className={RegisterDisplay.D === "none" ? "d-none" : "d-block"}>
                <Register />
            </div>
        </main>
    )
}
