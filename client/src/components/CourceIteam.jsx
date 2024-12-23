import React from 'react'

const CourceIteam = () => {
  return (
    <>
        <div className="col-12 col-sm-6 col-md-4 rounded-3">
            <div className="card card-transition shadow-sm Courses-item p-2 rounded-4">
                <div className='position-relative'>
                <img className="card-img-top rounded-4" src="assets/img/cource.jpg" alt="Cardcap" style={{width:"100%"}}/>
                <div className="Play-btn bg-danger">
                    <i className="fa-solid fa-play"></i>
                </div>
                </div>
                {/* <img className="card-img-top rounded-4" src="assets/img/cource.jpg" alt="Cardcap" style={{width:"100%"}}/> */}
                <div className="card-body">
                    <div className='d-flex gap-2'>
                     <img  className='profile-img rounded-circle' src="assets/img/Front.png" alt="" />
                      <p> Lorem ipsum dolor</p>
                    </div>
                    <h5 className="card-title">C Programing<span> </span></h5>
                    <p className="card-text mb-2"><span className='fw-bold'>Cource Content :</span> <span>Opps, variable, identifire, kyeword, looping, controle </span></p>
                    <span className="badge bg-info">Beginer</span>
                </div>
            </div>
        </div>  
    </>
  )
}

export default CourceIteam
