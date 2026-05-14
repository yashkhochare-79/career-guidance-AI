import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useUser } from '../context/UserContext';
import { Search, MapPin, Clock, Briefcase, ChevronDown, Star, ExternalLink, BookmarkPlus, Filter, X } from 'lucide-react';
import './Jobs.css';

const jobsData = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechNova Solutions',
    location: 'Bangalore, India',
    type: 'Full-Time',
    experience: 'Entry Level',
    salary: '₹6L – ₹10L',
    domain: 'Web Development',
    postedAgo: '2 days ago',
    matchPercentage: 88,
    description: 'Build modern, responsive web interfaces using React and TypeScript. Collaborate with design and backend teams to deliver pixel-perfect experiences.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
    bonusSkills: ['TypeScript', 'Next.js', 'Tailwind CSS'],
    userHasSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
    featured: true,
  },
  {
    id: 2,
    title: 'React Intern',
    company: 'StartupHub',
    location: 'Remote',
    type: 'Internship',
    experience: 'Fresher',
    salary: '₹15K/month',
    domain: 'Web Development',
    postedAgo: '1 day ago',
    matchPercentage: 92,
    description: 'Join our fast-growing startup as a React intern. You will work on real features shipped to thousands of users under mentorship from senior engineers.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
    bonusSkills: ['Git', 'REST APIs'],
    userHasSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
    featured: false,
  },
  {
    id: 3,
    title: 'Junior Data Analyst',
    company: 'DataMetrics Inc.',
    location: 'Hyderabad, India',
    type: 'Full-Time',
    experience: 'Entry Level',
    salary: '₹5L – ₹8L',
    domain: 'Data Science',
    postedAgo: '5 days ago',
    matchPercentage: 45,
    description: 'Analyze business data to uncover insights, create dashboards, and support data-driven decision making across teams.',
    requiredSkills: ['SQL', 'Excel', 'Python', 'Tableau'],
    bonusSkills: ['Power BI', 'Statistics'],
    userHasSkills: ['SQL', 'Excel'],
    featured: false,
  },
  {
    id: 4,
    title: 'Python Developer',
    company: 'CloudServe Technologies',
    location: 'Pune, India',
    type: 'Full-Time',
    experience: '0-1 Years',
    salary: '₹5L – ₹9L',
    domain: 'Backend Development',
    postedAgo: '3 days ago',
    matchPercentage: 62,
    description: 'Develop and maintain backend services using Python and Django. Work with databases, APIs, and cloud infrastructure.',
    requiredSkills: ['Python', 'Django', 'SQL', 'REST APIs'],
    bonusSkills: ['Docker', 'AWS', 'Redis'],
    userHasSkills: ['Python', 'SQL'],
    featured: false,
  },
  {
    id: 5,
    title: 'Full Stack Developer Intern',
    company: 'InnoTech Labs',
    location: 'Remote',
    type: 'Internship',
    experience: 'Fresher',
    salary: '₹20K/month',
    domain: 'Web Development',
    postedAgo: '1 day ago',
    matchPercentage: 75,
    description: 'Work across the full stack — from React frontends to Node.js APIs. A great opportunity to build real-world, production-grade features.',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    bonusSkills: ['Express', 'Git'],
    userHasSkills: ['JavaScript', 'React'],
    featured: true,
  },
  {
    id: 6,
    title: 'Machine Learning Intern',
    company: 'AI Dynamics',
    location: 'Bangalore, India',
    type: 'Internship',
    experience: 'Fresher',
    salary: '₹25K/month',
    domain: 'AI / ML',
    postedAgo: '4 days ago',
    matchPercentage: 28,
    description: 'Assist the ML team in building and evaluating models for NLP and computer vision tasks. Strong Python and math fundamentals required.',
    requiredSkills: ['Python', 'NumPy', 'Pandas', 'Scikit-learn'],
    bonusSkills: ['PyTorch', 'TensorFlow', 'NLP'],
    userHasSkills: ['Python'],
    featured: false,
  },
  {
    id: 7,
    title: 'UI/UX Designer Intern',
    company: 'DesignCraft Studio',
    location: 'Mumbai, India',
    type: 'Internship',
    experience: 'Fresher',
    salary: '₹12K/month',
    domain: 'Design',
    postedAgo: '6 days ago',
    matchPercentage: 35,
    description: 'Create wireframes, prototypes, and high-fidelity mockups. Conduct user research and iterate on designs based on feedback.',
    requiredSkills: ['Figma', 'UI Design', 'Wireframing', 'Prototyping'],
    bonusSkills: ['Adobe XD', 'User Research'],
    userHasSkills: ['Figma'],
    featured: false,
  },
  {
    id: 8,
    title: 'DevOps Engineer (Junior)',
    company: 'ScaleUp Cloud',
    location: 'Remote',
    type: 'Full-Time',
    experience: '0-1 Years',
    salary: '₹7L – ₹12L',
    domain: 'Cloud & DevOps',
    postedAgo: '2 days ago',
    matchPercentage: 20,
    description: 'Manage CI/CD pipelines, containerized environments, and cloud infrastructure on AWS. Automate everything.',
    requiredSkills: ['Linux', 'Docker', 'AWS', 'CI/CD'],
    bonusSkills: ['Kubernetes', 'Terraform', 'Ansible'],
    userHasSkills: [],
    featured: false,
  },
];

