import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useUser } from '../context/UserContext';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Lock, BookOpen, Code, ExternalLink, Clock, Star, ChevronRight } from 'lucide-react';
import './Roadmap.css';

const roadmapData = {
  'Frontend Developer': {
    description: 'Master modern web development from scratch to production-ready applications.',
    totalSteps: 6,
    completedSteps: 2,
    stages: [
      {
        id: 1,
        title: 'HTML & Web Fundamentals',
        level: 'Beginner',
        status: 'completed',
        duration: '2 weeks',
        skills: ['HTML5 Semantics', 'Forms & Validation', 'Accessibility', 'SEO Basics'],
        courses: [
          { name: 'HTML Crash Course', provider: 'freeCodeCamp', url: '#', rating: 4.8 },
          { name: 'Web Accessibility Fundamentals', provider: 'Udemy', url: '#', rating: 4.6 },
        ],
        projects: [
          { name: 'Personal Portfolio Page', difficulty: 'Easy' },
          { name: 'Survey Form with Validation', difficulty: 'Easy' },
        ]
      },
      {
        id: 2,
        title: 'CSS & Responsive Design',
        level: 'Beginner',
        status: 'completed',
        duration: '3 weeks',
        skills: ['Flexbox', 'CSS Grid', 'Media Queries', 'Animations', 'CSS Variables'],
        courses: [
          { name: 'CSS - The Complete Guide', provider: 'Udemy', url: '#', rating: 4.7 },
          { name: 'Responsive Web Design', provider: 'freeCodeCamp', url: '#', rating: 4.9 },
        ],
        projects: [
          { name: 'Responsive Landing Page', difficulty: 'Medium' },
          { name: 'CSS Grid Photo Gallery', difficulty: 'Easy' },
        ]
      },
      {
        id: 3,
        title: 'JavaScript Mastery',
        level: 'Intermediate',
        status: 'current',
        duration: '6 weeks',
        skills: ['ES6+', 'DOM Manipulation', 'Async/Await', 'Fetch API', 'OOP'],
        courses: [
          { name: 'JavaScript: The Complete Guide', provider: 'Udemy', url: '#', rating: 4.8 },
          { name: 'JavaScript Algorithms', provider: 'freeCodeCamp', url: '#', rating: 4.7 },
        ],
        projects: [
          { name: 'Interactive Quiz App', difficulty: 'Medium' },
          { name: 'Weather Dashboard (API)', difficulty: 'Medium' },
          { name: 'Task Manager with LocalStorage', difficulty: 'Medium' },
        ]
      },
      {
        id: 4,
        title: 'React & State Management',
        level: 'Intermediate',
        status: 'locked',
        duration: '6 weeks',
        skills: ['JSX', 'Hooks', 'React Router', 'Context API', 'Redux Toolkit'],
        courses: [
          { name: 'React - The Complete Guide', provider: 'Udemy', url: '#', rating: 4.8 },
          { name: 'Full Stack Open (React)', provider: 'University of Helsinki', url: '#', rating: 4.9 },
        ],
        projects: [
          { name: 'E-commerce Product Page', difficulty: 'Hard' },
          { name: 'Movie Search App', difficulty: 'Medium' },
        ]
      },
      {
        id: 5,
        title: 'Full-Stack Projects & Testing',
        level: 'Advanced',
        status: 'locked',
        duration: '4 weeks',
        skills: ['Jest', 'React Testing Library', 'CI/CD Basics', 'Performance Optimization'],
        courses: [
          { name: 'Testing React with Jest', provider: 'Pluralsight', url: '#', rating: 4.5 },
          { name: 'Web Performance Optimization', provider: 'Google', url: '#', rating: 4.8 },
        ],
        projects: [
          { name: 'Full-Stack Blog with Auth', difficulty: 'Hard' },
          { name: 'Real-Time Chat Application', difficulty: 'Hard' },
        ]
      },
      {
        id: 6,
        title: 'Internship & Portfolio Prep',
        level: 'Career',
        status: 'locked',
        duration: '2 weeks',
        skills: ['Portfolio Website', 'GitHub Profile', 'Resume Optimization', 'Interview Prep'],
        courses: [
          { name: 'Frontend Interview Masterclass', provider: 'Educative', url: '#', rating: 4.7 },
          { name: 'Building a Dev Portfolio', provider: 'YouTube', url: '#', rating: 4.6 },
        ],
        projects: [
          { name: 'Polished Portfolio Website', difficulty: 'Medium' },
          { name: 'Open Source Contribution', difficulty: 'Hard' },
        ]
      }
    ]
  },
  'Backend Developer': {
    description: 'Build scalable server-side applications and RESTful APIs.',
    totalSteps: 6,
    completedSteps: 1,
    stages: [
      {
        id: 1,
        title: 'Programming Fundamentals (Python/Node)',
        level: 'Beginner',
        status: 'completed',
        duration: '4 weeks',
        skills: ['Python / Node.js', 'Data Structures', 'Algorithms', 'Git Basics'],
        courses: [
          { name: 'Python for Everybody', provider: 'Coursera', url: '#', rating: 4.8 },
        ],
        projects: [
          { name: 'CLI To-Do App', difficulty: 'Easy' },
        ]
      },
      {
        id: 2,
        title: 'Databases & SQL',
        level: 'Beginner',
        status: 'current',
        duration: '4 weeks',
        skills: ['SQL', 'PostgreSQL', 'MongoDB', 'Data Modeling'],
        courses: [
          { name: 'SQL & PostgreSQL Complete', provider: 'Udemy', url: '#', rating: 4.7 },
        ],
        projects: [
          { name: 'Student Management DB', difficulty: 'Medium' },
        ]
      },
      {
        id: 3,
        title: 'REST APIs & Express/Django',
        level: 'Intermediate',
        status: 'locked',
        duration: '5 weeks',
        skills: ['Express.js / Django', 'REST Architecture', 'Authentication', 'Middleware'],
        courses: [
          { name: 'Node.js API Masterclass', provider: 'Udemy', url: '#', rating: 4.6 },
        ],
        projects: [
          { name: 'Blog REST API', difficulty: 'Medium' },
        ]
      },
      {
        id: 4,
        title: 'Docker & Deployment',
        level: 'Intermediate',
        status: 'locked',
        duration: '3 weeks',
        skills: ['Docker', 'Docker Compose', 'CI/CD', 'Cloud Basics (AWS/GCP)'],
        courses: [
          { name: 'Docker & Kubernetes', provider: 'Udemy', url: '#', rating: 4.8 },
        ],
        projects: [
          { name: 'Dockerized Microservice', difficulty: 'Hard' },
        ]
      },
      {
        id: 5,
        title: 'Microservices & System Design',
        level: 'Advanced',
        status: 'locked',
        duration: '6 weeks',
        skills: ['Microservices', 'Message Queues', 'Caching (Redis)', 'System Design'],
        courses: [
          { name: 'System Design Primer', provider: 'Educative', url: '#', rating: 4.9 },
        ],
        projects: [
          { name: 'E-Commerce Microservices', difficulty: 'Hard' },
        ]
      },
      {
        id: 6,
        title: 'Interview & Career Prep',
        level: 'Career',
        status: 'locked',
        duration: '2 weeks',
        skills: ['DSA Practice', 'System Design Interview', 'Behavioral Prep'],
        courses: [
          { name: 'Grokking the System Design', provider: 'Educative', url: '#', rating: 4.9 },
        ],
        projects: [
          { name: 'LeetCode 100 Problems', difficulty: 'Hard' },
        ]
      }
    ]
  },
  'Data Analyst': {
    description: 'Transform raw data into actionable insights using analysis and visualization.',
    totalSteps: 5,
    completedSteps: 0,
    stages: [
      {
        id: 1,
        title: 'Excel & Statistics Fundamentals',
        level: 'Beginner',
        status: 'current',
        duration: '3 weeks',
        skills: ['Advanced Excel', 'Descriptive Statistics', 'Probability', 'Data Cleaning'],
        courses: [
          { name: 'Excel Skills for Business', provider: 'Coursera', url: '#', rating: 4.8 },
        ],
        projects: [
          { name: 'Sales Data Analysis in Excel', difficulty: 'Easy' },
        ]
      },
      {
        id: 2,
        title: 'SQL for Data Analysis',
        level: 'Beginner',
        status: 'locked',
        duration: '3 weeks',
        skills: ['SQL Queries', 'Joins', 'Window Functions', 'Subqueries'],
        courses: [
          { name: 'SQL for Data Science', provider: 'Coursera', url: '#', rating: 4.7 },
        ],
        projects: [
          { name: 'Employee Database Queries', difficulty: 'Medium' },
        ]
      },
      {
        id: 3,
        title: 'Python for Data (Pandas & NumPy)',
        level: 'Intermediate',
        status: 'locked',
        duration: '5 weeks',
        skills: ['Pandas', 'NumPy', 'Data Wrangling', 'EDA'],
        courses: [
          { name: 'Python for Data Analysis', provider: 'Udemy', url: '#', rating: 4.6 },
        ],
        projects: [
          { name: 'COVID-19 Data EDA', difficulty: 'Medium' },
        ]
      },
      {
        id: 4,
        title: 'Data Visualization (Tableau/Power BI)',
        level: 'Intermediate',
        status: 'locked',
        duration: '4 weeks',
        skills: ['Tableau', 'Power BI', 'Matplotlib/Seaborn', 'Storytelling with Data'],
        courses: [
          { name: 'Tableau A-Z', provider: 'Udemy', url: '#', rating: 4.7 },
        ],
        projects: [
          { name: 'Interactive Sales Dashboard', difficulty: 'Hard' },
        ]
      },
      {
        id: 5,
        title: 'Portfolio & Job Prep',
        level: 'Career',
        status: 'locked',
        duration: '2 weeks',
        skills: ['Portfolio Building', 'Case Studies', 'Interview Prep'],
        courses: [
          { name: 'Data Analyst Interview Guide', provider: 'Udemy', url: '#', rating: 4.5 },
        ],
        projects: [
          { name: 'End-to-End Analysis Case Study', difficulty: 'Hard' },
        ]
      }
    ]
  },
  'AI Engineer': {
    description: 'Build intelligent systems using machine learning and deep learning.',
    totalSteps: 6,
    completedSteps: 0,
    stages: [
      {
        id: 1,
        title: 'Python & Math Foundations',
        level: 'Beginner',
        status: 'current',
        duration: '5 weeks',
        skills: ['Python', 'Linear Algebra', 'Calculus', 'Probability & Statistics'],
        courses: [
          { name: 'Mathematics for ML', provider: 'Coursera', url: '#', rating: 4.7 },
          { name: 'Python for Data Science', provider: 'edX', url: '#', rating: 4.6 },
        ],
        projects: [
          { name: 'Statistical Analysis Notebook', difficulty: 'Easy' },
        ]
      },
      {
        id: 2,
        title: 'Machine Learning Fundamentals',
        level: 'Intermediate',
        status: 'locked',
        duration: '6 weeks',
        skills: ['Scikit-learn', 'Supervised Learning', 'Unsupervised Learning', 'Model Evaluation'],
        courses: [
          { name: 'Machine Learning by Andrew Ng', provider: 'Coursera', url: '#', rating: 4.9 },
        ],
        projects: [
          { name: 'House Price Predictor', difficulty: 'Medium' },
        ]
      },
      {
        id: 3,
        title: 'Deep Learning & Neural Networks',
        level: 'Intermediate',
        status: 'locked',
        duration: '8 weeks',
        skills: ['PyTorch / TensorFlow', 'CNNs', 'RNNs', 'Transfer Learning'],
        courses: [
          { name: 'Deep Learning Specialization', provider: 'Coursera', url: '#', rating: 4.9 },
        ],
        projects: [
          { name: 'Image Classifier (CIFAR-10)', difficulty: 'Hard' },
        ]
      },
      {
        id: 4,
        title: 'NLP & Computer Vision',
        level: 'Advanced',
        status: 'locked',
        duration: '6 weeks',
        skills: ['Transformers', 'BERT/GPT', 'Object Detection', 'Generative AI'],
        courses: [
          { name: 'NLP with Transformers', provider: 'Hugging Face', url: '#', rating: 4.8 },
        ],
        projects: [
          { name: 'Sentiment Analysis API', difficulty: 'Hard' },
        ]
      },
      {
        id: 5,
        title: 'MLOps & Deployment',
        level: 'Advanced',
        status: 'locked',
        duration: '4 weeks',
        skills: ['MLflow', 'Docker', 'AWS SageMaker', 'Model Monitoring'],
        courses: [
          { name: 'MLOps Specialization', provider: 'Coursera', url: '#', rating: 4.7 },
        ],
        projects: [
          { name: 'End-to-End ML Pipeline', difficulty: 'Hard' },
        ]
      },
      {
        id: 6,
        title: 'Research & Career Prep',
        level: 'Career',
        status: 'locked',
        duration: '3 weeks',
        skills: ['Paper Reading', 'Kaggle Competitions', 'Portfolio', 'Interview Prep'],
        courses: [
          { name: 'AI Interview Handbook', provider: 'Educative', url: '#', rating: 4.6 },
        ],
        projects: [
          { name: 'Kaggle Competition Entry', difficulty: 'Hard' },
        ]
      }
    ]
  }
};

