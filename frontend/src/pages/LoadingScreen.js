import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return 100;
        }
        
        const newProgress = prevProgress + Math.floor(Math.random() * 2) + 1;
        
        if (newProgress < 40) setStatusText('Establishing Connection...');
        else if (newProgress < 80) setStatusText('Loading Data...');
        else setStatusText('Finalizing...');

        return newProgress;
      });
    }, 80); 

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="loading-container">
      <div className="bg-glow"></div>
      <div className="loading-content">
        <div className="orbit-spinner">
          <div className="center-core"></div>
          <div className="ring ring-1"><div className="dot dot-1"></div></div>
          <div className="ring ring-2"><div className="dot dot-2"></div></div>
          <div className="ring ring-3"><div className="dot dot-3"></div></div>
        </div>
        <h2 className="loading-text">Initializing</h2>
        <div className="progress-wrapper">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-percentage">{progress}%</div>
        </div>
        <div className="bouncing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div className="loading-footer">
        <div className="status-item">
          <span className="status-dot green"></span> System Online
        </div>
        <div className="status-item">
          <span className="status-dot blue"></span> {statusText}
        </div>
        <div className="status-item">
          <span className="status-dot purple"></span> Initializing
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;