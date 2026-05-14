// ============================================
// Resume Analysis Engine
// ============================================
// Rule-based, keyword-matching resume analyzer.
// No external AI APIs — 100% frontend logic.
// Designed to be swappable with real AI later.
// ============================================

// ─── Role requirement datasets ───
export const ROLE_REQUIREMENTS = {
  'Frontend Developer': {
    required: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design', 'TypeScript'],
    bonus: ['Next.js', 'Tailwind CSS', 'Redux', 'Webpack', 'Testing', 'Figma', 'REST API', 'GraphQL'],
    sections: ['Summary', 'Experience', 'Projects', 'Education', 'Skills'],
    keywords: ['responsive', 'UI', 'component', 'frontend', 'web', 'interface', 'pixel-perfect', 'cross-browser', 'performance', 'accessibility'],
  },
  'Backend Developer': {
    required: ['Python', 'Node.js', 'SQL', 'REST API', 'Git', 'Database', 'Docker'],
    bonus: ['AWS', 'Kubernetes', 'Redis', 'GraphQL', 'Microservices', 'CI/CD', 'MongoDB', 'PostgreSQL'],
    sections: ['Summary', 'Experience', 'Projects', 'Education', 'Skills'],
    keywords: ['backend', 'server', 'API', 'database', 'scalable', 'architecture', 'deployment', 'security', 'optimization'],
  },
  'Data Analyst': {
    required: ['SQL', 'Excel', 'Python', 'Tableau', 'Statistics', 'Data Visualization'],
    bonus: ['Power BI', 'Pandas', 'R', 'Jupyter', 'A/B Testing', 'Machine Learning', 'ETL', 'Data Cleaning'],
    sections: ['Summary', 'Experience', 'Projects', 'Education', 'Skills', 'Certifications'],
    keywords: ['data', 'analysis', 'insight', 'dashboard', 'report', 'metrics', 'KPI', 'trend', 'visualization'],
  },
  'AI Engineer': {
    required: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Linear Algebra'],
    bonus: ['NLP', 'Computer Vision', 'Transformers', 'MLOps', 'AWS', 'Docker', 'Hugging Face', 'Scikit-learn'],
    sections: ['Summary', 'Experience', 'Projects', 'Education', 'Skills', 'Publications'],
    keywords: ['model', 'training', 'neural', 'accuracy', 'dataset', 'prediction', 'inference', 'optimization', 'GPU'],
  },
  'UI/UX Designer': {
    required: ['Figma', 'Wireframing', 'Prototyping', 'User Research', 'UI Design', 'Design Thinking'],
    bonus: ['Adobe XD', 'Sketch', 'Usability Testing', 'HTML', 'CSS', 'Interaction Design', 'Accessibility'],
    sections: ['Summary', 'Experience', 'Projects', 'Education', 'Skills', 'Portfolio'],
    keywords: ['design', 'user', 'interface', 'experience', 'prototype', 'wireframe', 'research', 'usability', 'journey'],
  },
  'Cybersecurity Analyst': {
    required: ['Network Security', 'Linux', 'Ethical Hacking', 'SIEM', 'Vulnerability Assessment', 'Firewalls'],
    bonus: ['Penetration Testing', 'Wireshark', 'Burp Suite', 'OWASP', 'Incident Response', 'Python', 'SOC'],
    sections: ['Summary', 'Experience', 'Projects', 'Education', 'Skills', 'Certifications'],
    keywords: ['security', 'threat', 'vulnerability', 'incident', 'compliance', 'risk', 'audit', 'penetration', 'malware'],
  },
};

// ─── Section detection patterns ───
const SECTION_PATTERNS = {
  Summary: /\b(summary|objective|about me|profile|professional summary)\b/i,
  Experience: /\b(experience|work history|employment|work experience|professional experience)\b/i,
  Projects: /\b(projects|personal projects|key projects|portfolio)\b/i,
  Education: /\b(education|academic|university|college|degree|bachelor|master)\b/i,
  Skills: /\b(skills|technical skills|core competencies|technologies|tech stack)\b/i,
  Certifications: /\b(certifications|certificates|certified|accreditation)\b/i,
  Publications: /\b(publications|papers|research|published)\b/i,
  Portfolio: /\b(portfolio|design work|case studies)\b/i,
};

