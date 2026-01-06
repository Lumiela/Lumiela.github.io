import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './CaseExampleSection.css';
import Modal from '../../components/Modal';
import thumb1 from '../../assets/images/thumb-3554906474_e9krvoCH_d31232b2bc33204641979c2d201c12b957784e91_600x435.png';
import thumb2 from '../../assets/images/thumb-3717203036_UgsXqM3j_299636e922f83bc9bb29ef811171ac5682465fe6_600x450.jpg';
import thumb3 from '../../assets/images/thumb-3717203036_xVCbGrst_b6b701fc7f12c2392a79dcc6d023f1fe14056aee_600x832.jpg';

const caseExamples = [
  {
    id: 1,
    thumbnail: thumb1,
    title: '사례 1',
    content: (
      <div>
        <h2>사례 1 상세 정보</h2>
        <p>여기에 사례 1에 대한 상세 내용이 들어갑니다. 텍스트, 이미지, 비디오 등 다양한 콘텐츠를 포함할 수 있습니다.</p>
        <img src={thumb1} alt="사례 1 상세 이미지" style={{ maxWidth: '100%' }} />
      </div>
    ),
  },
  {
    id: 2,
    thumbnail: thumb2,
    title: '사례 2',
    content: (
      <div>
        <h2>사례 2 상세 정보</h2>
        <p>여기에 사례 2에 대한 상세 내용이 들어갑니다. 텍스트, 이미지, 비디오 등 다양한 콘텐츠를 포함할 수 있습니다.</p>
        <img src={thumb2} alt="사례 2 상세 이미지" style={{ maxWidth: '100%' }} />
      </div>
    ),
  },
  {
    id: 3,
    thumbnail: thumb3,
    title: '사례 3',
    content: (
      <div>
        <h2>사례 3 상세 정보</h2>
        <p>여기에 사례 3에 대한 상세 내용이 들어갑니다. 텍스트, 이미지, 비디오 등 다양한 콘텐츠를 포함할 수 있습니다.</p>
        <img src={thumb3} alt="사례 3 상세 이미지" style={{ maxWidth: '100%' }} />
      </div>
    ),
  },
  {
    id: 4,
    thumbnail: thumb1,
    title: '사례 4',
    content: (
      <div>
        <h2>사례 4 상세 정보</h2>
        <p>여기에 사례 4에 대한 상세 내용이 들어갑니다.</p>
        <img src={thumb1} alt="사례 4 상세 이미지" style={{ maxWidth: '100%' }} />
      </div>
    ),
  },
  {
    id: 5,
    thumbnail: thumb2,
    title: '사례 5',
    content: (
      <div>
        <h2>사례 5 상세 정보</h2>
        <p>여기에 사례 5에 대한 상세 내용이 들어갑니다.</p>
        <img src={thumb2} alt="사례 5 상세 이미지" style={{ maxWidth: '100%' }} />
      </div>
    ),
  },
  {
    id: 6,
    thumbnail: thumb3,
    title: '사례 6',
    content: (
      <div>
        <h2>사례 6 상세 정보</h2>
        <p>여기에 사례 6에 대한 상세 내용이 들어갑니다.</p>
        <img src={thumb3} alt="사례 6 상세 이미지" style={{ maxWidth: '100%' }} />
      </div>
    ),
  },
];

const CaseExampleSection = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const openModal = (caseItem) => {
    setSelectedCase(caseItem);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCase(null);
  };

  return (
    <div className="sub-section">
      <h2>주요실적</h2>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={3}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        className="mySwiper"
        breakpoints={{
          // when window width is >= 320px
          320: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          // when window width is >= 1024px
          1024: {
            slidesPerView: 3,
            spaceBetween: 30
          }
        }}
      >
        {caseExamples.map((caseItem) => (
          <SwiperSlide key={caseItem.id} onClick={() => openModal(caseItem)}>
            <div className="gallery-item">
              <div className="gallery-thumbnail">
                <img src={caseItem.thumbnail} alt={caseItem.title} />
              </div>
              <div className="gallery-title">{caseItem.title}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {selectedCase && (
        <Modal isOpen={modalIsOpen} onClose={closeModal}>
          {selectedCase.content}
        </Modal>
      )}
    </div>
  );
};

export default CaseExampleSection;
