import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, heading, subHeading }) => {
    if (!isOpen) return null;

    return (
        <div className="modal d-block fade show mt-0" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered z-3 px-2" role="document">
                <div className="modal-content p-3">
                    <div className="text-center my-3">
                        <h6 style={{ fontWeight: '600' }}>
                            {heading} <br />
                            <small className="text-muted" style={{ fontWeight: '400' }}>{subHeading}</small>
                        </h6>
                    </div>
                    <div className="d-flex justify-content-end mx-3">
                        <button type="button" className="btn btn-sm btn-light me-3 shadow-sm" onClick={onClose}>
                            Close
                        </button>
                        <button type="button" className="btn btn-sm btn-dark shadow-sm" onClick={onConfirm}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
