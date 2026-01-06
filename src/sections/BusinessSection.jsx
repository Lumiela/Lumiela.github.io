import React, { forwardRef } from 'react';
import ScopeSection from './subsections/ScopeSection';
import RndSection from './subsections/RndSection';
import IntellectualPropertySection from './subsections/IntellectualPropertySection';

// This component will receive refs from App.jsx and forward them to the respective subsections.
const BusinessSection = forwardRef((props, ref) => {
  // Destructure the refs from the forwarded ref object
  const { scopeRef, rndRef, ipRef } = ref;

  return (
    <>
      <ScopeSection ref={scopeRef} />
      <RndSection ref={rndRef} />
      <IntellectualPropertySection ref={ipRef} />
    </>
  );
});

export default BusinessSection;