const domains = ['All Domains', 'Web Development', 'Backend Development', 'Data Science', 'AI / ML', 'Design', 'Cloud & DevOps'];
const jobTypes = ['All Types', 'Full-Time', 'Internship'];
const experienceLevels = ['All Levels', 'Fresher', 'Entry Level', '0-1 Years'];

const Jobs = () => {
  const { user } = useUser();
  const userSkills = user.skills || [];
  const userSkillsLower = userSkills.map(s => s.toLowerCase());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedExperience, setSelectedExperience] = useState('All Levels');
  const [sortBy, setSortBy] = useState('match');
  const [savedJobs, setSavedJobs] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleSave = (id) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);
  };

  const filteredJobs = useMemo(() => {
    // Enrich each job with dynamic match data from user's actual skills
    let result = jobsData.map(job => {
      const matched = job.requiredSkills.filter(s => userSkillsLower.includes(s.toLowerCase()));
      const matchPct = job.requiredSkills.length > 0
        ? Math.round((matched.length / job.requiredSkills.length) * 100) : 0;
      return { ...job, matchPercentage: matchPct, userHasSkills: matched };
    });

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.requiredSkills.some(s => s.toLowerCase().includes(q))
      );
    }

    // Domain
    if (selectedDomain !== 'All Domains') {
      result = result.filter(j => j.domain === selectedDomain);
    }

    // Type
    if (selectedType !== 'All Types') {
      result = result.filter(j => j.type === selectedType);
    }

    // Experience
    if (selectedExperience !== 'All Levels') {
      result = result.filter(j => j.experience === selectedExperience);
    }

    // Sort
    if (sortBy === 'match') {
      result.sort((a, b) => b.matchPercentage - a.matchPercentage);
    } else if (sortBy === 'recent') {
      result.sort((a, b) => parseInt(a.postedAgo) - parseInt(b.postedAgo));
    }

    return result;
  }, [searchQuery, selectedDomain, selectedType, selectedExperience, sortBy, userSkillsLower.join(',')]);

  const getMatchColor = (pct) => {
    if (pct >= 75) return '#10B981';
    if (pct >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const getMatchLabel = (pct) => {
    if (pct >= 75) return 'Strong Match';
    if (pct >= 50) return 'Good Match';
    return 'Low Match';
  };

  const activeFilterCount = [selectedDomain, selectedType, selectedExperience].filter(f => !f.startsWith('All')).length;

  return (
    <DashboardLayout>
      <div className="jobs-container">

        {/* Header */}
        <div className="jobs-header animate-fade-in-up">
          <div>
            <h1 className="page-title">Job Recommendations</h1>
            <p className="page-subtitle">Personalized opportunities based on your skill profile.</p>
          </div>
          <div className="jobs-header-stats">
            <div className="header-stat">
              <span className="header-stat-value">{filteredJobs.length}</span>
              <span className="header-stat-label">Jobs Found</span>
            </div>
            <div className="header-stat">
              <span className="header-stat-value">{filteredJobs.filter(j => j.matchPercentage >= 75).length}</span>
              <span className="header-stat-label">Strong Matches</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="search-filter-bar animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <button className="mobile-filter-toggle" onClick={() => setShowMobileFilters(!showMobileFilters)}>
            <Filter size={18} />
            Filters
            {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
          </button>

          <div className={`filter-row ${showMobileFilters ? 'show' : ''}`}>
            <div className="filter-select-wrapper">
              <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)} className="filter-select">
                {domains.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown size={16} className="filter-chevron" />
            </div>

            <div className="filter-select-wrapper">
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="filter-select">
                {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={16} className="filter-chevron" />
            </div>

            <div className="filter-select-wrapper">
              <select value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)} className="filter-select">
                {experienceLevels.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <ChevronDown size={16} className="filter-chevron" />
            </div>

            <div className="filter-select-wrapper">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                <option value="match">Sort: Best Match</option>
                <option value="recent">Sort: Most Recent</option>
              </select>
              <ChevronDown size={16} className="filter-chevron" />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="results-count">{filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found</p>

        {/* Job Cards Grid */}
        <div className="jobs-grid">
          {filteredJobs.map((job, idx) => (
            <div
              className={`job-card ${job.featured ? 'featured' : ''} animate-fade-in-up`}
              key={job.id}
              style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
            >
              {job.featured && <div className="featured-ribbon">⭐ Featured</div>}

              {/* Card Header */}
              <div className="job-card-top">
                <div className="job-company-logo">
                  {job.company.charAt(0)}
                </div>
                <div className="job-main-info">
                  <h3 className="job-title">{job.title}</h3>
                  <span className="job-company">{job.company}</span>
                </div>
                <button
                  className={`save-btn ${savedJobs.includes(job.id) ? 'saved' : ''}`}
                  onClick={() => toggleSave(job.id)}
                  title={savedJobs.includes(job.id) ? 'Unsave' : 'Save Job'}
                >
                  <BookmarkPlus size={20} />
                </button>
              </div>

              {/* Meta Tags */}
              <div className="job-meta-row">
                <span className="job-meta"><MapPin size={14} /> {job.location}</span>
                <span className="job-meta"><Briefcase size={14} /> {job.type}</span>
                <span className="job-meta"><Clock size={14} /> {job.experience}</span>
              </div>

              {/* Description */}
              <p className="job-description">{job.description}</p>

              {/* Salary */}
              <div className="job-salary">{job.salary}</div>

              {/* Skill Match */}
              <div className="match-section">
                <div className="match-header">
                  <span className="match-label" style={{ color: getMatchColor(job.matchPercentage) }}>
                    {getMatchLabel(job.matchPercentage)}
                  </span>
                  <span className="match-pct" style={{ color: getMatchColor(job.matchPercentage) }}>
                    {job.matchPercentage}%
                  </span>
                </div>
                <div className="match-bar-bg">
                  <div
                    className="match-bar-fill"
                    style={{ width: `${job.matchPercentage}%`, background: getMatchColor(job.matchPercentage) }}
                  ></div>
                </div>
              </div>

              {/* Required Skills */}
              <div className="job-skills-section">
                <span className="skills-heading">Required Skills</span>
                <div className="skills-tags">
                  {job.requiredSkills.map(skill => {
                    const has = userSkillsLower.includes(skill.toLowerCase());
                    return (
                      <span key={skill} className={`skill-tag ${has ? 'has' : 'missing'}`}>
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Bonus Skills */}
              {job.bonusSkills.length > 0 && (
                <div className="job-skills-section">
                  <span className="skills-heading bonus">Nice to Have</span>
                  <div className="skills-tags">
                    {job.bonusSkills.map(skill => (
                      <span key={skill} className="skill-tag bonus-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="job-card-footer">
                <span className="posted-time">{job.postedAgo}</span>
                <button className="btn btn-primary apply-btn">
                  Apply Now <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="no-results">
            <Search size={48} className="no-results-icon" />
            <h3>No jobs found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Jobs;