// ─── Quality patterns ───
const QUALITY_PATTERNS = {
  measurableAchievements: /\b(\d+%|\d+x|increased|decreased|improved|reduced|generated|saved|delivered|achieved)\b/gi,
  actionVerbs: /\b(developed|built|designed|implemented|created|led|managed|optimized|launched|deployed|automated|integrated|architected|engineered|maintained|collaborated|mentored)\b/gi,
  githubLink: /github\.com/i,
  linkedinLink: /linkedin\.com/i,
  contactInfo: /\b(email|phone|@|\.com|\.edu)\b/i,
  bulletPoints: /[•\-–—]\s/g,
};

/**
 * Main analysis function — returns a complete analysis report.
 * @param {string} resumeText - Extracted text from the resume
 * @param {string} targetRole - The selected target role
 * @returns {Object} Full analysis report
 */
export function analyzeResume(resumeText, targetRole) {
  const role = ROLE_REQUIREMENTS[targetRole];
  if (!role) return null;

  const textLower = resumeText.toLowerCase();
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;

  // ─── 1. Skill matching ───
  const matchedRequired = role.required.filter(s => textLower.includes(s.toLowerCase()));
  const missingRequired = role.required.filter(s => !textLower.includes(s.toLowerCase()));
  const matchedBonus = role.bonus.filter(s => textLower.includes(s.toLowerCase()));
  const missingBonus = role.bonus.filter(s => !textLower.includes(s.toLowerCase()));

  const skillMatchPct = role.required.length > 0
    ? Math.round((matchedRequired.length / role.required.length) * 100) : 0;

  // ─── 2. Section detection ───
  const detectedSections = {};
  const missingSections = [];
  role.sections.forEach(sec => {
    const pattern = SECTION_PATTERNS[sec];
    if (pattern && pattern.test(resumeText)) {
      detectedSections[sec] = true;
    } else {
      detectedSections[sec] = false;
      missingSections.push(sec);
    }
  });
  const sectionScore = Object.values(detectedSections).filter(Boolean).length;
  const sectionTotal = role.sections.length;

  // ─── 3. Keyword density ───
  const matchedKeywords = role.keywords.filter(kw => textLower.includes(kw.toLowerCase()));
  const keywordScore = role.keywords.length > 0
    ? Math.round((matchedKeywords.length / role.keywords.length) * 100) : 0;

  // ─── 4. Quality checks ───
  const achievements = (resumeText.match(QUALITY_PATTERNS.measurableAchievements) || []).length;
  const actionVerbs = (resumeText.match(QUALITY_PATTERNS.actionVerbs) || []).length;
  const hasGithub = QUALITY_PATTERNS.githubLink.test(resumeText);
  const hasLinkedin = QUALITY_PATTERNS.linkedinLink.test(resumeText);
  const hasContact = QUALITY_PATTERNS.contactInfo.test(resumeText);
  const bulletCount = (resumeText.match(QUALITY_PATTERNS.bulletPoints) || []).length;

  // ─── 5. Calculate scores ───
  // ATS Score: weighted combination
  let atsScore = 0;
  atsScore += skillMatchPct * 0.35;                              // 35% weight
  atsScore += (sectionScore / sectionTotal) * 100 * 0.25;       // 25% weight
  atsScore += keywordScore * 0.20;                               // 20% weight
  atsScore += Math.min(achievements * 5, 100) * 0.10;           // 10% weight
  atsScore += Math.min(actionVerbs * 3, 100) * 0.10;            // 10% weight
  atsScore = Math.round(Math.min(atsScore, 100));

  // Resume strength: holistic quality
  let strengthScore = 0;
  if (wordCount >= 200) strengthScore += 15; else if (wordCount >= 100) strengthScore += 8;
  if (hasContact) strengthScore += 10;
  if (hasGithub) strengthScore += 10;
  if (hasLinkedin) strengthScore += 5;
  strengthScore += Math.min(bulletCount * 2, 20);
  strengthScore += Math.min(achievements * 4, 20);
  strengthScore += Math.min(actionVerbs * 2, 20);
  strengthScore = Math.round(Math.min(strengthScore, 100));

  // Optimized estimate (what score could be with improvements)
  const optimizedScore = Math.min(100, atsScore + Math.round(missingRequired.length * 5) + (missingSections.length * 4));

  // ─── 6. Generate suggestions ───
  const suggestions = generateSuggestions(
    missingRequired, missingBonus, missingSections, achievements,
    actionVerbs, hasGithub, hasLinkedin, wordCount, bulletCount, targetRole
  );

  // ─── 7. ATS checklist ───
  const checklist = generateChecklist(detectedSections, hasContact, hasGithub, matchedRequired, role, wordCount);

  return {
    targetRole,
    atsScore,
    strengthScore,
    skillMatchPct,
    optimizedScore,
    improvementPct: optimizedScore - atsScore,
    matchedRequired,
    missingRequired,
    matchedBonus,
    missingBonus,
    matchedKeywords,
    detectedSections,
    missingSections,
    sectionScore,
    sectionTotal,
    wordCount,
    achievements,
    actionVerbs,
    hasGithub,
    hasLinkedin,
    hasContact,
    suggestions,
    checklist,
  };
}

