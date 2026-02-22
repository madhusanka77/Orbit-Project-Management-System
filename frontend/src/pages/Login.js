import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import './LandingPage.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const particlesConfig = {
    fullScreen: { enable: true, zIndex: -1 },
    background: {
      color: { value: "#02040A" },
    },
    particles: {
      number: { value: 70, density: { enable: true, value_area: 800 } },
      color: { value: ["#38bdf8", "#c084fc", "#ffffff"] },
      links: {
        enable: true,
        color: "#38bdf8",
        distance: 150,
        opacity: 0.3,
        width: 1,
      },
      move: { enable: true, speed: 1.5, direction: "none", outModes: { default: "bounce" } },
      size: { value: { min: 1, max: 3 } },
      opacity: { value: 0.7 },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        grab: { distance: 200, links: { opacity: 0.6 } },
        push: { quantity: 4 },
      },
    },
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    setLoading(true);

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      
      const { data } = await axios.post(
        'http://localhost:5000/api/users/login', 
        { email, password }, 
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success("Login Successful! 🚀");
      navigate('/dashboard');

    } catch (error) {
      console.error(error.response?.data);
      toast.error(error.response?.data?.message || 'Invalid Email or Password');
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      
      <Particles id="tsparticles-login" init={particlesInit} options={particlesConfig} />

      <div className="content-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', position: 'relative', zIndex: 10 }}>
        
        {/* Back to Home Button */}
        <Link to="/" style={{ position: 'absolute', top: '30px', left: '30px', display: 'inline-flex', alignItems: 'center', color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold', background: 'rgba(56, 189, 248, 0.1)', padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.3)', transition: 'all 0.3s ease' }}
          onMouseOver={(e) => {e.target.style.background = '#38bdf8'; e.target.style.color = '#0f172a';}}
          onMouseOut={(e) => {e.target.style.background = 'rgba(56, 189, 248, 0.1)'; e.target.style.color = '#38bdf8';}}
        >
          ← Back to Home
        </Link>

        <div className="auth-box" style={{ 
          maxWidth: '400px', 
          width: '100%',
          background: 'rgba(30, 41, 59, 0.6)', 
          backdropFilter: 'blur(12px)', 
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          padding: '40px',
          borderRadius: '20px'
        }}>
          
          <h2 className="auth-title" style={{ textAlign: 'center', marginBottom: '20px', color: '#fff' }}>Welcome Back 👋</h2>
          
          <form onSubmit={submitHandler}>
            <label className="auth-label">Email Address</label>
            <input 
              type="email" 
              className="auth-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            
            <label className="auth-label">Password</label>
            <input 
              type="password" 
              className="auth-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            
            <button 
              type="submit" 
              className="auth-btn btn-primary"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', width: '100%', marginTop: '10px' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
          </form>
          
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#cbd5e1' }}>
            Don't have an account? <Link to="/register" style={{ color: '#38bdf8', fontWeight: 'bold', textDecoration: 'none' }}>Register here</Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;