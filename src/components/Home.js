import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    const themes = [
      'Bactériologie',
      'Biochimie',
      'Biologie cellulaire et moléculaire',
      'Biomathématiques',
      'Biophysique',
      'Chimie analytique',
      'Chimie générale et bio inorganique',
      'Chimie organique',
      'Chimie thérapeutique',
      'Droit pharmaceutique',
      'Hématologie',
      'Immunologie',
      'Parasitologie, mycologie médicale et biologie animale',
      'Pharmacie galénique',
      'Pharmacognosie',
      'Pharmacologie et pharmacie clinique',
      'Physiologie',
      'Sciences végétales et fongiques',
      'Toxicologie et santé publique',
      'Virologie'
    ];
    setThemes(themes);
  }, []);

  return (
    <div className="home-container">
      <h1>Medical Quiz App</h1>
      <p>Choose a theme to start practicing:</p>
      <div className="themes-grid">
        {themes.map((theme, index) => (
          <Link to={`/quiz/${theme}`} key={index} className="theme-card">
            <h2>{theme}</h2>
            <p>Start Quiz →</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
