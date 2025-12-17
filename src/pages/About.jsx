import React from 'react';
import './About.css';

const About = () => {
  const skills = [
    'JavaScript (ES6+)',
    'React',
    'Node.js',
    'HTML5 & CSS3',
    'Git & GitHub',
    'Vite',
    'Bootstrap',
    'Responsive Design',
  ];

  return (
    <section className="section about-section">
      <div className="container">
        <h2 className="section-title">소개</h2>
        <div className="about-content">
          <div className="about-image">
            <img 
              src="https://via.placeholder.com/300" 
              alt="프로필 이미지" 
              className="profile-image"
            />
          </div>
          <div className="about-text">
            <h3>안녕하세요, 저는 [당신의 이름]입니다.</h3>
            <p className="lead">
              창의적인 문제 해결에 열정을 가진 웹 개발자입니다.
            </p>
            <p>
              저는 사용자에게 가치 있는 경험을 제공하는 아름답고 기능적인 애플리케이션을 구축하는 것을 목표로 합니다. 최신 웹 기술을 배우고 적용하는 것에 항상 흥미를 느끼며, 동료들과 협력하여 훌륭한 제품을 만드는 과정을 즐깁니다.
            </p>
            <p>
              새로운 기회에 항상 열려있으니, 함께 일하고 싶으시다면 언제든지 연락 주세요.
            </p>
          </div>
        </div>

        <div className="skills-section">
          <h3 className="skills-title">보유 기술</h3>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={index} className="skill-card">
                <p className="skill-card-name">{skill}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;