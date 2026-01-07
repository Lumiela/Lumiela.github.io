import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './IntellectualPropertySection.css';
import '../subsections/BusinessSubsections.css';
import IntellectualPropertyModal from '../../components/IntellectualPropertyModal';
import { useLenis } from '../../contexts/LenisContext';

const imageModules = import.meta.glob('../../assets/images/IntellectualProperty/*.{png,jpg,jpeg,svg,gif}');

const imagePaths = Object.keys(imageModules).map(path => {
    const url = new URL(path, import.meta.url).href;
    const fileName = path.split('/').pop();
    return { url, fileName };
});


const ipExamples = imagePaths.map((image, index) => ({
  id: index + 1,
  thumbnail: image.url,
  content: (<div><img src={image.url} style={{maxWidth:'100%'}}/></div>)
}));

const IntellectualPropertySection = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const lenis = useLenis();

    const openModal = (item) => {
        setSelectedItem(item);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedItem(null);
    };

    return (
        <div className="intellectual-property-section sub-section">
            <div className="subsection-title-container">
                <p className="subsection-title">
                <span className="quote">“</span>
                지식재산권 및 인증
                <span className="quote">”</span>
                </p>
            </div>
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={20} 
                slidesPerView={1.4} 
                centeredSlides={true}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 2.5 },
                }}
                pagination={{ clickable: true }}
                navigation={true}
                className="mySwiper"
            >
                {ipExamples.map((item) => (
                    <SwiperSlide key={item.id} onClick={() => openModal(item)}>
                        <div className="gallery-item">
                            <div className="gallery-thumbnail">
                                <img src={item.thumbnail} alt={item.title} />
                            </div>
                            <div className="gallery-title">{item.title}</div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {selectedItem && (
                <IntellectualPropertyModal isOpen={modalIsOpen} onClose={closeModal}>
                    {selectedItem.content}
                </IntellectualPropertyModal>
            )}
        </div>
    );
};

export default IntellectualPropertySection;