const levelColors = {
  'Beginner': { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  'Intermediate': { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE' },
  'Advanced': { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
  'Career': { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
};

const difficultyColors = {
  'Easy': '#10B981',
  'Medium': '#F59E0B',
  'Hard': '#EF4444',
};

const Roadmap = () => {
  const { user } = useUser();

  // Default to the user's career goal if it matches a roadmap
  const defaultCareer = Object.keys(roadmapData).find(
    r => r.toLowerCase() === (user.careerGoal || '').toLowerCase()
  ) || 'Frontend Developer';

  const [selectedCareer, setSelectedCareer] = useState(defaultCareer);
  const [expandedSteps, setExpandedSteps] = useState([]);

  const currentRoadmap = roadmapData[selectedCareer];
  const progressPercent = Math.round((currentRoadmap.completedSteps / currentRoadmap.totalSteps) * 100);

  const toggleStep = (id) => {
    setExpandedSteps(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={24} className="status-icon completed" />;
      case 'current': return <Circle size={24} className="status-icon current" />;
      case 'locked': return <Lock size={18} className="status-icon locked" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="roadmap-container">
        {/* Header */}
        <div className="roadmap-header animate-fade-in-up">
          <div className="header-text">
            <h1 className="page-title">Career Roadmap</h1>
            <p className="page-subtitle">{currentRoadmap.description}</p>
          </div>
          <div className="career-tabs">
            {Object.keys(roadmapData).map(career => (
              <button
                key={career}
                className={`career-tab ${selectedCareer === career ? 'active' : ''}`}
                onClick={() => { setSelectedCareer(career); setExpandedSteps([]); }}
              >
                {career}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="progress-overview animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="progress-stats">
            <div className="stat-pill">
              <span className="stat-pill-label">Completed</span>
              <span className="stat-pill-value">{currentRoadmap.completedSteps}/{currentRoadmap.totalSteps}</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill-label">Progress</span>
              <span className="stat-pill-value">{progressPercent}%</span>
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            {currentRoadmap.stages.map((_, idx) => (
              <div
                key={idx}
                className="progress-dot"
                style={{ left: `${((idx + 1) / currentRoadmap.totalSteps) * 100}%` }}
              ></div>
            ))}
          </div>
          <div className="progress-labels">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advanced</span>
            <span>Career Ready</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline-wrapper">
          <div className="timeline-line"></div>
          {currentRoadmap.stages.map((stage, idx) => {
            const isExpanded = expandedSteps.includes(stage.id);
            const levelStyle = levelColors[stage.level] || levelColors['Beginner'];

            return (
              <div
                className={`roadmap-step animate-fade-in-up ${stage.status}`}
                key={stage.id}
                style={{ animationDelay: `${0.15 + idx * 0.08}s` }}
              >
                {/* Timeline Node */}
                <div className="step-node">
                  <div className={`node-circle ${stage.status}`}>
                    {getStatusIcon(stage.status)}
                  </div>
                </div>

                {/* Step Card */}
                <div className={`step-card ${stage.status === 'locked' ? 'locked-card' : ''}`}>
                  <div className="step-card-header" onClick={() => stage.status !== 'locked' && toggleStep(stage.id)}>
                    <div className="step-title-row">
                      <span className="step-number">Step {stage.id}</span>
                      <span
                        className="level-badge"
                        style={{ background: levelStyle.bg, color: levelStyle.text, border: `1px solid ${levelStyle.border}` }}
                      >
                        {stage.level}
                      </span>
                    </div>
                    <h3 className="step-title">{stage.title}</h3>
                    <div className="step-meta">
                      <span className="step-duration"><Clock size={14} /> {stage.duration}</span>
                      <div className="step-skill-tags">
                        {stage.skills.slice(0, 3).map((s, i) => (
                          <span className="mini-tag" key={i}>{s}</span>
                        ))}
                        {stage.skills.length > 3 && <span className="mini-tag more">+{stage.skills.length - 3}</span>}
                      </div>
                    </div>
                    {stage.status !== 'locked' && (
                      <button className="expand-btn">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    )}
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="step-expanded">
                      {/* All Skills */}
                      <div className="expanded-section">
                        <h4>Skills You Will Learn</h4>
                        <div className="skill-chips">
                          {stage.skills.map((skill, i) => (
                            <span className="skill-chip" key={i}>{skill}</span>
                          ))}
                        </div>
                      </div>

                      {/* Courses */}
                      <div className="expanded-section">
                        <h4><BookOpen size={16} /> Recommended Courses</h4>
                        <div className="course-cards">
                          {stage.courses.map((course, i) => (
                            <a href={course.url} key={i} className="course-card" target="_blank" rel="noreferrer">
                              <div className="course-info">
                                <span className="course-name">{course.name}</span>
                                <span className="course-provider">{course.provider}</span>
                              </div>
                              <div className="course-right">
                                <span className="course-rating"><Star size={14} fill="#F59E0B" stroke="#F59E0B" /> {course.rating}</span>
                                <ExternalLink size={14} className="external-icon" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Projects */}
                      <div className="expanded-section">
                        <h4><Code size={16} /> Practice Projects</h4>
                        <div className="project-cards">
                          {stage.projects.map((project, i) => (
                            <div className="project-card" key={i}>
                              <span className="project-name">{project.name}</span>
                              <span
                                className="difficulty-badge"
                                style={{ color: difficultyColors[project.difficulty] }}
                              >
                                {project.difficulty}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {stage.status === 'current' && (
                        <button className="btn btn-primary step-action-btn">
                          Mark as Complete <ChevronRight size={18} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Roadmap;
