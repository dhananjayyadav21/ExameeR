import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from "react-toastify";

const Navbar = () => {

    const [display, setDisplay] = useState("none");
    const [openMBDisply, setopenMBDisply] = useState("");

    const openMobileBar = ()=>{
        setDisplay("");
        setopenMBDisply("none");
    }

    const closeMobileBar = ()=>{
        setDisplay("none");
        setopenMBDisply("");
    }

    const handleLogout = ()=>{
        localStorage.removeItem('token');
        toast.error("You're now logged out !!", {
            position: "top-right"
        });
        window.location.reload();
    }



  return (
    <>
    
        <nav id='nav' className="navbar sticky-top navbar-expand-lg shadow-sm nav-color">
            <div className="container-fluid fs-6">
                    
                {/* Brand-Logo For App */}
                <ul className="d-flex flex-row align-items-center mb-0 pl-0">
                    <Link className="nav-text navbar-brand mt-0" to="/"><img src="/assets/img/brandlog.png" alt="Examee" style={{width:"110px"}} /></Link>

                    {/* profile icon for MobileBar */}
                    {localStorage.getItem("token")?
                        <>
                            <div className="nav-item dropdown d-lg-none">  
                                <a className="nav-text nav-link" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                   <div><img  className='profile-img rounded-circle' src="/assets/img/Front.png" alt="" /></div>
                                </a>
                                <ul className="dropdown-menu " style={{marginRight:"500px"}} aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="/">My Learning</a></li>
                                    <li><a className="dropdown-item" href="/">Edit Profile</a></li>
                                    <li><a className="dropdown-item text-danger"  onClick={handleLogout}>Logout <i className="fa-solid fa-arrow-right-from-bracket"></i></a></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><Link className="dropdown-item btn btn-dark w-100" to="/dashboard">Dashboard</Link></li>
                                </ul>
                            </div>
                        </>:
                        <></>
                    }
                </ul>
                
        
                <span className='d-flex gap-3'> 
                    {/* Hamburger icon for MobileBar */}
                    <i className={`fa-solid fa-bars mx-2 align-self-center d-lg-none d-${openMBDisply}`} onClick={openMobileBar}  ></i>
                    <i className={`fa-solid fa-2x fa-xmark align-self-center d-lg-none d-${display}`} onClick={closeMobileBar}></i>
                </span>
                
                {/* Colaps item Below Lg Screen */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* category filter for diffrent streems */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item dropdown">  
                            <a className="nav-text nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-layer-group m-2"></i>Category
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="/">Sci-Technology</a></li>
                                <li><a className="dropdown-item" href="/">Commerce</a></li>
                                <li><a className="dropdown-item" href="/">Arts & civils</a></li>
                            </ul>
                        </li>
                    </ul>
                    {/* profile, Notes, Cource, Videos, Q-paper */}
                    <div>
                        <ul className="navbar-nav me-auto d-flex align-items-center">
                            {localStorage.getItem("token")?
                                <>
                                    <li className="nav-item dropdown">  
                                        <a className="nav-text nav-link" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown"  aria-expanded="false">
                                         <div><img  className='profile-img rounded-circle' src="/assets/img/Front.png" alt="" /></div>
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><a className="dropdown-item" href="/">My Learning</a></li>
                                            <li><a className="dropdown-item" href="/">Edit Profile</a></li>
                                            <li><a className="dropdown-item text-danger" onClick={handleLogout}>Logout <i className="fa-solid  fa-arrow-right-from-bracket"></i></a></li>
                                            <li><hr className="dropdown-divider"/></li>
                                            <li><Link className="dropdown-item" to="/dashboard"><button className='btn btn-dark w-100'>Dashboard</button></Link></li>
                                        </ul>
                                    </li>
                                </>:
                                <></>
                            }
                            

                            <li className="nav-item">
                            <Link className="nav-text nav-link " to="/notes">Notes</Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-text nav-link " to="/cource">Course</Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-text nav-link " to="/video">Video</Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-text nav-link" to="/Q-paper">Q-Paper</Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-text nav-link" to="/contact">Support</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>    

        <div className='MobileBar-container sticky-top'>
        {/*====================================================== mobilebar =======================================================*/}
        <div className={`MobileBar p-2 d-flex d-${display}`}>
            <div className="navbar-nav me-auto mb-2 mb-lg-0 ">
            
                {/* category filter for diffrent streems */} 
                <div className="nav-item dropdown">  
                    <a className="nav-text nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="fa-solid fa-layer-group mx-2"></i>Category
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a className="dropdown-item" href="/">Sci-Technology</a></li>
                        <li><a className="dropdown-item" href="/">Commerce</a></li>
                        <li><a className="dropdown-item" href="/">Arts & civils</a></li>
                    </ul>
                </div>
                {/* Notes, Cource, Videos, Q-paper */}
                <div onClick={closeMobileBar}>
                    <li className="nav-item">
                    <Link className="nav-text nav-link " to="/notes"><i className="fa-solid fa-note-sticky mx-2"></i>Notes</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-text nav-link " to="/cource"><i className="fa-solid fa-laptop mx-2"></i>Course</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-text nav-link " to="/video"><i className="fa-solid fa-photo-film mx-2"></i>Video</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-text nav-link" to="/Q-paper"><i className="fa-regular fa-paste mx-2"></i>Q-Paper</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-text nav-link" to="/contact"><i className="fa-regular fa-paste mx-2"></i>Support</Link>
                    </li>
                </div>
            </div>
        </div>

    </div>
    </>
  )
}

export default Navbar
