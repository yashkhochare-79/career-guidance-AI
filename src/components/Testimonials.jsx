import React from 'react';
import './Testimonials.css';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Software Engineer at TechCorp',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    content: 'CareerPath AI completely transformed my job search. The personalized roadmap helped me focus on exactly what skills I was missing. I landed my dream job within 3 months!'
  },
  {
    name: 'Michael Chen',
    role: 'Data Analyst at DataViz',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    content: 'As a recent graduate, I was overwhelmed. This platform broke down my career goals into achievable steps and recommended jobs that perfectly matched my evolving profile.'
  },
  {
    name: 'Priya Sharma',
    role: 'UX Designer at CreativeMinds',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    content: 'The resume builder alone is worth it. It helped me highlight my graduation projects in a way that actually caught the attention of recruiters. Highly recommended!'
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Success <span className="text-gradient">Stories</span></h2>
          <p className="section-subtitle">
            Hear from recent graduates who successfully launched their careers.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <Quote className="quote-icon" size={40} />
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-content">"{testimonial.content}"</p>
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                <div className="author-info">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <span className="author-role">{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
