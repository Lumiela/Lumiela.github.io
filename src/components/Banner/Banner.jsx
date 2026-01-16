import React from 'react';
import { BannerContainer, BannerContent, BannerTitle } from './Banner.styles';

const Banner = ({ title, image }) => {
  return (
    <BannerContainer style={{ backgroundImage: `url(${image})` }}>
      <BannerContent>
        <BannerTitle>{title}</BannerTitle>
      </BannerContent>
    </BannerContainer>
  );
};

export default Banner;
