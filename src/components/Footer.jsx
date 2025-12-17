import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <div className="container text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} My Portfolio. All Rights Reserved.</p>
        <div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;