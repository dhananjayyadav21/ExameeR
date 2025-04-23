import React, { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Modal from '../utils/Modal';
import ContentContext from '../context/ContentContext'
import { toast } from "react-toastify";

const QPaperItem = ({ PYQ }) => {
  const context = useContext(ContentContext);
  const { addInMylearning, removeFromMylearning } = context;
  const location = useLocation();
  const isMyLearning = location.pathname === '/myLearning';

  const [showModal, setShowModal] = useState(false);

  const handleAddToMyLearning = async () => {
    try {
      let data = {
        contentId: PYQ._id,
        contentType: "PYQ"
      }
      const response = await addInMylearning(data);
      if (response.success === true) {
        setShowModal(false);
        toast.success("PYQ added successfully in my learning!", {
          position: "top-right"
        });
      } else if (response.success === false) {
        setShowModal(false);
        toast.error(response.message || "Failed to add pyq!", {
          position: "top-right"
        });
      }
    } catch (error) {
      return toast.error("Failed to add in My learning", {
        position: "top-right"
      });
    }

    setShowModal(false);
  };

  const handleRemoveToMyLearning = async () => {
    try {
      let data = {
        contentId: PYQ._id,
        contentType: "PYQ"
      }
      const response = await removeFromMylearning(data);
      if (response.success === true) {
        setShowModal(false);
        toast.success("PYQ remove successfully from my learning!", {
          position: "top-right"
        });
      } else if (response.success === false) {
        setShowModal(false);
        toast.error(response.message || "Failed to remove pyq!", {
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
            heading={`Do you want to remove ${PYQ.title} PYQ from My Learning? `}
            subHeading={`“Stay organized. Keep everything in one place”`}
          /></> :
        <>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleAddToMyLearning}
            heading={`Do you want to add ${PYQ.title} PYQ in My Learning? `}
            subHeading={`“Stay organized. Keep everything in one place”`}
          /></>}


      <div className='col-12 col-sm-6 col-lg-4 col-lg-3'>
        <div className="card card-transition p-2 py-3 text-center qp-item rounded-3 shadow-sm position-relative" >
          <img src="/assets/img/brandlog.png" alt='Notes Img' className="card-img-top align-self-center" style={{ width: "100px" }} />
          <div className="card-body ">
            <h6 className="card-title">{(PYQ.subject).substring(0, 25)}</h6>
            <h6 className="text-muted">View PYQ Here</h6>
          </div>
          <div className='d-flex justify-content-between w-100'>
            <span className="btn-light-gray w-50 p-2 mx-2 cursor-pointer"><h6 className='m-0'>Year - {PYQ.year}</h6></span>
            <a href={PYQ.fileUrl} download className="btn-light-gray w-50 p-2 mx-2"><h6 className='m-0'>Download PYQ</h6></a>
          </div>
          {isMyLearning ?
            <><i className="fa-solid fa-minus  position-absolute remove-mylearning z-1" onClick={() => setShowModal(true)}></i></> :
            <><i className="fa-solid fa-plus position-absolute add-mylearning z-1" onClick={() => setShowModal(true)}></i></>
          }
        </div>
      </div>
    </>
  )
}

export default QPaperItem
