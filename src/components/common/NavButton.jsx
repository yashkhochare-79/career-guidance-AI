import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavButton = ({ to, children, className = '', onClick, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  return (
    <button className={className} onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

export default NavButton;
