import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">안녕하세요, 환영합니다!</h1>
        <p className="hero-subtitle">
          저는 현대적이고 반응형 웹 애플리케이션을 만드는 것을 즐기는 개발자입니다.
          <br />
          제 프로젝트들을 둘러보시고 저에 대해 더 알아보세요.
        </p>
        <Link to="/projects" className="hero-button">
          프로젝트 보러가기
        </Link>
      </div>
    </section>
  );
};

export default Home;