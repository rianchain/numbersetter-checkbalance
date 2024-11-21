import React from 'react';
import './CustomAlert.css';

const CustomAlert = ({ type, message, onClose }) => {
  return (
    <div className="custom-alert-overlay">
      <div className={`custom-alert ${type}`}>
        <div className="alert-icon">
          {type === 'error' && '❌'}
          {type === 'warning' && '⚠️'}
          {type === 'success' && '✅'}
        </div>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default CustomAlert;
