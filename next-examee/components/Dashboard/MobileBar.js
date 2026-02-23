"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";

function MobileMenuButton() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className="dashbord-mobilebar-btn position-fixed" style={{ bottom: '20px', right: '20px', zIndex: 1060 }}>
                <button
                    type="button"
                    className="btn btn-primary shadow-lg rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '56px', height: '56px' }}
                    onClick={toggleMenu}>
                    <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} fs-4`}></i>
                </button>
            </div>

            {isOpen && (
                <div className="dashbord-mobilebar position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={toggleMenu}>
                    <div className="bg-white h-100 shadow" style={{ width: '280px' }} onClick={(e) => e.stopPropagation()}>
                        <Sidebar />
                    </div>
                </div>
            )}
        </>
    );
}

export default MobileMenuButton;
