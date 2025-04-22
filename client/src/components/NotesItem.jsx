import React from 'react'

const notesItem = ({Notes}) => {
  return (
    <>
      <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
        <div className="card card-transition p-4  text-center notes-item rounded-3 shadow-sm" >
              <img src="/assets/img/brandlog.png" alt='Notes Img' className="card-img-top align-self-center" style={{width:"100px"}}/>
              <div className="card-body">
                  <h5 className="card-title">{Notes.title}</h5>
                  <p className="card-text text-muted">{Notes.professor}</p>
              </div>
              <a href={Notes.fileUrl} className="btn-light-gray p-2"><h6 className='m-0'>View Notes</h6></a>
          </div>
      </div>
    </>
  )
}

export default notesItem
