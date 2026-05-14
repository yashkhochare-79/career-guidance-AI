import React, { useState, useEffect, useRef } from 'react';
import './Statistics.css';

const stats = [
  { value: 120, suffix: 'k+', label: 'Students Guided' },
  { value: 850, suffix: 'k+', label: 'Skills Analyzed' },
  { value: 300, suffix: '+', label: 'Career Paths' },
  { value: 2.5, suffix: 'M+', label: 'Job Recommendations' }
];

const Statistics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section statistics" ref={statsRef}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-value-wrapper">
                <span className={`stat-value ${isVisible ? 'animate-count' : ''}`}>
                  {stat.value}
                </span>
                <span className="stat-suffix">{stat.suffix}</span>
              </div>
              <p className="stat-label-text">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
