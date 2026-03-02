import React from 'react';
import './ContactButton.css';

interface ContactButtonProps {
  onClick: () => void;
}

const ContactButton: React.FC<ContactButtonProps> = ({ onClick }) => {
  return (
    <button className="contact-button" onClick={onClick} aria-label="문의하기">
      {/* Placeholder for a contact icon, e.g., an SVG or an emoji */}
      <span>✉️</span>
      {/* You might use an actual SVG icon here from a library like react-icons */}
      {/* <svg ...> </svg> */}
    </button>
  );
};

export default ContactButton;
