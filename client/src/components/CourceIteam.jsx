import React from 'react'

const CourceIteam = () => {
  return (
    <>
        <div className="col-12 col-sm-6 col-md-4 rounded-3">
            <div className="card card-transition shadow-sm video-item p-2 rounded-4">
                <div className='position-relative'>
                <img className="card-img-top rounded-4" src="assets/img/cource.jpg" alt="Cardcap" style={{width:"100%"}}/>
                <div className="Play-btn">
                    <i class="fa-solid fa-play"></i>
                </div>
                </div>
                {/* <img className="card-img-top rounded-4" src="assets/img/cource.jpg" alt="Cardcap" style={{width:"100%"}}/> */}
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>

            

        </div>  
    </>
  )
}

export default CourceIteam
