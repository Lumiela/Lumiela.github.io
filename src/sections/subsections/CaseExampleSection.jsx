import React, { useState, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './CaseExampleSection.css';
import '../subsections/BusinessSubsections.css';
import CasesModal from '../../components/CasesModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules'; // Import Swiper modules

// Use { eager: true } for synchronous import
const imageModules = import.meta.glob('../../assets/images/caseexample/**/*.{png,jpg,jpeg,svg,gif}', { eager: true });

const CaseExampleSection = () => {
    const [caseExamples, setCaseExamples] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState(null);

    useEffect(() => {
        // Synchronously process the already loaded modules
        const imagePaths = Object.keys(imageModules).map(path => ({
            url: imageModules[path].default,
            path,
        }));

        const groupedByFolder = imagePaths.reduce((acc, image) => {
            const pathParts = image.path.split('/');
            const folderName = pathParts[pathParts.length - 2];
            if (!acc[folderName]) {
                acc[folderName] = [];
            }
            acc[folderName].push(image.url);
            return acc;
        }, {});

        const loadedCases = Object.keys(groupedByFolder).map((folder, index) => {
            const images = groupedByFolder[folder];
            let thumbnail = images.find(img => img.includes('thumb-'));
            if (!thumbnail) {
                thumbnail = images[0];
            }
            const contentImages = images.filter(img => img !== thumbnail);

            return {
                id: index + 1,
                title: folder.replace(/\[|\]/g, ''), // Remove brackets from folder name
                thumbnail,
                content: (
                    <Swiper
                        modules={[Pagination, Navigation]}
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        navigation={true}
                        className="modal-swiper"
                    >
                        {[thumbnail, ...contentImages].map((img, i) => (
                            <SwiperSlide key={i}>
                                <img src={img} alt={`${folder} image ${i + 1}`} style={{ maxWidth: '100%' }} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )
            };
        });

        setCaseExamples(loadedCases);
    }, []);

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
            <div className="subsection-title-container">
              <p className="subsection-title">
                <span className="quote">“</span>
                주요실적
                <span className="quote">”</span>
              </p>
            </div>
            <div className="case-examples-grid">
                {caseExamples.map((caseItem) => (
                    <div key={caseItem.id} className="case-card" onClick={() => openModal(caseItem)}>
                        <div className="case-card-thumbnail">
                            <img src={caseItem.thumbnail} alt={caseItem.title} />
                        </div>
                        <div className="case-card-title">{caseItem.title}</div>
                    </div>
                ))}
            </div>
            {selectedCase && (
                <CasesModal isOpen={modalIsOpen} onClose={closeModal}>
                    {selectedCase.content}
                </CasesModal>
            )}
        </div>
    );
};

export default CaseExampleSection;