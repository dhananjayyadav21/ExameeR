import React from 'react'

const Team = (props) => {

    const {name,role,description} = props

  return (
    <>
        <div className='col-12 col-sm-6 col-md-4'>
            <div className='card rounded-4 shadow-sm p-3 card-transition team h-100'>
                <div className="d-flex gap-2">
                    <img src="https://wallpapers.com/images/hd/professional-profile-pictures-1350-x-1080-sizz773bu8k11plw.jpg" alt="Professor" className="rounded-circle" loading="lazy" style={{width:"60px", height:"60px"}} />
                    <div>
                    <h5 className="m-0 p-0">{name}</h5>
                    <p className="my-2 text-secondary">{description}</p>
                    <span className="m-0 p-0 text-info fw-normal">{role}</span>
                    </div>
                </div>
                <button className="mt-3 btn btn-info text-white fw-bold w-100">
                    View
                </button>
            </div> 
        </div>
    </>
  )
}

export default Team
