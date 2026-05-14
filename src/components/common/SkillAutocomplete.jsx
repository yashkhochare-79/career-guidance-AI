import React, { useState, useRef, useEffect } from 'react';
import { ALL_SKILLS } from '../../data/skillSuggestions';
import { X } from 'lucide-react';
import './SkillAutocomplete.css';

const SkillAutocomplete = ({ selectedSkills = [], onChange, placeholder = 'Type a skill...', error }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim().length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const query = inputValue.toLowerCase();
    const filtered = ALL_SKILLS.filter(
      skill =>
        skill.toLowerCase().includes(query) &&
        !selectedSkills.includes(skill)
    ).slice(0, 8); // Limit to 8 suggestions

    setSuggestions(filtered);
    setShowDropdown(filtered.length > 0);
    setHighlightIndex(-1);
  }, [inputValue, selectedSkills]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addSkill = (skill) => {
    if (skill && !selectedSkills.includes(skill)) {
      onChange([...selectedSkills, skill]);
    }
    setInputValue('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const removeSkill = (skillToRemove) => {
    onChange(selectedSkills.filter(s => s !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && suggestions[highlightIndex]) {
        addSkill(suggestions[highlightIndex]);
      } else if (inputValue.trim()) {
        // Allow custom skill entry
        addSkill(inputValue.trim());
      }
    } else if (e.key === 'Backspace' && inputValue === '' && selectedSkills.length > 0) {
      removeSkill(selectedSkills[selectedSkills.length - 1]);
    }
  };

  return (
    <div className="autocomplete-container">
      <div className={`autocomplete-input-area ${error ? 'has-error' : ''}`}>
        {/* Skill Tags */}
        <div className="selected-tags">
          {selectedSkills.map(skill => (
            <span key={skill} className="skill-chip-tag">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="chip-remove">
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.length >= 1 && suggestions.length > 0 && setShowDropdown(true)}
            placeholder={selectedSkills.length === 0 ? placeholder : ''}
            className="autocomplete-input"
          />
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <div className="suggestions-dropdown" ref={dropdownRef}>
          {suggestions.map((skill, idx) => (
            <div
              key={skill}
              className={`suggestion-item ${idx === highlightIndex ? 'highlighted' : ''}`}
              onClick={() => addSkill(skill)}
              onMouseEnter={() => setHighlightIndex(idx)}
            >
              <span className="suggestion-text">{skill}</span>
              <span className="suggestion-hint">Click to add</span>
            </div>
          ))}
        </div>
      )}

      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default SkillAutocomplete;
