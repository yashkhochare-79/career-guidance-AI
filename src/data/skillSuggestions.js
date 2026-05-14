// ============================================
// Predefined Skill Suggestions Database
// ============================================
// Organized by category for autocomplete suggestions.

const SKILL_SUGGESTIONS = {
  "Programming Languages": [
    "Python", "JavaScript", "Java", "C++", "C#", "C", "TypeScript",
    "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala",
    "R", "MATLAB", "Perl", "Dart", "Lua", "Shell Scripting"
  ],
  "Web Development": [
    "HTML", "CSS", "React", "Angular", "Vue.js", "Next.js", "Svelte",
    "Node.js", "Express.js", "Django", "Flask", "Spring Boot",
    "Tailwind CSS", "Bootstrap", "SASS", "REST APIs", "GraphQL",
    "WebSockets", "Webpack", "Vite", "jQuery"
  ],
  "Data Science": [
    "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn",
    "Jupyter Notebook", "SQL", "Excel", "Tableau", "Power BI",
    "Statistics", "Data Wrangling", "EDA", "Feature Engineering",
    "A/B Testing", "Apache Spark", "Hadoop"
  ],
  "AI / ML": [
    "PyTorch", "TensorFlow", "Keras", "Deep Learning", "NLP",
    "Computer Vision", "Reinforcement Learning", "GANs",
    "Transformers", "BERT", "GPT", "LLMs", "Hugging Face",
    "OpenCV", "YOLO", "MLflow", "Model Deployment"
  ],
  "Cybersecurity": [
    "Network Security", "Ethical Hacking", "Penetration Testing",
    "Cryptography", "Firewall Management", "SIEM", "SOC",
    "Vulnerability Assessment", "Wireshark", "Burp Suite",
    "Linux Security", "OWASP", "Incident Response"
  ],
  "UI/UX": [
    "Figma", "Adobe XD", "Sketch", "Wireframing", "Prototyping",
    "User Research", "Usability Testing", "Design Thinking",
    "Interaction Design", "UI Design", "Information Architecture",
    "Adobe Illustrator", "Adobe Photoshop", "Canva"
  ],
  "Cloud Computing": [
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
    "Terraform", "Ansible", "CI/CD", "Jenkins", "GitHub Actions",
    "Linux", "Nginx", "Serverless", "Microservices",
    "Load Balancing", "CloudFormation"
  ],
  "Databases": [
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase",
    "SQLite", "Oracle", "Cassandra", "DynamoDB", "Elasticsearch"
  ],
  "Soft Skills": [
    "Communication", "Leadership", "Teamwork", "Problem Solving",
    "Critical Thinking", "Time Management", "Public Speaking",
    "Project Management", "Agile", "Scrum"
  ]
};

// Flatten all skills into a single sorted array for autocomplete
export const ALL_SKILLS = Object.values(SKILL_SUGGESTIONS).flat().sort();

// Export categories for grouped display
export const SKILL_CATEGORIES = SKILL_SUGGESTIONS;

export default SKILL_SUGGESTIONS;
