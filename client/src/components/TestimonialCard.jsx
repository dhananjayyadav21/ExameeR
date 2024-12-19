import React from 'react'

const TestimonialCard = (props) => {

    const {img,name,role,description} = props

  return (
    <>
        <div class="col-md-4">
            <div class="card card-transition shadow-sm text-center">
                <img src={img} class="rounded-circle mx-auto mt-3 shadow border border-3" alt="Emily Johnson" style={{width:"100px", height:"100px"}}/>
                <div class="card-body">
                <h5 class="card-title">{name}</h5>
                <p class="text-muted">{role}</p>
                <p class="card-text">{description}</p>
                </div>
            </div>
        </div>
    </>
  )
}

export default TestimonialCard
