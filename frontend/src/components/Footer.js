import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer>
      <div>
        <p>
          &copy; {new Date().getFullYear()} Criminal Justice System Tracking App
        </p>
        <p>All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
