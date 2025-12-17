import React from 'react';

const Projects = () => {
  return (
    <div>
      <h1>My Projects</h1>
      <hr />
      <p>Here are some of the projects I've worked on.</p>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Project</h5>
              <p className="card-text">A brief description of the first project. What it does, what tech was used.</p>
              <a href="#" className="btn btn-primary">View on GitHub</a>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Project Two</h5>
              <p className="card-text">A brief description of the second project. What it does, what tech was used.</p>
              <a href="#" className="btn btn-primary">View on GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;