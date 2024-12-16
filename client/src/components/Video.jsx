import React from 'react'
import VideoItem from "./VideoItem"

const Video = () => {

    let Aarr = [ {},{},{},{},{},{},]

  return (
    <>
         <div className="container-fluid">
            <div className="row g-4">

                {/*=========================================== left container ===========================================*/}
                <div className="col-12 col-md-3 sidebar-VideoSection">
                  <div className='p-4 my-3 rounded-3'  style={{backgroundColor:"white"}}>
                    <h4 className='text-center'>SELECT VIDEO LECTURES</h4>
                    <div className='row g-2 p-2 mt-3 rounded-3' >
                        <button className="btn btn-light">Free Lectures</button>
                        <button className='btn btn-light'> Enrolled Lectures</button>
                    </div>
                  </div>

                    
                </div>

                {/*=========================================== right container ===========================================*/}
                <div className="col-12 col-md-9 main-VideoSection scrollable">
                   <div className="container p-4">
                        {/*========= video Section =============*/}
                        <div>
                            <div className="container mt-2 d-flex justify-content-end">
                                <div className="col-4 col-sm-3 col-md-4 col-lg-2 text-center">
                                    <a className="nav-text nav-link p-1 border border-dark border-1 rounded-2 " href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Sort By <i className="fa-solid fa-sort"></i>
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li><a className="dropdown-item" href="/">Sem-I</a></li>
                                        <li><a className="dropdown-item" href="/">Sem-II</a></li>
                                        <li><a className="dropdown-item" href="/">Sem-III</a></li>
                                        <li><a className="dropdown-item" href="/">Sem-IV</a></li>
                                        <li><a className="dropdown-item" href="/">Sem-V</a></li>
                                        <li><a className="dropdown-item" href="/">Sem-VI</a></li>
                                        <li><a className="dropdown-item" href="/">Sem-VII</a></li>
                                        <li><a className="dropdown-item" href="/">Sem-VIII</a></li>
                                    </ul>
                                </div>
                            </div> 

                            <div className="container mt-2">
                                <div className="row g-4">
                                {Aarr.map((e)=> <VideoItem/>)}
                                </div>
                            </div>

                        </div>
                   </div>
                </div>

            </div>
        </div>
    </>
  )
}

export default Video
