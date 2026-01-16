import React, { useState, useEffect, forwardRef } from 'react'; // Add forwardRef
import { SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules'; // Import Swiper modules

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import CasesModal from '../../components/CasesModal';
import {
  SubsectionTitleContainer,
  SubsectionTitle,
  CaseExamplesGrid,
  CaseCard,
  CaseCardThumbnail,
  CaseCardTitle,
  ModalSwiper
} from './styles/CaseExampleSection.styles.js';

const imageModules = import.meta.glob('../../assets/images/caseexample/**/*.{png,jpg,jpeg,svg,gif}', { eager: true });

const CaseExampleSection = forwardRef((props, ref) => { // Wrap with forwardRef
    const [caseExamples, setCaseExamples] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState(null);

    useEffect(() => {
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
                title: folder.replace(/\[|\]/g, ''),
                thumbnail,
                content: (
                    <ModalSwiper // Use styled Swiper
                        modules={[Pagination, Navigation]}
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        navigation={true}
                    >
                        {[thumbnail, ...contentImages].map((img, i) => (
                            <SwiperSlide key={i}>
                                <img src={img} alt={`${folder} image ${i + 1}`} style={{ maxWidth: '100%' }} />
                            </SwiperSlide>
                        ))}
                    </ModalSwiper>
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
        setSelectedCase(null); // Assuming selectedItem was meant to be selectedCase
    };

    return (
        <section className="sub-section" ref={ref}> {/* Use section with ref */}
            <SubsectionTitleContainer>
              <SubsectionTitle>
                <span className="quote">“</span>
                주요실적
                <span className="quote">”</span>
              </SubsectionTitle>
            </SubsectionTitleContainer>
            <CaseExamplesGrid> {/* Use styled grid */}
                {caseExamples.map((caseItem) => (
                    <CaseCard key={caseItem.id} onClick={() => openModal(caseItem)}> {/* Use styled card */}
                        <CaseCardThumbnail> {/* Use styled thumbnail */}
                            <img src={caseItem.thumbnail} alt={caseItem.title} />
                        </CaseCardThumbnail>
                        <CaseCardTitle>{caseItem.title}</CaseCardTitle> {/* Use styled title */}
                    </CaseCard>
                ))}
            </CaseExamplesGrid>
            {selectedCase && (
                <CasesModal isOpen={modalIsOpen} onClose={closeModal}>
                    {selectedCase.content}
                </CasesModal>
            )}
        </section> // Close section
    );
});

export default CaseExampleSection;