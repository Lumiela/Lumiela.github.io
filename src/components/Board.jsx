import React, { useState } from 'react';
import './Board.css';
import { Lock, Search } from 'lucide-react';

const Board = ({ posts, isQna = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
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
            {isQna && <th className="board-th board-status">답변상태</th>}
          </tr>
        </thead>
        <tbody>
          {currentPosts && currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <tr key={post.id}>
                <td className="board-td">{post.id}</td>
                <td className="board-td title">
                  {post.title}
                  {isQna && post.isPrivate && <Lock className="private-icon" size={16} />}
                </td>
                <td className="board-td board-author">{post.author}</td>
                <td className="board-td board-date">{post.date}</td>
                <td className="board-td board-views">{post.views}</td>
                {isQna && (
                  <td className={`board-td status board-status ${post.status === '답변완료' ? 'completed' : ''}`}>
                    {post.status}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isQna ? 6 : 5} className="board-td no-posts">게시글이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="board-footer">
        <div className="search-container">
          <input
            type="text"
            placeholder="제목 검색..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="search-button">
            <Search size={18} />
          </button>
        </div>
        
        <div className="pagination">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board;
