import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { supabase } from '../../supabaseClient'; 

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import IntellectualPropertyModal from '../../components/IntellectualPropertyModal';
import './IntellectualPropertySection.css'; // Import new CSS

const IntellectualPropertySection = React.forwardRef((props, ref) => {
    const [ipExamples, setIpExamples] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const title = "지식과 기술을 보호하고, 혁신을 입증합니다.";

    // 1. 관리자 세션 감지
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAdmin(!!session);
        };
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAdmin(!!session);
        });
        return () => subscription.unsubscribe();
    }, []);

    // 2. 이미지 데이터 로드
    const fetchIPImages = async () => {
        try {
            const { data, error } = await supabase.storage.from('images').list('IntellectualProperty');
            if (error) throw error;

            const imageFiles = data.filter(file => file.name !== '.emptyFolderPlaceholder');
            const formattedData = imageFiles.map((file, index) => {
                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(`IntellectualProperty/${file.name}`);
                return {
                    id: file.id || index,
                    thumbnail: `${publicUrl}?t=${new Date().getTime()}`,
                    title: file.name.split('.').slice(0, -1).join('.') || '인증서',
                    content: (<div className="modal-content-wrapper"><img src={publicUrl} className="modal-content-image" alt="detail"/></div>)
                };
            });
            setIpExamples(formattedData);
        } catch (err) {
            console.error('데이터 로드 오류:', err);
        }
    };

    useEffect(() => { fetchIPImages(); }, []);

    // 3. 관리자 업로드 로직
    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !isAdmin) return;

        try {
            setUploading(true);
            const fileName = `${Date.now()}_${file.name}`;
            const { error } = await supabase.storage.from('images').upload(`IntellectualProperty/${fileName}`, file);
            if (error) throw error;
            alert('인증서가 추가되었습니다.');
            fetchIPImages();
        } catch (err) {
            alert(`업로드 실패: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const openModal = (item) => { setSelectedItem(item); setModalIsOpen(true); };
    const closeModal = () => { setModalIsOpen(false); setSelectedItem(null); };

    return (
        <section id="ip" ref={ref}>
        <div className="sub-section">
            <div className="ip-container">
                <div className="section-header">
                    <h2>지식재산권 및 인증</h2>
                    <div className="main-title">{title}</div>
                    
                    {isAdmin && (
                        <div className="admin-upload-wrapper">
                            <input type="file" id="admin-upload" hidden onChange={handleUpload} accept="image/*" />
                            <label htmlFor="admin-upload" className="admin-upload-label">
                                {uploading ? '업로드 중...' : '+ 신규 인증서 등록'}
                            </label>
                        </div>
                    )}
                </div>

                {ipExamples.length > 0 ? (
                    <Swiper
                        className="styled-swiper"
                        modules={[Autoplay, Pagination, Navigation]}
                        slidesPerView={1}
                        centeredSlides={true}
                        spaceBetween={0}
                        loop={ipExamples.length > 2}
                        breakpoints={{
                            768: { slidesPerView: 3 },
                        }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        autoplay={{ delay: 3500, disableOnInteraction: false }}
                    >
                        {ipExamples.map((item) => (
                            <SwiperSlide key={item.id} onClick={() => openModal(item)}>
                                <div className="gallery-item">
                                    <div className="gallery-thumbnail">
                                        <img src={item.thumbnail} alt={item.title} />
                                    </div>
                                    {/* 파일명 표시(GalleryTitle) 삭제 완료 */}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="no-ip-data">등록된 인증 정보가 없습니다.</div>
                )}

                {selectedItem && (
                    <IntellectualPropertyModal isOpen={modalIsOpen} onClose={closeModal}>
                        {selectedItem.content}
                    </IntellectualPropertyModal>
                )}
            </div>
        </div>
    </section>
    );
});

export default IntellectualPropertySection;