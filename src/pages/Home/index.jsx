import React from 'react';

// Import the content from the JSON file
import HomeContent from '../../content/HomeContent.json';

// Import child components
import HeroBanner from '../../components/HeroBanner';
import ImageGrid from '../../components/ImageGrid';

// Import assets directly
import aboutImage from '../../assets/images/about.png';

const Home = () => {
  return (
    <div>
      {/* HeroBanner component with data from JSON */}
      <HeroBanner 
        subTitle={HomeContent.banner.subTitle}
        mainTitle1={HomeContent.banner.mainTitle1}
        mainTitle2={HomeContent.banner.mainTitle2}
        image={HomeContent.banner.image}
      />

      {/* About banner */}
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <img src={aboutImage} alt="about" style={{ maxWidth: '100%' }} />
      </div>

      {/* ImageGrid component with data from JSON */}
      <ImageGrid gridData={HomeContent.fieldGrid} />
    </div>
  );
};

export default Home;
