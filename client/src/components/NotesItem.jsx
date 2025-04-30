import React, { useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../utils/Modal';
import ContentContext from '../context/ContentContext'
import { toast } from "react-toastify";

const NotesItem = ({ notes }) => {
  const context = useContext(ContentContext);
  const { addInMylearning, removeFromMylearning, getDataFromMyLearning,RemoveMyLearningNotes} = context;

  const [Notes, setNotes] = useState(notes);
  //--[useEffect]----
  useEffect(() => {
    getDataFromMyLearning();
    // eslint-disable-next-line
  }, []);

  const location = useLocation();
  const isMyLearning = location.pathname === '/myLearning';
  const navigate = useNavigate();

  //-- handle pdf viewer
  const handleViewPDF = () => {
    navigate(`/pdfviewer?view=${encodeURIComponent(Notes.fileUrl)}`);
  };

  //-- handle add to mylearning
  const [showModal, setShowModal] = useState(false);
  const handleAddToMyLearning = async () => {
    try {
      let data = {
        contentId: Notes._id,
        contentType: "Note"
      }
      setShowModal(false);
      const response = await addInMylearning(data);
      if (response.success === true) {
        setNotes({ ...Notes, isWatching: true });
        setShowModal(false);
      } else if (response.success === false) {
        setShowModal(false);
        toast.error(response.message || "Failed to add notes!", {
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

  //-- handle remove to mylearning
  const handleRemoveToMyLearning = async () => {
    try {
      let data = {
        contentId: Notes._id,
        contentType: "Note"
      }
      setShowModal(false);
      const response = await removeFromMylearning(data);
      if (response.success === true) {
        setNotes({ ...Notes, isWatching: false });
        setShowModal(false);
        RemoveMyLearningNotes(Notes._id)
      } else if (response.success === false) {
        setShowModal(false);
        toast.error(response.message || "Failed to remove Notes!", {
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

      {isMyLearning || Notes.isWatching ? 
        <>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleRemoveToMyLearning}
            heading={`Do You Want To Remove "${Notes.title}" Notes From My Learning? `}
            subHeading={`“Stay organized. Keep everything in one place”`}
          /></> :
        <>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleAddToMyLearning}
            heading={`Do You Want To Add "${Notes.title}" Notes In My Learning? `}
            subHeading={`“Stay organized. Keep everything in one place”`}
          /></>}

      <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
        <div className="card card-transition p-4 my-3 text-center notes-item rounded-3 shadow-sm" >
          <img src="/assets/img/brandlog.png" alt='Notes Img' className="card-img-top align-self-center" style={{ width: "100px" }} />
          <div className="card-body">
            <h5 className="card-title">{Notes.title}</h5>
            <p className="card-text text-muted">{Notes.professor}</p>
          </div>
          <span className="btn-light-gray p-2 cursor-pointer" onClick={handleViewPDF}><h6 className='m-0'>View Notes</h6></span>
          {isMyLearning ? (
            <i
              className="fa-solid fa-minus position-absolute remove-mylearning z-1"
              onClick={() => setShowModal(true)}
            ></i>
          ) : (
            Notes.isWatching ? (
              <i
                className="fa-solid fa-minus position-absolute remove-mylearning z-1"
                onClick={() => setShowModal(true)}
              ></i>
            ) : (
              <i
                className="fa-solid fa-plus position-absolute add-mylearning z-1"
                onClick={() => setShowModal(true)}
              ></i>
            )
          )}
        </div>
      </div>
    </>
  )
}

export default NotesItem
