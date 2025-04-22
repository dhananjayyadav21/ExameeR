import React from 'react'

const QPaperItem = ({ PYQ }) => {
  return (
    <>
      <div className='col-12 col-sm-6 col-lg-4 col-lg-3'>
        <div className="card card-transition p-2 py-3 text-center qp-item rounded-3 shadow-sm position-relative" >
          <img src="/assets/img/brandlog.png" alt='Notes Img' className="card-img-top align-self-center" style={{ width: "100px" }} />
          <div className="card-body ">
              <h6 className="card-title">{(PYQ.subject).substring(0, 25)}</h6>
              <h6 className="text-muted">View PYQ Here</h6>
          </div>
          <div className='d-flex justify-content-between w-100'>
              <span className="btn-light-gray w-50 p-2 mx-2"><h6 className='m-0'>Year - {PYQ.year}</h6></span>
              <a href={PYQ.fileUrl} download className="btn-light-gray w-50 p-2 mx-2"><h6 className='m-0'>Download PYQ</h6></a>
          </div>
          <span class="badge text-bg-info text-white position-absolute Pyq-year-Badge">{PYQ.year}</span>
        </div>
      </div>
    </>
  )
}

export default QPaperItem
