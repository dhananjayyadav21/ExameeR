"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from "react-toastify";
import hasUserRole from '../utils/hasUserRole';

const Navbar = ({ setProgress = () => { } }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    const [display, setDisplay] = useState("none");
    const [openMBDisply, setopenMBDisply] = useState("");
    const [token, setToken] = useState(null);
    const [profile, setProfile] = useState("/assets/img/Avtar.jpg");

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        const storedProfile = localStorage.getItem("Profile");
        if (storedProfile && storedProfile !== "undefined") {
            setProfile(storedProfile);
        }
    }, []);

    const openMobileBar = () => {
        setProgress(0);
        setDisplay("");
        setopenMBDisply("none");
        setProgress(100);
    }

    const closeMobileBar = () => {
        setProgress(0);
        setDisplay("none");
        setopenMBDisply("");
        setProgress(100);
    }

    const handleCategoryChange = (category) => {
        setProgress(0);
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', category);
        router.push(`?${params.toString()}`);
        closeMobileBar();
        setProgress(100);
    }

    const handleLogout = () => {
        setProgress(0);
        localStorage.clear();
        setToken(null);
        router.push("/login");
        toast.error("You're now logged out !!", {
            position: "top-right"
        });
        setProgress(100);
    }

    return (
        <>
            <nav id='nav' className="navbar sticky-top navbar-expand-lg shadow-sm nav-color">
                <div className="container-fluid fs-6">

                    {/* Brand-Logo For App */}
                    <ul className="d-flex flex-row align-items-center mb-0 pl-0">
                        <Link className="nav-text navbar-brand mt-0" href="/"><img src="/assets/img/brandlog.png" alt="Examee" style={{ width: "110px" }} onClick={closeMobileBar} /></Link>

                        {/*=========================== profile icon for MobileBar ==========================*/}
                        {token ?
                            <>
                                <div className="nav-item dropdown d-lg-none" onClick={closeMobileBar}>
                                    <a className="nav-text nav-link" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <div><img
                                            className="profile-img rounded-circle"
                                            src={profile} alt="Avtar" />
                                        </div>
                                    </a>
                                    <ul className="dropdown-menu " style={{ marginRight: "500px" }} aria-labelledby="navbarDropdown">
                                        <li><Link className="dropdown-item" href="/myLearning">My Learning</Link></li>
                                        <li><Link className="dropdown-item" href="/profile">View Profile</Link></li>
                                        <li>
                                            <span className="dropdown-item text-danger" onClick={handleLogout}>Logout <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                            </span>
                                        </li>
                                        {hasUserRole("Admin", "Instructor") ?
                                            <><li><hr className="dropdown-divider" /></li>
                                                <li><Link className="dropdown-item" href="/dashboard"><button className='btn btn-dark w-100'>Dashboard</button></Link></li></> :
                                            <></>
                                        }
                                    </ul>
                                </div>
                            </> :
                            <></>
                        }
                    </ul>

                    {/* Hamburger icon for MobileBar */}
                    <span className='d-flex gap-3'>
                        {!isDashboard && (
                            <>
                                <i className={`fa-solid fa-bars mx-2 align-self-center d-lg-none d-${openMBDisply}`}
                                    onClick={openMobileBar}>
                                </i>
                                <i className={`fa-solid fa-2x fa-xmark align-self-center d-lg-none d-${display}`}
                                    onClick={closeMobileBar}>
                                </i>
                            </>
                        )}
                    </span>

                    {/* Colaps item Below Lg Screen */}
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {/* category filter for diffrent streems */}
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item dropdown">
                                <a className="nav-text nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="fa-solid fa-layer-group m-2"></i>Category
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown" onClick={closeMobileBar}>
                                    <li><button className="dropdown-item" onClick={() => { handleCategoryChange('sciTechnology') }}>Sci-Technology</button></li>
                                    <li><button className="dropdown-item" onClick={() => { handleCategoryChange('commerce') }}>Commerce</button></li>
                                    <li><button className="dropdown-item" onClick={() => { handleCategoryChange('artscivils') }}>Arts & civils</button></li>
                                </ul>
                            </li>
                        </ul>
                        {/* profile, Notes, Cource, Videos, Q-paper */}
                        <div>
                            <ul className="navbar-nav me-auto d-flex align-items-center">
                                {token ?
                                    <>
                                        <li className="nav-item dropdown">
                                            <a className="nav-text nav-link" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <div><img
                                                    className="profile-img rounded-circle"
                                                    src={profile}
                                                    alt="Avtar" />
                                                </div>
                                            </a>
                                            <ul className="dropdown-menu cursor-pointer" aria-labelledby="navbarDropdown">
                                                <li><Link className="dropdown-item" href="/myLearning">My Learning</Link></li>
                                                <li><Link className="dropdown-item" href="/profile">View Profile</Link></li>
                                                <li>
                                                    <span className="dropdown-item text-danger" onClick={handleLogout}>Logout <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                                    </span>
                                                </li>
                                                {hasUserRole("Admin", "Instructor") ?
                                                    <><li><hr className="dropdown-divider" /></li>
                                                        <li><Link className="dropdown-item" href="/dashboard"><button className='btn btn-dark w-100'>Dashboard</button></Link></li></> :
                                                    <></>
                                                }
                                            </ul>
                                        </li>
                                    </> :
                                    <></>
                                }
                                <li className="nav-item">
                                    <Link className="nav-text nav-link " href="/notes">Notes</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-text nav-link " href="/video">Video</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-text nav-link" href="/Q-paper">Q-Paper</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-text nav-link " href="/cource">Course</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-text nav-link" href="/about">About</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-text nav-link" href="/contact">Support</Link>
                                </li>
                                {hasUserRole("Admin") ?
                                    (<li className="nav-item">
                                        <Link className="nav-text nav-link" href="/announcement">Announcement</Link>
                                    </li>) : (<></>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            {/*========================================= mobilebar ==============================================*/}
            <div className='MobileBar-container'>
                <div className={`MobileBar p-2 d-flex d-${display}`}>
                    <div className="navbar-nav me-auto mb-2 mb-lg-0 ">

                        {/* category filter for diffrent streems */}
                        <div className="nav-item dropdown">
                            <a className="nav-text nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa-solid fa-layer-group mx-2"></i>Category
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><button className="dropdown-item" onClick={() => { handleCategoryChange('sciTechnology') }}>Sci-Technology</button></li>
                                <li><button className="dropdown-item" onClick={() => { handleCategoryChange('commerce') }}>Commerce</button></li>
                                <li><button className="dropdown-item" onClick={() => { handleCategoryChange('artscivils') }}>Arts & civils</button></li>
                            </ul>
                        </div>
                        {/* Notes, Cource, Videos, Q-paper */}
                        <div onClick={closeMobileBar}>
                            <li className="nav-item">
                                <Link className="nav-text nav-link " href="/notes"><i className="fa-solid fa-note-sticky mx-2"></i>Notes</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-text nav-link " href="/video"><i className="fa-solid fa-photo-film mx-2"></i>Video</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-text nav-link" href="/Q-paper"><i className="fa-regular fa-paste mx-2"></i>Q-Paper</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-text nav-link " href="/cource"><i className="fa-solid fa-laptop mx-2"></i>Course</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-text nav-link" href="/about"><i className="fa-regular fa-paste mx-2"></i>About</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-text nav-link" href="/contact"><i className="fas fa-file-alt mx-2"></i>Support</Link>
                            </li>
                            {hasUserRole("Admin") ?
                                (<li className="nav-item">
                                    <Link className="nav-text nav-link" href="/announcement"><i className="fas fa-file-alt mx-2"></i>Announcement</Link>
                                </li>) : (<></>)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar;
