import React, { forwardRef } from 'react';
import CaseExampleSection from './subsections/CaseExampleSection';
import './CasesSection.css'; // Will create this next

const CasesSection = forwardRef((props, ref) => {
  return (
    <section id="cases" className="section case-example-section" ref={ref}>
      {/* CaseExampleSection is now a subsection of CasesSection */}
      <CaseExampleSection />
    </section>
  );
});

export default CasesSection;
