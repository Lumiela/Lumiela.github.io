import React, { useState } from 'react';
import { Lock, Search, Trash2 } from 'lucide-react'; // Trash2 아이콘 추가
import {
  BoardContainer,
  BoardTable,
  BoardTh,
  BoardTd,
  BoardFooter,
  SearchContainer,
  SearchInput,
  SearchButton,
  PaginationContainer,
  PaginationButton
} from './styles/Board.styles.js';

// onDelete와 currentUser 프롭을 추가로 받습니다.
const Board = ({ posts, isQna = false, onItemClick, onDelete, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <BoardContainer>
      <BoardTable>
        <thead>
          <tr>
            <BoardTh>번호</BoardTh>
            <BoardTh>제목</BoardTh>
            <BoardTh className="board-author">작성자</BoardTh>
            <BoardTh className="board-date">작성일</BoardTh>
            <BoardTh className="board-views">조회수</BoardTh>
            {/* 로그인한 사용자에게만 관리(삭제) 컬럼 표시 */}
            {currentUser && <BoardTh style={{ width: '80px' }}>관리</BoardTh>}
            {isQna && <BoardTh className="board-status">답변상태</BoardTh>}
          </tr>
        </thead>
        <tbody>
          {currentPosts && currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <tr key={post.id}>
                <BoardTd>{post.no || post.id}</BoardTd>
                
                <BoardTd 
                  className="title" 
                  onClick={() => onItemClick && onItemClick(post)}
                  style={{ cursor: 'pointer' }}
                >
                  {post.title}
                  {isQna && post.isPrivate && <Lock className="private-icon" size={16} />}
                </BoardTd>
                
                <BoardTd className="board-author">{post.author}</BoardTd>
                <BoardTd className="board-date">{post.date}</BoardTd>
                <BoardTd className="board-views">{post.views || 0}</BoardTd>
                
                {/* --- 삭제 버튼 추가 --- */}
                {currentUser && (
                  <BoardTd>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // 제목 클릭 이벤트(상세보기) 방지
                        onDelete && onDelete(post.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff4d4f',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        margin: '0 auto'
                      }}
                    >
                      <Trash2 size={16} />
                      <span style={{ fontSize: '12px' }}>삭제</span>
                    </button>
                  </BoardTd>
                )}

                {isQna && (
                  <BoardTd className={`status board-status ${post.status === '답변완료' ? 'completed' : ''}`}>
                    {post.status}
                  </BoardTd>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <BoardTd colSpan={currentUser ? 6 : 5} className="no-posts">게시글이 없습니다.</BoardTd>
            </tr>
          )}
        </tbody>
      </BoardTable>

      <BoardFooter>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="제목 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <SearchButton>
            <Search size={18} />
          </SearchButton>
        </SearchContainer>
        
        <PaginationContainer>
          <PaginationButton onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            이전
          </PaginationButton>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationButton
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </PaginationButton>
          ))}
          <PaginationButton onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
            다음
          </PaginationButton>
        </PaginationContainer>
      </BoardFooter>
    </BoardContainer>
  );
};

export default Board;