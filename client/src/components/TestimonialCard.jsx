import React from 'react'

const TestimonialCard = (props) => {

    const {img,name,role,description} = props

  return (
    <>
        <div className="col-md-4">
            <div className="card card-transition shadow rounded-4 text-center h-100">
                <img src={img} className="rounded-circle mx-auto mt-3 shadow-sm border border-3" alt="Emily Johnson" style={{width:"70px", height:"70px"}}/>
                <div className="card-body">
                <h5 className="card-title fw-bold m-0">{name}</h5>
                <p className="text-primary fw-bold"><small>{role}</small></p>
                <p className="card-text text-secondary">{description}</p>
                </div>
            </div>
        </div>
    </>
  )
}

export default TestimonialCard
