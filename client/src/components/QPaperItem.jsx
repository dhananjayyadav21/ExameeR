import React from 'react'

const QPaperItem = () => {
  return (
    <>
      <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
        <div className="card card-transition p-4 text-center qp-item rounded-3 shadow-sm" >
              <img src="assets/img/brandlog.png" alt='Notes Img' className="card-img-top align-self-center" style={{width:"100px"}}/>
              <div className="card-body">
                  <h5 className="card-title">Card title</h5>
              </div>
          </div>
      </div>
    </>
  )
}

export default QPaperItem
