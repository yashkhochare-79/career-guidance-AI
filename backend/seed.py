# ============================================
# Database Seed Script
# ============================================
# Run this script ONCE to populate the MongoDB
# database with sample job listings for testing.
#
# Usage:  python seed.py
# ============================================

from pymongo import MongoClient
import datetime

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/careerpath_ai")
db = client["careerpath_ai"]

# ─── Sample Job Listings ───
sample_jobs = [
    {
        "title": "Frontend Developer",
        "company": "TechNova Solutions",
        "location": "Bangalore, India",
        "type": "Full-Time",
        "experience": "Entry Level",
        "salary": "₹6L – ₹10L",
        "domain": "Web Development",
        "description": "Build modern, responsive web interfaces using React and TypeScript.",
        "requiredSkills": ["HTML", "CSS", "JavaScript", "React"],
        "bonusSkills": ["TypeScript", "Next.js", "Tailwind CSS"],
        "featured": True,
        "createdAt": datetime.datetime.utcnow(),
    },
    {
        "title": "React Intern",
        "company": "StartupHub",
        "location": "Remote",
        "type": "Internship",
        "experience": "Fresher",
        "salary": "₹15K/month",
        "domain": "Web Development",
        "description": "Work on real features shipped to thousands of users.",
        "requiredSkills": ["HTML", "CSS", "JavaScript", "React"],
        "bonusSkills": ["Git", "REST APIs"],
        "featured": False,
        "createdAt": datetime.datetime.utcnow(),
    },
    {
        "title": "Junior Data Analyst",
        "company": "DataMetrics Inc.",
        "location": "Hyderabad, India",
        "type": "Full-Time",
        "experience": "Entry Level",
        "salary": "₹5L – ₹8L",
        "domain": "Data Science",
        "description": "Analyze business data and create dashboards.",
        "requiredSkills": ["SQL", "Excel", "Python", "Tableau"],
        "bonusSkills": ["Power BI", "Statistics"],
        "featured": False,
        "createdAt": datetime.datetime.utcnow(),
    },
    {
        "title": "Python Developer",
        "company": "CloudServe Technologies",
        "location": "Pune, India",
        "type": "Full-Time",
        "experience": "0-1 Years",
        "salary": "₹5L – ₹9L",
        "domain": "Backend Development",
        "description": "Develop backend services using Python and Django.",
        "requiredSkills": ["Python", "Django", "SQL", "REST APIs"],
        "bonusSkills": ["Docker", "AWS", "Redis"],
        "featured": False,
        "createdAt": datetime.datetime.utcnow(),
    },
    {
        "title": "Full Stack Developer Intern",
        "company": "InnoTech Labs",
        "location": "Remote",
        "type": "Internship",
        "experience": "Fresher",
        "salary": "₹20K/month",
        "domain": "Web Development",
        "description": "Work across the full stack — React frontends to Node.js APIs.",
        "requiredSkills": ["JavaScript", "React", "Node.js", "MongoDB"],
        "bonusSkills": ["Express", "Git"],
        "featured": True,
        "createdAt": datetime.datetime.utcnow(),
    },
    {
        "title": "Machine Learning Intern",
        "company": "AI Dynamics",
        "location": "Bangalore, India",
        "type": "Internship",
        "experience": "Fresher",
        "salary": "₹25K/month",
        "domain": "AI / ML",
        "description": "Build and evaluate ML models for NLP and vision tasks.",
        "requiredSkills": ["Python", "NumPy", "Pandas", "Scikit-learn"],
        "bonusSkills": ["PyTorch", "TensorFlow", "NLP"],
        "featured": False,
        "createdAt": datetime.datetime.utcnow(),
    },
]

# ─── Seed the database ───
if __name__ == "__main__":
    # Clear existing jobs (optional — remove this line to keep old data)
    db.jobs.delete_many({})

    # Insert sample jobs
    result = db.jobs.insert_many(sample_jobs)
    print(f"✅ Seeded {len(result.inserted_ids)} jobs into the database!")
    print("   Job IDs:", [str(i) for i in result.inserted_ids])
