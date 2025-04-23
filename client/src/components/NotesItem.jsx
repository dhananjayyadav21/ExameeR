import React, { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Modal from '../utils/Modal';
import ContentContext from '../context/ContentContext'
import { toast } from "react-toastify";

const NotesItem = ({ Notes }) => {
  const context = useContext(ContentContext);
  const { addInMylearning } = context;
  const location = useLocation();
  const isMyLearning = location.pathname === '/mylearning';

  const [showModal, setShowModal] = useState(false);

  const handleAddToMyLearning = async () => {
    try {
      let data = {
        contentId: Notes._id,
        contentType: "Note"
      }
      const response = await addInMylearning(data);
      if (response.success === true) {
        toast.success("Notes added successfully in my learning!", {
          position: "top-right"
        });
      } else if (response.success === false) {
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

  return (
    <>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleAddToMyLearning}
        heading={`Do you want to add ${Notes.title} in My Learning? `}
        subHeading={`“Stay organized. Keep everything in one place”`}
      />

      <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
        <div className="card card-transition p-4  text-center notes-item rounded-3 shadow-sm" >
          <img src="/assets/img/brandlog.png" alt='Notes Img' className="card-img-top align-self-center" style={{ width: "100px" }} />
          <div className="card-body">
            <h5 className="card-title">{Notes.title}</h5>
            <p className="card-text text-muted">{Notes.professor}</p>
          </div>
          <a href={Notes.fileUrl} className="btn-light-gray p-2"><h6 className='m-0'>View Notes</h6></a>
          {isMyLearning ?
            <><i className="fa-solid fa-minus position-absolute remove-mylearning z-1"></i></> :
            <><i className="fa-solid fa-plus position-absolute add-mylearning z-1" onClick={() => setShowModal(true)}></i></>
          }
        </div>
      </div>
    </>
  )
}

export default NotesItem
