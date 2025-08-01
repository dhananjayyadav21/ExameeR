import React, { useContext, useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import Modal from '../utils/Modal';
import ContentContext from '../context/ContentContext'
import { toast } from "react-toastify";

const VideoItem = ({ video }) => {
  const context = useContext(ContentContext);
  const { addInMylearning, removeFromMylearning, getDataFromMyLearning, RemoveMyLearningVideo } = context;

  const videoContainerRef = useRef();

  const handleFullscreen = () => {
    if (videoContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoContainerRef.current.requestFullscreen();
      }
    }
  };


  const [Video, setVideo] = useState(video);
  //--[useEffect]----
  useEffect(() => {
    getDataFromMyLearning();
    // eslint-disable-next-line
  }, []);

  const location = useLocation();
  const isMyLearning = location.pathname === '/myLearning';


  //-- handle add to mylearning
  const [showModal, setShowModal] = useState(false);
  const handleAddToMyLearning = async () => {
    try {
      let data = {
        contentId: Video._id,
        contentType: "Video"
      }
      setShowModal(false);
      const response = await addInMylearning(data);
      if (response.success === true) {
        setVideo({ ...Video, isWatching: true });
        setShowModal(false);
      } else if (response.success === false) {
        setShowModal(false);
        toast.error(response.message || "Failed to add Video!", {
          position: "top-right"
        });
      }
    } catch (error) {
      setShowModal(false);
      return toast.error("Failed to add in My learning", {
        position: "top-right"
      });
    }
    setShowModal(false);
  };

  const handleRemoveToMyLearning = async () => {
    try {
      let data = {
        contentId: Video._id,
        contentType: "Video"
      }
      const response = await removeFromMylearning(data);
      if (response.success === true) {
        setVideo({ ...Video, isWatching: false });
        setShowModal(false);
        RemoveMyLearningVideo(Video._id)
      } else if (response.success === false) {
        setShowModal(false);
        toast.error(response.message || "Failed to remove Video!", {
          position: "top-right"
        });
      }
    } catch (error) {
      return toast.error("Failed to remove from My learning", {
        position: "top-right"
      });
    }
    setShowModal(false);
  };
  return (
    <>

      {isMyLearning || Video?.isWatching ?
        <>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleRemoveToMyLearning}
            heading={`Do you want to remove ${Video.title} Video from My Learning? `}
            subHeading={`“Stay organized. Keep everything in one place”`}
          /></> :
        <>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleAddToMyLearning}
            heading={`Do you want to add ${Video.title} Video in My Learning? `}
            subHeading={`“Stay organized. Keep everything in one place”`}
          /></>}

      <div className="col-12 col-sm-6">
        <div className="card card-transition shadow-sm video-item my-3 p-2 rounded-3" style={{ minHeight: "400px" }}>
          <div className='position-relative video-container' ref={videoContainerRef}>
            <div className="video-player-header bg-white d-flex justify-content-start align-items-center p-1">
              <div className="video-zoom bg-light cursor-pointer d-flex justify-content-center align-items-center" onClick={handleFullscreen}>
                <img src="assets/img/zoom-in.png" alt="zoom" height={30} width={30} />
              </div>
              <h6 className="card-title px-2">{(Video?.title).slice(0, 20)}..</h6>
            </div>
            <iframe
              className='video-frame'
              src={`https://www.youtube.com/embed/${Video?.fileUrl}`}
              title="YouTube video player"
              FrameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            <div className="video-player-footer bg-white d-flex justify-content-start py-3">
              <div className='my-3'>
                {isMyLearning ? (
                  <button className='btn-gray-sm text-danger' onClick={() => setShowModal(true)} ><small>Remove From Mylearning <i className="fa-solid fa-minus mb-0"></i></small></button>
                ) : (
                  Video?.isWatching ? (
                    <button className='btn-gray-sm text-danger' onClick={() => setShowModal(true)} ><small>Remove From Mylearning <i className="fa-solid fa-minus mb-0"></i></small></button>
                  ) : (
                    <button className='btn-gray-sm' onClick={() => setShowModal(true)}><small>Add In Mylearning <i className="fa-solid fa-plus me-2 mb-0"></i></small></button>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="card-body pt-0 px-1">
            <p className="card-text">{(Video?.description).slice(0, 85)}..</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default VideoItem
