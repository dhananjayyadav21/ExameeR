import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {

   const [display, setDisplay] = useState("none");

   const openMobileBar = ()=>{
        setDisplay("");
      
   }

   const closeMobileBar = ()=>{
        setDisplay("none");
   }

  return (
    <>
    <nav className="navbar navbar-expand-lg shadow-sm nav-color">
        <div className="container-fluid fs-6">
                
            <Link className="nav-text navbar-brand mt-0" to="/"><img src="assets/img/brandlog.png" alt="Examee" style={{width:"110px"}} /></Link>
            <span><i className={`fa-solid fa-bars mx-2 align-self-center d-lg-none`} onClick={openMobileBar}  ></i>
            </span>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
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

                <div>
                    <ul className="navbar-nav me-auto d-flex align-items-center">

                        <li className="nav-item dropdown">  
                            <a className="nav-text nav-link" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <div><img  className='profile-img rounded-circle' src="assets/img/Front.png" alt="" /></div>
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="/">My Learning</a></li>
                                <li><a className="dropdown-item" href="/">Edit Profile</a></li>
                                <li><a className="dropdown-item text-danger" href="/">Logout <i className="fa-solid fa-arrow-right-from-bracket"></i></a></li>
                                <li><hr className="dropdown-divider"/></li>
                                <li><a className="dropdown-item" href="/"><button className='btn btn-dark w-100'>Dashboard</button></a></li>
                            </ul>
                        </li>

                        <li className="nav-item">
                        <Link className="nav-text nav-link " to="/notes">Notes</Link>
                        </li>
                        {/* <li className="nav-item">
                        <Link className="nav-text nav-link " to="/cources">Cources</Link>
                        </li> */}
                        <li className="nav-item">
                        <Link className="nav-text nav-link " to="/video">Video</Link>
                        </li>
                        <li className="nav-item">
                        <Link className="nav-text nav-link" to="/Q-paper">Q-Paper</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>    

    {/*====================================================== mobilebar =======================================================*/}
    <div className={` MobileBar p-2 d-flex d-${display}`}>
        <div className="navbar-nav me-auto mb-2 mb-lg-0 ">
            
            <div className='d-flex justify-content-between align-items-center'style={{width:"94vw"}}>
                <div className="nav-item dropdown w-75">  
                    <a className="nav-text nav-link" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <div><a className="dropdown-item" href="/"><button className='btn btn-dark w-100'>Manage Acount</button></a></div>
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a className="dropdown-item" href="/">My Learning</a></li>
                        <li><a className="dropdown-item" href="/">Edit Profile</a></li>
                        <li><a className="dropdown-item text-danger" href="/">Logout<i className="fa-solid fa-arrow-right-from-bracket"></i></a></li>
                        <li><hr className="dropdown-divider"/></li>
                        <li><a className="dropdown-item" href="/"><button className='btn btn-dark w-100'>Dashboard</button></a></li>
                    </ul>
                </div>
                <i className="fa-solid fa-xmark" onClick={closeMobileBar}></i>
            </div>

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


             <div onClick={closeMobileBar}>
                <li className="nav-item">
                <Link className="nav-text nav-link " to="/notes"><i className="fa-solid fa-note-sticky mx-2"></i> Notes</Link>
                </li>
                {/* <li className="nav-item">
                <Link className="nav-text nav-link " to="/cources"><i className="fa-solid fa-tv mx-2"></i> Cources</Link>
                </li> */}
                <li className="nav-item">
                <Link className="nav-text nav-link " to="/video"><i className="fa-solid fa-photo-film mx-2"></i> Video</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-text nav-link" to="/Q-paper"><i className="fa-regular fa-paste mx-2"></i> Q-Paper</Link>
                </li>
             </div>

             
        </div>
    </div>

    </>
  )
}

export default Navbar
