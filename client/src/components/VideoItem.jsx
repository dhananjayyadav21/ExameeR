import React, { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Modal from '../utils/Modal';
import ContentContext from '../context/ContentContext'
import { toast } from "react-toastify";

const VideoItem = ({ Video }) => {
  const context = useContext(ContentContext);
  const { addInMylearning, removeFromMylearning } = context;
  const location = useLocation();
  const isMyLearning = location.pathname === '/myLearning';

  const [showModal, setShowModal] = useState(false);

  const handleAddToMyLearning = async () => {
    try {
      let data = {
        contentId: Video._id,
        contentType: "Video"
      }
      const response = await addInMylearning(data);
      if (response.success === true) {
        setShowModal(false);
        toast.success("Video added successfully in my learning!", {
          position: "top-right"
        });
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
        setShowModal(false);
        toast.success("Video remove successfully from my learning!", {
          position: "top-right"
        });
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

      {isMyLearning ?
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

      <div className="col-12 col-sm-6 col-lg-4 rounded-3">
        <div className="card card-transition shadow-sm video-item p-2 rounded-4">
          <div className='position-relative'>
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${Video.fileUrl}`}
              title="YouTube video player"
              FrameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            {/* <div className="Play-btn bg-danger">
              <a href={Video.fileUrl}><i className="fa-solid fa-play"></i></a>
            </div> */}
          </div>
          <div className="card-body">
            <h5 className="card-title">{(Video.title).slice(0, 20)}</h5>
            {isMyLearning ?
              <> <button className='btn-gray-sm my-2 text-danger' onClick={() => setShowModal(true)} >Remove From Mylearning <i className="fa-solid fa-minus mb-0"></i></button></> :
              <><button className='btn-gray-sm my-2' onClick={() => setShowModal(true)}>Add In Mylearning <i className="fa-solid fa-plus me-2 mb-0"></i></button></>
            }
            <p className="card-text">{(Video.description).slice(0, 90)}..</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default VideoItem
