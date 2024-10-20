import React from "react";
import "../../assets/style.scss";

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Are you sure you want to delete this user?</h3>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-btn">
            Yes, Delete
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
