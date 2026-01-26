import React, { useState } from 'react';
import { Lock, Search, Trash2 } from 'lucide-react'; // Trash2 아이콘 추가
import './Board.css'; // Import the new CSS file

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
    <div className="board-container">
      <table className="board-table">
        <thead>
          <tr>
            <th className="board-th">번호</th>
            <th className="board-th">제목</th>
            <th className="board-th board-author">작성자</th>
            <th className="board-th board-date">작성일</th>
            <th className="board-th board-views">조회수</th>
            {/* 로그인한 사용자에게만 관리(삭제) 컬럼 표시 */}
            {currentUser && <th className="board-th" style={{ width: '80px' }}>관리</th>}
            {isQna && <th className="board-th board-status">답변상태</th>}
          </tr>
        </thead>
        <tbody>
          {currentPosts && currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <tr key={post.id}>
                <td className="board-td">{post.no || post.id}</td>
                
                <td 
                  className="board-td title" 
                  onClick={() => onItemClick && onItemClick(post)}
                  style={{ cursor: 'pointer' }}
                >
                  {post.title}
                  {isQna && post.isPrivate && <Lock className="private-icon" size={16} />}
                </td>
                
                <td className="board-td board-author">{post.author}</td>
                <td className="board-td board-date">{post.date}</td>
                <td className="board-td board-views">{post.views || 0}</td>
                
                {/* --- 삭제 버튼 추가 --- */}
                {currentUser && (
                  <td className="board-td">
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
                  </td>
                )}

                {isQna && (
                  <td className={`board-td status board-status ${post.status === '답변완료' ? 'completed' : ''}`}>
                    {post.status}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={currentUser ? 6 : 5} className="board-td no-posts">게시글이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="board-footer">
        <div className="search-container">
          <input
            type="text"
            placeholder="제목 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button className="search-button">
            <Search size={18} />
          </button>
        </div>
        
        <div className="pagination-container">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-button">
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board;