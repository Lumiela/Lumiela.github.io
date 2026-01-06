import React, { forwardRef } from 'react';
import IntellectualPropertySection from './subsections/IntellectualPropertySection';

const IPWrapperSection = forwardRef((props, ref) => {
  return (
    <section id="business-ip" className="section intellectual-property-section" ref={ref}>
      <IntellectualPropertySection />
    </section>
  );
});

export default IPWrapperSection;
