import React from 'react';
import Board from '../../components/Board';
import qnaContent from '../../content/QnaContent.json'; // Import content
import { SupportContentSection } from '../SupportSection.styles.js'; // Import styled component

const QnaSection = () => {
  return (
    <SupportContentSection> {/* Use styled component */}
      <Board posts={qnaContent.posts} isQna={true} /> {/* Use content from JSON */}
    </SupportContentSection>
  );
};

export default QnaSection;