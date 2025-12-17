import React from 'react';
import './Projects.css';

const projectsData = [
  {
    title: '프로젝트 1: 소셜 미디어 대시보드',
    description: 'React와 Node.js를 사용하여 구축한 소셜 미디어 분석 대시보드입니다. 사용자는 여러 소셜 미디어 계정의 데이터를 시각화하고 관리할 수 있습니다.',
    tags: ['React', 'Node.js', 'Chart.js', 'API'],
    image: 'https://via.placeholder.com/400x250/007BFF/FFFFFF?text=Project+One',
    liveUrl: '#',
    sourceUrl: '#',
  },
  {
    title: '프로젝트 2: 이커머스 웹사이트',
    description: '의류 판매를 위한 완전한 기능을 갖춘 반응형 이커머스 플랫폼입니다. Stripe를 통한 결제 시스템이 통합되어 있습니다.',
    tags: ['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
    image: 'https://via.placeholder.com/400x250/28A745/FFFFFF?text=Project+Two',
    liveUrl: '#',
    sourceUrl: '#',
  },
  {
    title: '프로젝트 3: 실시간 채팅 애플리케이션',
    description: 'WebSocket 기술을 활용하여 사용자들이 실시간으로 메시지를 주고받을 수 있는 채팅 애플리케이션입니다.',
    tags: ['React', 'Express', 'WebSocket', 'MongoDB'],
    image: 'https://via.placeholder.com/400x250/FFC107/000000?text=Project+Three',
    liveUrl: '#',
    sourceUrl: '#',
  },
];

const ProjectCard = ({ project }) => (
  <div className="project-card">
    <img src={project.image} alt={`${project.title} 이미지`} className="project-image" />
    <div className="project-content">
      <h3 className="project-title">{project.title}</h3>
      <div className="project-tags">
        {project.tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>
      <p className="project-description">{project.description}</p>
      <div className="project-links">
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link primary">
          라이브 데모
        </a>
        <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="project-link secondary">
          소스 코드
        </a>
      </div>
    </div>
  </div>
);

const Projects = () => {
  return (
    <section className="section projects-section">
      <div className="container">
        <h2 className="section-title">프로젝트</h2>
        <div className="projects-grid">
          {projectsData.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;