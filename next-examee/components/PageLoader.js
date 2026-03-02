"use client";

import React from "react";

const PageLoader = ({ text = "Loading content...", subtext = "Please wait a moment" }) => {
    return (
        <div className="global-loader-overlay">
            <div className="loader-container text-center">
                <div className="spinner-wrapper" style={{ position: "relative", width: "60px", height: "60px", margin: "0 auto", marginBottom: "8px" }}>
                    <div className="premium-spinner" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}></div>
                    <i className="fa-solid fa-graduation-cap" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#04bd20", fontSize: "1.2rem" }}></i>
                </div>
                <div className="loader-text mt-3">
                    <h5 className="mb-1">{text}</h5>
                    <p className="mb-0">{subtext}</p>
                </div>
            </div>
        </div>
    );
};

export default PageLoader;
