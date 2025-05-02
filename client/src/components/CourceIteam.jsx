import React from 'react'
import { useNavigate } from 'react-router-dom'

const CourceIteam = ({ Course }) => {
  const navigate = useNavigate();

  const handleEnroll = (course) => {
    navigate("/enrollmentcource", {
      state: {course}
    });
  };

  return (
    <>
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card card-transition shadow-sm Courses-item my-3 p-2 rounded-3" style={{ minHeight: "380px" }}>
          <div className='position-relative' style={{minHeight:"150px"}}>
            <img className="card-img-top rounded-3" src={`https://lh3.googleusercontent.com/d/${Course?.courseImage}` || "/assets/img/cource.jpg"} alt="" style={{
              width: "100%",
              height: "150px",
              objectFit: "cover"
            }} />
            <div className="Play-btn bg-danger cursor-pointer"  onClick={()=> handleEnroll(Course)}>
              <i className="fa-solid fa-play"></i>
            </div>
            <span className='badge bg-warning cource-offer-badge'>{Course?.offerPercent}% off</span>
          </div>
          <div className="card-body pb-0 px-1">
            <div className='d-flex justify-content-between align-items-center py-2'>
              <span className="badge-blue px-2 py-1 rounded-2">{Course?.courseLevel}</span>
              <span>Duration:{Course?.duration}</span>
            </div>
            <h5 className="card-title px-0">{Course?.title}</h5>
            <p className="card-text px-0"><span>Cource Content :{(Course?.courseContents)?.slice(0, 50)}...</span></p>
            <button className='btn btn-info text-white fw-bold col-12 m-0' onClick={()=> handleEnroll(Course)}>Enrolled Now</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourceIteam
