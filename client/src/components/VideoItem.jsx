import React from 'react'

const VideoItem = ({Video}) => {
  return (
    <>
     <div className="col-12 col-sm-6 col-lg-4 rounded-3">
       <div className="card card-transition shadow-sm video-item p-2 rounded-4">
            <div className='position-relative'>
              <img className="card-img-top rounded-4" src="/assets/img/DSA.jpg" alt="Cardcap" style={{width:"100%"}}/>
              <div className="Play-btn bg-danger">
                <a href={Video.fileUrl}><i className="fa-solid fa-play"></i></a>
              </div>
            </div>
            <div className="card-body">
                <h5 className="card-title">{Video.title}</h5>
                <p className="card-text">{Video.description}</p>
            </div>
        </div>
       </div>  
    </>
  )
}

export default VideoItem
