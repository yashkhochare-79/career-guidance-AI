import React from 'react';
import './Input.css';

const Input = ({ label, type = 'text', id, placeholder, icon: Icon, error, ...props }) => {
  return (
    <div className="input-group">
      <label htmlFor={id} className="input-label">{label}</label>
      <div className={`input-wrapper ${error ? 'has-error' : ''}`}>
        {Icon && <Icon className="input-icon" size={20} />}
        <input
          type={type}
          id={id}
          className={`input-field ${Icon ? 'with-icon' : ''}`}
          placeholder={placeholder}
          {...props}
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;
