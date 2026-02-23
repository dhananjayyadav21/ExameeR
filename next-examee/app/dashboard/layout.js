"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Dashboard/Sidebar";
import MobileBar from "../../components/Dashboard/MobileBar";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const userRole = typeof window !== 'undefined' && localStorage.getItem("userRole");
        const allowedRoles = ["Admin", "Instructor"];

        if (!userRole || !allowedRoles.includes(userRole)) {
            router.push("/");
        } else {
            setIsAuthorized(true);
        }
    }, []);

    if (!isAuthorized) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid bg-light" style={{ minHeight: '100vh' }}>
            <div className="row">
                <div className="col-lg-2 d-none d-lg-block p-0 position-sticky top-0" style={{ height: '100vh' }}>
                    <Sidebar />
                </div>
                <div className="col-12 col-lg-10 p-0">
                    <div className="p-3 p-md-4">
                        {children}
                    </div>
                </div>
            </div>
            <div className="d-lg-none">
                <MobileBar />
            </div>
        </div>
    );
}
