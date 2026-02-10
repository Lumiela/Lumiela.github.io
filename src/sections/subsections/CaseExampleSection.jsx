import React, { useState, useEffect, forwardRef, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import { supabase } from '../../supabaseClient';
import { createImageHandler, getEditorModules } from '../../hooks/editorHandlers';

import 'react-quill-new/dist/quill.snow.css';
import './CaseExampleSection.css';

const CaseExampleSection = forwardRef((props, ref) => {
    const [caseExamples, setCaseExamples] = useState([]);
    const [viewMode, setViewMode] = useState('list'); 
    const [selectedCase, setSelectedCase] = useState(null);
    
    // 페이지네이션 관련 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0); 
    const itemsPerPage = 10;

    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    const [content, setContent] = useState('');
    const [region, setRegion] = useState('');
    const [crop, setCrop] = useState('');
    const [facilityType, setFacilityType] = useState('');
    const [area, setArea] = useState('');

    const quillRef = useRef(null);
    const BUCKET_NAME = 'daonrs';

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // 페이지 번호가 바뀔 때마다 DB에서 데이터를 새로 가져옵니다.
    useEffect(() => {
        if (viewMode === 'list') {
            fetchCases(currentPage);
        }
    }, [currentPage, viewMode]);

    const fetchCases = async (page) => {
        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        // count: 'exact' 옵션으로 전체 데이터 개수를 받아옵니다.
        const { data, error, count } = await supabase
            .from('case_examples')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to); 
        
        if (error) {
            console.error('Error fetching cases:', error);
        } else {
            setCaseExamples(data?.map(item => ({ ...item, date: item.created_at?.split('T')[0] })) || []);
            setTotalCount(count || 0);
        }
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if (ref && ref.current) {
            window.scrollTo({
                top: ref.current.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    const handler = useMemo(() => createImageHandler(quillRef, 'case_examples'), []);
    const modules = useMemo(() => getEditorModules(handler), [handler]);

    const getThumbnail = (htmlContent) => {
        const imgRegex = /<img[^>]+src="([^">]+)"/;
        const match = imgRegex.exec(htmlContent);
        return match ? match[1] : 'https://via.placeholder.com/600x400?text=No+Image';
    };

    const handleSave = async () => {
        if (!user) return alert('관리자 권한이 없습니다.');
        if (!region || !crop || !content) return alert('지역, 작물 및 상세 내용을 입력하세요.');
        
        const generatedTitle = `${region} - ${crop}`;
        const postData = { title: generatedTitle, content, region, crop, facility_type: facilityType, area };

        try {
            if (isEditing) {
                await supabase.from('case_examples').update(postData).eq('id', selectedCase.id);
                alert('수정되었습니다.');
            } else {
                await supabase.from('case_examples').insert([postData]);
                alert('등록되었습니다.');
                setCurrentPage(1); // 새 글 등록 시 1페이지로 이동
            }
            backToList();
            fetchCases(currentPage);
        } catch (err) {
            alert('저장 중 오류 발생: ' + err.message);
        }
    };

    const handleDelete = async (post) => {
        if (!user) return alert('관리자 권한이 없습니다.');
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        let match;
        const filePaths = [];
        while ((match = imgRegex.exec(post.content)) !== null) {
            if (match[1].includes(BUCKET_NAME)) {
                filePaths.push(match[1].split(`${BUCKET_NAME}/`)[1]);
            }
        }

        if (filePaths.length > 0) await supabase.storage.from(BUCKET_NAME).remove(filePaths);
        await supabase.from('case_examples').delete().eq('id', post.id);
        
        alert('삭제되었습니다.');
        
        // 삭제 후 현재 페이지에 데이터가 없으면 이전 페이지로 이동
        const nextCount = totalCount - 1;
        const nextMaxPage = Math.ceil(nextCount / itemsPerPage) || 1;
        if (currentPage > nextMaxPage) {
            setCurrentPage(nextMaxPage);
        } else {
            fetchCases(currentPage);
        }
        backToList();
    };

    const startWriting = () => {
        if (!user) return;
        setIsEditing(false);
        setContent(''); setRegion(''); setCrop(''); setFacilityType(''); setArea('');
        setViewMode('write');
    };

    const startEditing = () => {
        if (!user) return;
        setRegion(selectedCase.region || '');
        setCrop(selectedCase.crop || '');
        setFacilityType(selectedCase.facility_type || '');
        setArea(selectedCase.area || '');
        setContent(selectedCase.content);
        setIsEditing(true);
        setViewMode('write');
    };

    const openDetail = (item) => {
        setSelectedCase(item);
        setViewMode('detail');
        if (ref && ref.current) {
            window.scrollTo({ top: ref.current.offsetTop - 100, behavior: 'smooth' });
        }
    };

    const backToList = () => {
        setViewMode('list');
        setSelectedCase(null);
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    };

    return (
        <section ref={ref} id="case-example" className="section">
            <div className="sub-section">
                <header className="subsection-header">
                    <h2 className="subsection-title">적용 사례</h2>
                    {user && viewMode === 'list' && (
                        <button onClick={startWriting} className="notice-write-button">실적 등록</button>
                    )}
                </header>

                <hr className="section-top-line" />

                {/* 1. 목록 화면 */}
                {viewMode === 'list' && (
                    <div className="case-grid-container">
                        <div className="case-examples-grid">
                            {caseExamples.map((item) => (
                                <div key={item.id} className="case-card" onClick={() => openDetail(item)}>
                                    <div className="case-card-thumbnail">
                                        <img src={getThumbnail(item.content)} alt={item.title} />
                                    </div>
                                    <div className="case-card-info">
                                        <h4 className="case-card-title">{item.title}</h4>
                                        <span className="case-card-date">{item.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 페이지네이션 UI (10개 초과시에만 표시) */}
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <button 
                                    className="page-btn" 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    &lt; 이전
                                </button>
                                <span className="page-info">{currentPage} / {totalPages}</span>
                                <button 
                                    className="page-btn" 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    다음 &gt;
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* 2. 상세 보기 화면 */}
                {viewMode === 'detail' && selectedCase && (
                    <div className="case-detail-view">
                        <div className="detail-header">
                            <h3 className="detail-title">{selectedCase.title}</h3>
                            <div className="detail-meta">
                                <span className="detail-date">작성일: {selectedCase.date}</span>
                                {user && (
                                    <div className="detail-admin-actions">
                                        <button onClick={startEditing} className="btn-edit-small">수정</button>
                                        <button onClick={() => handleDelete(selectedCase)} className="btn-delete-small">삭제</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <hr className="detail-hr-top" />
                        <div className="case-summary-container">
                            <div className="summary-img-wrapper">
                                <img src={getThumbnail(selectedCase.content)} alt="대표 이미지" />
                            </div>
                            <div className="summary-info-wrapper">
                                <ul className="info-list">
                                    <li><span className="info-label">- 지역 :</span> <span className="info-value">{selectedCase.region}</span></li>
                                    <li><span className="info-label">- 작물 :</span> <span className="info-value">{selectedCase.crop}</span></li>
                                    <li><span className="info-label">- 유형 :</span> <span className="info-value">{selectedCase.facility_type}</span></li>
                                    <li><span className="info-label">- 평수 :</span> <span className="info-value">{selectedCase.area}</span></li>
                                </ul>
                            </div>
                        </div>
                        <div className="detail-body ql-editor" dangerouslySetInnerHTML={{ __html: selectedCase.content }} />
                        <div className="detail-footer">
                            <button className="btn-list-go" onClick={backToList}>목록으로</button>
                        </div>
                    </div>
                )}

                {/* 3. 글쓰기/수정 화면 */}
                {viewMode === 'write' && user && (
                    <div className="cafe-editor-container">
                        <div className="editor-guide-text">※ 지역과 작물을 입력하면 실적 제목이 자동 생성됩니다.</div>
                        <div className="editor-grid-fields">
                            <div className="input-group">
                                <label>지역 (필수)</label>
                                <input type="text" placeholder="예: 광주광역시" value={region} onChange={(e) => setRegion(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>작물 (필수)</label>
                                <input type="text" placeholder="예: 딸기" value={crop} onChange={(e) => setCrop(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>유형</label>
                                <input type="text" placeholder="예: 비닐하우스" value={facilityType} onChange={(e) => setFacilityType(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>평수</label>
                                <input type="text" placeholder="예: 200평" value={area} onChange={(e) => setArea(e.target.value)} />
                            </div>
                        </div>
                        <div className="quill-wrapper">
                            <ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={modules} placeholder="상세 내용과 사진을 입력하세요." />
                        </div>
                        <div className="editor-footer">
                            <button className="btn-cancel" onClick={backToList}>취소</button>
                            <button className="btn-submit" onClick={handleSave}>{isEditing ? '수정완료' : '등록'}</button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
});

export default CaseExampleSection;