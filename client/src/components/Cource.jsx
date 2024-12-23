import React from 'react'
import CourceIteam from './CourceIteam'
import Footer from './Footer'

const Cource = () => {

    let Aarr = [{},{},{},{},{},{},{},{}]

  return (
    <>
      
      <div className='bg-light'>
        <div className='container-md p-3'>
            <h5 className='my-3'> Free Cources</h5>
            <h5 className='my-3'>Discover Development Courses Online</h5>
            <p>Explore Web Development courses that cover skills in HTML, CSS, JavaScript, and responsive design. Build expertise for careers in front-end development, full-stack development, and web design.</p>
        </div>
      </div>
     
      <div className="container-fluid">
            <div className="row g-4">

                {/*=========================================== left container ===========================================*/}
                <div className="col-12 col-md-3 sidebar-CoursesSection">
                  <div className='p-4 my-3 rounded-3'>
                    <h4 className='text-center'>Filter Course</h4>
                    <div className='row g-2 p-2 mt-3 rounded-3' >
                        <button className="btn btn-light">Free Lectures</button>
                        <button className='btn btn-light'> Enrolled Lectures</button>
                    </div>
                  </div> 
                </div>

                {/*=========================================== right container ===========================================*/}
                <div className="col-12 col-md-9 main-CoursesSection scrollable">
                   <div className="p-4">
                        {/*========= Cource Section =============*/}
                        <div>
                            <div className="my-4 d-flex justify-content-between">

                                <div><h5>Explore the Web Development Course Catalog</h5> </div> 

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

                            <div className="mt-2">
                                <div className="row g-4">
                                {Aarr.map((e,index)=> <CourceIteam key={index}/>)}
                                </div>
                            </div>

                        </div>
                   </div>
                </div>

            </div>
        </div>

        {/* ====================================== footer ================================================================= */}
        <footer className="footer text-center py-4">
            <Footer/>
        </footer>

    </>
  )
}

export default Cource
