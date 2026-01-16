import React, { useState } from 'react';
import { SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Keep Swiper's own CSS
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import IntellectualPropertyModal from '../../components/IntellectualPropertyModal';
import {
  IPSectionContainer,
  SubsectionTitleContainer,
  SubsectionTitle,
  StyledSwiper,
  GalleryItem,
  GalleryThumbnail,
  GalleryTitle
} from './styles/IntellectualPropertySection.styles.js';

const imageModules = import.meta.glob('../../../assets/images/IntellectualProperty/*.{png,jpg,jpeg,svg,gif}', { eager: true });

const ipExamples = Object.keys(imageModules).map((path, index) => {
    const url = imageModules[path].default;
    const fileName = path.split('/').pop();
    // Simple title from filename, e.g., "image-01.jpg" -> "image-01"
    const title = fileName.substring(0, fileName.lastIndexOf('.'));
    return {
        id: index + 1,
        thumbnail: url,
        title: title,
        content: (<div><img src={url} style={{maxWidth:'100%'}} alt={title}/></div>)
    };
});

const IntellectualPropertySection = React.forwardRef((props, ref) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const openModal = (item) => {
        setSelectedItem(item);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedItem(null);
    };

    return (
        <IPSectionContainer ref={ref} id="ip">
            <SubsectionTitleContainer>
                <SubsectionTitle>
                  <span className="quote">“</span>
                  지식재산권 및 인증
                  <span className="quote">”</span>
                </SubsectionTitle>
            </SubsectionTitleContainer>
            <StyledSwiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={3}
                pagination={{ clickable: true }}
                navigation={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
            >
                {ipExamples.map((item) => (
                    <SwiperSlide key={item.id} onClick={() => openModal(item)}>
                        <GalleryItem>
                            <GalleryThumbnail>
                                <img src={item.thumbnail} alt={item.title} />
                            </GalleryThumbnail>
                            <GalleryTitle>{item.title}</GalleryTitle>
                        </GalleryItem>
                    </SwiperSlide>
                ))}
            </StyledSwiper>
            {selectedItem && (
                <IntellectualPropertyModal isOpen={modalIsOpen} onClose={closeModal}>
                    {selectedItem.content}
                </IntellectualPropertyModal>
            )}
        </IPSectionContainer>
    );
});

export default IntellectualPropertySection;
