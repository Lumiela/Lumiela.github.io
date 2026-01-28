import React, { forwardRef } from 'react';
import visionImage from '../../assets/images/11_h.jpg';
import './VisionSection.css';

const VisionSection = forwardRef((props, ref) => {
  return (
    <section id="vision" ref={ref} className="vision-section-wrapper">
      <div className="sub-section">
        <img src={visionImage} alt="경영 비전" className="vision-image" />
      </div>
    </section>
  );
});

export default VisionSection;