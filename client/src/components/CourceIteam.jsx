import React from 'react'
import { useNavigate } from 'react-router-dom'

const CourceIteam = () => {
  const navigate = useNavigate();
  
  return (
    <>
        <div className="col-12 col-sm-6 col-lg-3">
            <div className="card card-transition shadow-sm Courses-item p-2 rounded-3">
                <div className='position-relative'>
                <img className="card-img-top rounded-3" src="/assets/img/cource.jpg" alt="Cardcap" style={{width:"100%"}}/>
                <div className="Play-btn bg-danger">
                    <i className="fa-solid fa-play"></i>
                </div>
                </div>
                <div className="card-body mx-0 px-1">
                    <div className='d-flex justify-content-between align-items-center py-2'>
                      <span className="badge-blue px-3 py-1 rounded-2">Beginer</span>
                      <span>Duration: 10 weeks</span>
                    </div>
                    <h5 className="card-title px-0">C Programing<span> </span></h5>
                    <p className="card-text px-0"><span>Cource Content :</span> <span>Opps, variable, identifire, kyeword, looping, controle </span></p>
                    <button className='btn btn-info text-white fw-bold col-12 m-0' onClick={()=>navigate('/enrolled')}>Enrolled Now</button>
                </div>
            </div>
        </div>  
    </>
  )
}

export default CourceIteam