// ─── Suggestion generator ───
function generateSuggestions(missingReq, missingBonus, missingSec, achievements, verbs, github, linkedin, words, bullets, role) {
  const s = [];

  if (missingReq.length > 0) {
    s.push({ priority: 'high', icon: '🔴', text: `Add missing required skills: ${missingReq.join(', ')}` });
  }

  if (missingSec.length > 0) {
    missingSec.forEach(sec => {
      s.push({ priority: 'high', icon: '📋', text: `Add a "${sec}" section to your resume` });
    });
  }

  if (achievements < 3) {
    s.push({ priority: 'high', icon: '📊', text: 'Include more measurable achievements (e.g., "Increased performance by 40%")' });
  }

  if (verbs < 5) {
    s.push({ priority: 'medium', icon: '💪', text: 'Use more action verbs (e.g., "Developed", "Implemented", "Led", "Optimized")' });
  }

  if (!github) {
    s.push({ priority: 'medium', icon: '🔗', text: 'Add a GitHub link to showcase your projects and code' });
  }

  if (!linkedin) {
    s.push({ priority: 'low', icon: '💼', text: 'Include your LinkedIn profile URL' });
  }

  if (words < 200) {
    s.push({ priority: 'high', icon: '📝', text: 'Your resume seems too short. Aim for 400–700 words for better ATS performance' });
  } else if (words > 1200) {
    s.push({ priority: 'medium', icon: '✂️', text: 'Consider trimming your resume. Keep it concise (1–2 pages max)' });
  }

  if (bullets < 5) {
    s.push({ priority: 'medium', icon: '📌', text: 'Use more bullet points to improve readability and ATS parsing' });
  }

  if (missingBonus.length > 0) {
    s.push({ priority: 'low', icon: '⭐', text: `Consider adding bonus skills: ${missingBonus.slice(0, 4).join(', ')}` });
  }

  s.push({ priority: 'low', icon: '🎯', text: `Tailor your resume specifically for "${role}" positions` });

  return s;
}

// ─── ATS checklist generator ───
function generateChecklist(sections, hasContact, hasGithub, matched, role, words) {
  return [
    { label: 'Contact information present', done: hasContact },
    { label: 'Skills section included', done: !!sections['Skills'] },
    { label: 'Experience section included', done: !!sections['Experience'] },
    { label: 'Education section included', done: !!sections['Education'] },
    { label: 'Projects section included', done: !!sections['Projects'] },
    { label: 'Professional summary included', done: !!sections['Summary'] },
    { label: 'GitHub/portfolio link added', done: hasGithub },
    { label: `At least ${Math.ceil(role.required.length / 2)} core skills present`, done: matched.length >= Math.ceil(role.required.length / 2) },
    { label: 'Resume has sufficient content (200+ words)', done: words >= 200 },
    { label: 'All required skills present', done: matched.length === role.required.length },
  ];
}
