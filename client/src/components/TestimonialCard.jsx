import React from 'react'

const TestimonialCard = (props) => {

    const {img,name,role,description} = props

  return (
    <>
        <div className="col-md-4">
            <div className="card card-transition shadow-sm text-center">
                <img src={img} className="rounded-circle mx-auto mt-3 shadow border border-3" alt="Emily Johnson" style={{width:"100px", height:"100px"}}/>
                <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="text-muted">{role}</p>
                <p className="card-text">{description}</p>
                </div>
            </div>
        </div>
    </>
  )
}

export default TestimonialCard
