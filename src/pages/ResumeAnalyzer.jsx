import React, { useState, useRef, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useUser } from '../context/UserContext';
import { analyzeResume, ROLE_REQUIREMENTS } from '../data/resumeAnalyzer';
import {
  Upload, FileText, ChevronDown, Target, AlertCircle, CheckCircle2,
  TrendingUp, Zap, BarChart2, Shield, X, File, Loader, Star
} from 'lucide-react';
import './ResumeAnalyzer.css';

// ─── PDF text extraction using pdfjs-dist ───
async function extractPdfText(file) {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(' ') + '\n';
  }
  return fullText;
}

// ─── DOCX text extraction using mammoth ───
async function extractDocxText(file) {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

const ResumeAnalyzer = () => {
  const { user } = useUser();
  const fileInputRef = useRef(null);

  // State
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState(
    Object.keys(ROLE_REQUIREMENTS).find(r => r.toLowerCase() === (user.careerGoal || '').toLowerCase()) || 'Frontend Developer'
  );
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ─── File handling ───
  const processFile = useCallback(async (selectedFile) => {
    setError('');
    setAnalysis(null);

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!validTypes.includes(selectedFile.type) && !['pdf', 'docx'].includes(ext)) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    // Validate size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }

    setFile(selectedFile);
    setIsAnalyzing(true);

    // Simulate upload progress
    let prog = 0;
    const progInterval = setInterval(() => {
      prog += Math.random() * 25;
      if (prog > 90) prog = 90;
      setUploadProgress(Math.round(prog));
    }, 200);

    try {
      // Extract text based on file type
      let text = '';
      if (ext === 'pdf' || selectedFile.type === 'application/pdf') {
        text = await extractPdfText(selectedFile);
      } else {
        text = await extractDocxText(selectedFile);
      }

      clearInterval(progInterval);
      setUploadProgress(100);

      if (!text || text.trim().length < 20) {
        setError('Could not extract text from this file. Please try a different file.');
        setIsAnalyzing(false);
        return;
      }

      setResumeText(text);

      // Run analysis
      await new Promise(r => setTimeout(r, 800)); // UX delay
      const result = analyzeResume(text, targetRole);
      setAnalysis(result);
    } catch (err) {
      console.error('File processing error:', err);
      setError('Failed to process file. Please try again with a different file.');
    } finally {
      clearInterval(progInterval);
      setIsAnalyzing(false);
    }
  }, [targetRole]);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const reAnalyze = () => {
    if (resumeText) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setAnalysis(analyzeResume(resumeText, targetRole));
        setIsAnalyzing(false);
      }, 600);
    }
  };

  const removeFile = () => {
    setFile(null);
    setResumeText('');
    setAnalysis(null);
    setUploadProgress(0);
    setError('');
  };

  const getScoreColor = (score) => {
    if (score >= 75) return '#10B981';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <DashboardLayout>
      <div className="ra-container">
        {/* Header */}
        <div className="ra-header animate-fade-in-up">
          <div>
            <h1 className="page-title">Resume Analyzer</h1>
            <p className="page-subtitle">AI-powered ATS analysis to optimize your resume for job applications.</p>
          </div>
          <div className="role-selector">
            <span className="selector-label">Target Role:</span>
            <div className="custom-select-wrapper">
              <select className="role-select" value={targetRole} onChange={(e) => { setTargetRole(e.target.value); if (analysis) reAnalyze(); }}>
                {Object.keys(ROLE_REQUIREMENTS).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown className="select-icon" size={18} />
            </div>
          </div>
        </div>

        {/* Upload Area (only show when no analysis) */}
        {!analysis && (
          <div className="ra-upload-section animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div
              className={`upload-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.docx" hidden onChange={handleFileChange} />

              {isAnalyzing ? (
                <div className="upload-progress">
                  <Loader size={40} className="spin upload-spinner" />
                  <h3>{uploadProgress < 100 ? 'Extracting resume text...' : 'Analyzing resume...'}</h3>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              ) : file ? (
                <div className="file-preview">
                  <File size={40} className="file-icon" />
                  <div className="file-info">
                    <h3>{file.name}</h3>
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button className="remove-file" onClick={(e) => { e.stopPropagation(); removeFile(); }}>
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="upload-prompt">
                  <div className="upload-icon-wrapper">
                    <Upload size={32} />
                  </div>
                  <h3>Drop your resume here</h3>
                  <p>or <span className="upload-link">click to browse</span></p>
                  <span className="upload-formats">Supports PDF, DOCX • Max 10MB</span>
                </div>
              )}
            </div>

            {error && (
              <div className="upload-error">
                <AlertCircle size={16} /> {error}
              </div>
            )}
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="ra-results">
            {/* Score Cards Row */}
            <div className="ra-scores-row animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <ScoreCard title="ATS Score" score={analysis.atsScore} label={getScoreLabel(analysis.atsScore)} color={getScoreColor(analysis.atsScore)} icon={Shield} />
              <ScoreCard title="Skill Match" score={analysis.skillMatchPct} label={`${analysis.matchedRequired.length}/${analysis.matchedRequired.length + analysis.missingRequired.length} skills`} color={getScoreColor(analysis.skillMatchPct)} icon={Target} />
              <ScoreCard title="Resume Strength" score={analysis.strengthScore} label={getScoreLabel(analysis.strengthScore)} color={getScoreColor(analysis.strengthScore)} icon={Zap} />
            </div>

            {/* Improvement Tracker */}
            <div className="ra-improvement animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <div className="imp-card">
                <div className="imp-scores">
                  <div className="imp-current">
                    <span className="imp-label">Current</span>
                    <span className="imp-value" style={{ color: getScoreColor(analysis.atsScore) }}>{analysis.atsScore}%</span>
                  </div>
                  <div className="imp-arrow">→</div>
                  <div className="imp-optimized">
                    <span className="imp-label">Potential</span>
                    <span className="imp-value" style={{ color: '#10B981' }}>{analysis.optimizedScore}%</span>
                  </div>
                </div>
                <div className="imp-bar">
                  <div className="imp-bar-current" style={{ width: `${analysis.atsScore}%` }}></div>
                  <div className="imp-bar-potential" style={{ width: `${analysis.optimizedScore}%` }}></div>
                </div>
                <p className="imp-text">You can improve your ATS score by <strong>+{analysis.improvementPct}%</strong> by following the suggestions below.</p>
              </div>
            </div>

            <div className="ra-grid">
              {/* Left Column */}
              <div className="ra-col-left">
                {/* Missing Skills */}
                <div className="ra-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="ra-card-header">
                    <h3><AlertCircle size={18} /> Missing Skills</h3>
                    <span className="badge badge-red">{analysis.missingRequired.length} missing</span>
                  </div>
                  {analysis.missingRequired.length > 0 ? (
                    <div className="missing-list">
                      {analysis.missingRequired.map((skill, i) => (
                        <div className="missing-item" key={i}>
                          <X size={14} className="text-red" />
                          <span>{skill}</span>
                          <span className="priority-tag high">Required</span>
                        </div>
                      ))}
                      {analysis.missingBonus.slice(0, 4).map((skill, i) => (
                        <div className="missing-item" key={'b' + i}>
                          <X size={14} className="text-amber" />
                          <span>{skill}</span>
                          <span className="priority-tag low">Bonus</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="all-good">🎉 You have all required skills for this role!</p>
                  )}
                </div>

                {/* Matched Skills */}
                <div className="ra-card animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                  <div className="ra-card-header">
                    <h3><CheckCircle2 size={18} /> Matched Skills</h3>
                    <span className="badge badge-green">{analysis.matchedRequired.length} found</span>
                  </div>
                  <div className="matched-tags">
                    {analysis.matchedRequired.map((s, i) => (
                      <span key={i} className="tag-matched"><CheckCircle2 size={12} /> {s}</span>
                    ))}
                    {analysis.matchedBonus.map((s, i) => (
                      <span key={'b' + i} className="tag-bonus"><Star size={12} /> {s}</span>
                    ))}
                    {analysis.matchedRequired.length === 0 && analysis.matchedBonus.length === 0 && (
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }}>No matching skills found in your resume.</p>
                    )}
                  </div>
                </div>

                {/* Sections Detected */}
                <div className="ra-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="ra-card-header">
                    <h3><FileText size={18} /> Resume Sections</h3>
                    <span className="badge badge-blue">{analysis.sectionScore}/{analysis.sectionTotal}</span>
                  </div>
                  <div className="sections-list">
                    {Object.entries(analysis.detectedSections).map(([sec, found]) => (
                      <div className={`section-item ${found ? 'found' : 'not-found'}`} key={sec}>
                        {found ? <CheckCircle2 size={16} className="text-green" /> : <AlertCircle size={16} className="text-red" />}
                        <span>{sec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="ra-col-right">
                {/* Suggestions */}
                <div className="ra-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="ra-card-header">
                    <h3><TrendingUp size={18} /> Smart Suggestions</h3>
                  </div>
                  <div className="suggestions-list">
                    {analysis.suggestions.map((sug, i) => (
                      <div className={`suggestion-item priority-${sug.priority}`} key={i}>
                        <span className="sug-icon">{sug.icon}</span>
                        <span className="sug-text">{sug.text}</span>
                        <span className={`priority-pill ${sug.priority}`}>{sug.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ATS Checklist */}
                <div className="ra-card animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                  <div className="ra-card-header">
                    <h3><Shield size={18} /> ATS Optimization Checklist</h3>
                  </div>
                  <div className="checklist">
                    {analysis.checklist.map((item, i) => (
                      <label className={`check-item ${item.done ? 'done' : ''}`} key={i}>
                        <input type="checkbox" checked={item.done} readOnly />
                        <span className="custom-check"></span>
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Resume Stats */}
                <div className="ra-card stats-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="ra-card-header"><h3><BarChart2 size={18} /> Resume Stats</h3></div>
                  <div className="stats-grid">
                    <div className="stat-box"><span className="stat-num">{analysis.wordCount}</span><span className="stat-lbl">Words</span></div>
                    <div className="stat-box"><span className="stat-num">{analysis.achievements}</span><span className="stat-lbl">Achievements</span></div>
                    <div className="stat-box"><span className="stat-num">{analysis.actionVerbs}</span><span className="stat-lbl">Action Verbs</span></div>
                    <div className="stat-box"><span className="stat-num">{analysis.matchedKeywords.length}</span><span className="stat-lbl">Keywords</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="ra-actions animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <button className="btn btn-outline" onClick={removeFile}>
                <Upload size={18} /> Upload New Resume
              </button>
              <button className="btn btn-primary" onClick={reAnalyze}>
                <Target size={18} /> Re-Analyze for {targetRole}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// ─── Score Card Component ───
function ScoreCard({ title, score, label, color, icon: Icon }) {
  const deg = Math.round((score / 100) * 360);
  return (
    <div className="score-card">
      <div className="score-card-top">
        <Icon size={20} style={{ color }} />
        <span className="score-title">{title}</span>
      </div>
      <div className="score-ring" style={{ background: `conic-gradient(${color} ${deg}deg, var(--color-gray-light) ${deg}deg)` }}>
        <div className="score-ring-inner">
          <span className="score-num" style={{ color }}>{score}%</span>
        </div>
      </div>
      <span className="score-label" style={{ color }}>{label}</span>
    </div>
  );
}

export default ResumeAnalyzer;
