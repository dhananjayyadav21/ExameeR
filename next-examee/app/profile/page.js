"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as GlobalUrls from "../../utils/GlobalURL"
import Footer from "../../components/Footer";

export default function ProfilePage({ setProgress = () => { } }) {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        setProgress(0);
        const token = typeof window !== 'undefined' && localStorage.getItem("token");
        if (token) {
            getUser(token);
        } else {
            router.push("/auth");
        }
        setProgress(100);
    }, []);

    const getUser = async (token) => {
        try {
            const response = await fetch(`${GlobalUrls.GETUSER_URL}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "AuthToken": token
                },
            });
            const result = await response.json();
            if (result.success) {
                setUser(result.user);
            } else {
                console.error("Failed to fetch user:", result.message);
            }
        } catch (error) {
            console.error("getUser error:", error.message);
        }
    }

    const profileImage = typeof window !== 'undefined' && localStorage.getItem("Profile") && localStorage.getItem("Profile") !== "undefined"
        ? localStorage.getItem("Profile")
        : "/assets/img/Avtar.jpg";

    return (
        <main>
            {!user ? (
                <div className="text-center my-5 py-5" style={{ minHeight: "70vh" }}>
                    <h5 className="text-muted mb-4">Please wait while we load your info..</h5>
                    <div className="spinner-grow spinner-grow-sm me-2 text-primary" role="status"></div>
                    <div className="spinner-grow spinner-grow-sm me-2 text-primary" role="status"></div>
                    <div className="spinner-grow spinner-grow-sm me-2 text-primary" role="status"></div>
                </div>
            ) : (
                <div className="container p-4" style={{ minHeight: "70vh" }}>
                    <div className="row bg-white rounded-3 shadow overflow-hidden border">
                        {/* User Details */}
                        <div className="col-12 col-md-6 p-4">
                            <div className="row d-flex align-items-center">
                                <div className="col-12 col-md-3 mb-4 d-flex justify-content-center">
                                    <img
                                        src={profileImage}
                                        alt="User Avatar"
                                        className="rounded-circle userprofile-img border"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="col-12 col-md-9 mb-4 text-center text-md-start">
                                    <h4 className="mb-1">@{user?.Username}</h4>
                                    <p className="mb-0 text-muted">{user?.Email}</p>
                                    {user?.isVerified ? (
                                        <small className="text-success">Verified <i className="fas fa-check-circle"></i></small>
                                    ) : (
                                        <small className="text-danger">Not Verified <i className="fas fa-times-circle"></i></small>
                                    )}
                                </div>
                            </div>

                            <div className="mt-2">
                                <h6 className="fw-semibold">Role: <span className="text-muted">{user?.Role}</span></h6>
                                <h6 className="fw-semibold mt-3">About</h6>
                                <p className="text-muted">{user?.About || "One lesson at a time, one step closer to greatness."}</p>
                            </div>
                        </div>

                        {/* Banner Section */}
                        <div className="col-12 col-md-6 p-0 banner-container d-none d-md-block">
                            <img
                                src="https://www.gstatic.com/classroom/themes/img_bookclub.jpg"
                                alt="Books Banner"
                                className="img-fluid h-100 w-100 banner-image"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-center my-5">
                        <img className="img-fluid" src="/assets/img/brandlog.png" alt="Examee" style={{ width: "150px" }} />
                    </div>
                </div>
            )}

            <footer className="footer">
                <Footer />
            </footer>
        </main>
    );
}
