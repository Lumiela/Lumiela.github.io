import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './IntellectualPropertySection.css';
import Modal from '../../components/Modal';

import thumb1 from '../../assets/images/11_h.jpg';
import thumb2 from '../../assets/images/21_h.jpg';
import thumb3 from '../../assets/images/153967a69df72734c0b5d9845f6637ec_1588584439_0108.png';
import thumb4 from '../../assets/images/ec799f44001e51b2d01a4e98ec22278f_1644560652_3293.jpg';
import thumb5 from '../../assets/images/ec799f44001e51b2d01a4e98ec22278f_1644560772_8999.jpg';

const ipExamples = [
  { id: 1, thumbnail: thumb1, title: '특허 1', content: (<div><h2>특허 1 상세 정보</h2><p>내용...</p><img src={thumb1} style={{maxWidth:'100%'}}/></div>) },
  { id: 2, thumbnail: thumb2, title: '인증 1', content: (<div><h2>인증 1 상세 정보</h2><p>내용...</p><img src={thumb2} style={{maxWidth:'100%'}}/></div>) },
  { id: 3, thumbnail: thumb3, title: '특허 2', content: (<div><h2>특허 2 상세 정보</h2><p>내용...</p><img src={thumb3} style={{maxWidth:'100%'}}/></div>) },
  { id: 4, thumbnail: thumb4, title: '인증 2', content: (<div><h2>인증 2 상세 정보</h2><p>내용...</p><img src={thumb4} style={{maxWidth:'100%'}}/></div>) },
  { id: 5, thumbnail: thumb5, title: '특허 3', content: (<div><h2>특허 3 상세 정보</h2><p>내용...</p><img src={thumb5} style={{maxWidth:'100%'}}/></div>) },
];

const IntellectualPropertySection = () => {
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
        <div className="intellectual-property-section sub-section">
            <div className="ip-title-container">
                <h2 className="ip-title">
                <span className="quote">“</span>
                지식재산권 및 인증
                <span className="quote">”</span>
                </h2>
            </div>
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                /* spaceBetween을 작게 하거나 마이너스로 주면 카드가 더 밀착됩니다 */
                spaceBetween={20} 
                /* slidesPerView를 소수점으로 설정하여 좌우 이미지가 잘리게 함 */
                slidesPerView={1.4} 
                centeredSlides={true}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 2.5 }, // PC에서 좌우가 반씩 잘려 보임
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
                <Modal isOpen={modalIsOpen} onClose={closeModal}>
                    {selectedItem.content}
                </Modal>
            )}
        </div>
    );
};

export default IntellectualPropertySection;