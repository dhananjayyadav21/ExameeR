import React from 'react'

const QPaperItem = ({ PYQ }) => {
  return (
    <>
      <div className='col-12 col-sm-6 col-lg-4 col-lg-3'>
        <div className="card card-transition pt-3 pb-2 px-2 text-center qp-item rounded-3 shadow-sm position-relative" >
          <img src="/assets/img/brandlog.png" alt='Notes Img' className="card-img-top align-self-center" style={{ width: "100px" }} />
          <div className="card-body d-flex justify-content-center">
              <h6 className="card-title">{(PYQ.subject).substring(0, 25)}</h6>
          </div>
          <a href={PYQ.fileUrl} className="btn btn-sm btn-info text-white">View PYQ</a>
          <span class="badge text-bg-info text-white position-absolute Pyq-year-Badge">{PYQ.year}</span>
        </div>
      </div>
    </>
  )
}

export default QPaperItem
