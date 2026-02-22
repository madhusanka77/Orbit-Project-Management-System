import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import AOS from 'aos';           // 🔴 අලුතින් එකතු කළා
import 'aos/dist/aos.css';       // 🔴 අලුතින් එකතු කළා
import { FaTwitter, FaLinkedinIn, FaGithub, FaArrowUp } from "react-icons/fa"; // 🔴 Icons Import කළා
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo');

  const [typedText, setTypedText] = useState('');
  const headlineText = "Manage Projects at Light Speed 🚀";

  // 🔴 Back to Top Button Logic
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    if (typedText.length < headlineText.length) {
      const timeout = setTimeout(() => {
        setTypedText(headlineText.slice(0, typedText.length + 1));
      }, 100); 
      return () => clearTimeout(timeout);
    }
  }, [typedText]);

  // 🔴 Scroll Animation Initialize කිරීම
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,     
      offset: 100,    
    });
  }, []);

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const particlesConfig = {
    fullScreen: { enable: true, zIndex: -1 }, 
    background: { color: { value: "#02040A" } },
    particles: {
      number: { value: 70, density: { enable: true, value_area: 800 } },
      color: { value: ["#38bdf8", "#c084fc", "#ffffff"] }, 
      links: { enable: true, color: "#38bdf8", distance: 150, opacity: 0.3, width: 1 },
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

  return (
    <div className="landing-page page-container">
      
      <nav className="navbar landing-navbar" style={{background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', position: 'fixed', width: '100%', zIndex: 100, top: 0}}>
        <div className="nav-logo">
          <span className="nav-logo-icon" style={{fontSize: '28px'}}>🛰️</span>
          <span className="nav-logo-text gradient-text" style={{fontSize: '24px', fontWeight: 'bold', marginLeft: '10px'}}>ORBIT</span>
        </div>
        <ul className="nav-links-container">
          <li><a href="#features" className="nav-link">Features</a></li>
          <li><a href="#services" className="nav-link">Services</a></li>
          <li><a href="#process" className="nav-link">Process</a></li>
          <li><Link to="/login" className="nav-link">Login</Link></li>
          <li><Link to="/register" className="nav-link highlight-link">Register</Link></li>
        </ul>
      </nav>

      <section className="hero-section" style={{marginTop: '0'}}>
        <Particles id="tsparticles" init={particlesInit} options={particlesConfig} />
        <div className="hero-content" data-aos="zoom-in" style={{paddingTop: '80px', zIndex: 10, position: 'relative'}}>
          <h1 className="hero-title">
            <span className="typing-text">{typedText}</span>
            <span className="cursor">|</span>
          </h1>
          <p className="hero-subtitle">
            Orbit is the ultimate workspace for teams to collaborate, track progress, and launch ideas into reality.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">Why Choose <span className="text-blue">Orbit?</span></h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Cutting-edge features powered by modern technology.</p>

          <div className="features-grid">
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-icon-box blue-gradient">📊</div>
              <div className="feature-info">
                <h3>Smart Task Management</h3>
                <p>Organize, prioritize, and track tasks with our intuitive dashboard.</p>
              </div>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-icon-box purple-gradient">👥</div>
              <div className="feature-info">
                <h3>Team Collaboration</h3>
                <p>Real-time updates and seamless communication for your team.</p>
              </div>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="400">
              <div className="feature-icon-box green-gradient">📢</div>
              <div className="feature-info">
                <h3>Instant Notices</h3>
                <p>Broadcast company-wide announcements instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* === OUR SERVICES SECTION === */}
      <section id="services" className="features-section">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">Our <span className="text-blue">Services</span></h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Comprehensive digital solutions tailored for your success.</p>

          <div className="features-grid">
            
            {/* Service 1 */}
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-icon-box blue-gradient" style={{ fontSize: '30px' }}>💻</div>
              <div className="feature-info">
                <h3>Web Applications</h3>
                <p>Custom, responsive, and high-performance MERN stack web applications.</p>
              </div>
            </div>

            {/* Service 2 */}
            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-icon-box purple-gradient" style={{ fontSize: '30px' }}>🎨</div>
              <div className="feature-info">
                <h3>UI/UX Design</h3>
                <p>Beautiful, intuitive interfaces that provide exceptional user experiences.</p>
              </div>
            </div>

            {/* Service 3 */}
            <div className="feature-card" data-aos="fade-up" data-aos-delay="400">
              <div className="feature-icon-box green-gradient" style={{ fontSize: '30px' }}>⚙️</div>
              <div className="feature-info">
                <h3>API Integration</h3>
                <p>Seamlessly connect your systems with robust, secure RESTful APIs.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="process" className="process-section">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">Our <span className="text-purple">Process</span></h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">A structured approach to delivering results.</p>

          <div className="process-grid">
            <div className="process-card" data-aos="zoom-in-up" data-aos-delay="100">
              <div className="process-icon blue-box">🎯</div>
              <h3 className="process-step">01</h3>
              <h4>Create Workspace</h4>
              <p>Start by creating a dedicated workspace for your project.</p>
            </div>
            <div className="process-card" data-aos="zoom-in-up" data-aos-delay="200">
              <div className="process-icon purple-box">⚡</div>
              <h3 className="process-step">02</h3>
              <h4>Invite Team</h4>
              <p>Add members to your workspace and assign roles.</p>
            </div>
            <div className="process-card" data-aos="zoom-in-up" data-aos-delay="300">
              <div className="process-icon green-box">📝</div>
              <h3 className="process-step">03</h3>
              <h4>Assign Tasks</h4>
              <p>Create tasks, set priorities, and assign deadlines.</p>
            </div>
            <div className="process-card" data-aos="zoom-in-up" data-aos-delay="400">
              <div className="process-icon orange-box">🚀</div>
              <h3 className="process-step">04</h3>
              <h4>Track Success</h4>
              <p>Monitor progress and celebrate project completion.</p>
            </div>
            <div className="process-card" data-aos="zoom-in-up" data-aos-delay="500">
              <div className="process-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', boxShadow: '0 5px 15px rgba(14, 165, 233, 0.3)' }}>💬</div>
              <h3 className="process-step">05</h3>
              <h4>Collaborate</h4>
              <p>Share updates, leave feedback, and communicate in real-time.</p>
            </div>
            <div className="process-card" data-aos="zoom-in-up" data-aos-delay="600">
              <div className="process-icon" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #e11d48 100%)', boxShadow: '0 5px 15px rgba(236, 72, 153, 0.3)' }}>🏆</div>
              <h3 className="process-step">06</h3>
              <h4>Deliver Results</h4>
              <p>Complete milestones and successfully launch your project.</p>
            </div>
          </div>
        </div>
      </section>

      {/* === TECH STACK SECTION === */}
      <section id="tech-stack" className="features-section" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">Powered by <span className="text-blue">Modern Tech</span></h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Built from scratch using the industry-standard MERN Stack.</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginTop: '40px' }}>
            {/* React.js */}
            <div data-aos="fade-up" data-aos-delay="100" style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '30px 40px', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.3)', textAlign: 'center', minWidth: '160px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '50px', marginBottom: '15px', color: '#61dafb' }}>⚛️</div>
              <h4 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>React.js</h4>
              <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Frontend UI</p>
            </div>

            {/* Node.js */}
            <div data-aos="fade-up" data-aos-delay="200" style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '30px 40px', borderRadius: '20px', border: '1px solid rgba(52, 211, 153, 0.3)', textAlign: 'center', minWidth: '160px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '50px', marginBottom: '15px', color: '#339933' }}>🟢</div>
              <h4 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>Node.js</h4>
              <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Runtime Env</p>
            </div>

            {/* Express.js */}
            <div data-aos="fade-up" data-aos-delay="300" style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '30px 40px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center', minWidth: '160px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '50px', marginBottom: '15px', color: '#fff' }}>🚂</div>
              <h4 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>Express.js</h4>
              <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Backend API</p>
            </div>

            {/* MongoDB */}
            <div data-aos="fade-up" data-aos-delay="400" style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '30px 40px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center', minWidth: '160px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '50px', marginBottom: '15px', color: '#47A248' }}>🍃</div>
              <h4 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>MongoDB</h4>
              <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Database</p>
            </div>
          </div>
        </div>
      </section>

      {/* === FINAL CTA SECTION === */}
      <section className="cta-section" style={{ 
          textAlign: 'center', 
          padding: '120px 20px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.05) 0%, transparent 60%)' 
        }}>
        <div className="container" data-aos="zoom-in" data-aos-duration="1000">
          <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px', color: '#fff' }}>
            Ready to Launch Your <span style={{ color: '#c084fc' }}>Project?</span> 🚀
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
            Join the next generation of developers and teams using Orbit to collaborate, track progress, and deliver their best work on time.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ 
              padding: '15px 40px', 
              fontSize: '1.2rem', 
              borderRadius: '30px', 
              boxShadow: '0 10px 25px rgba(56, 189, 248, 0.4)',
              transition: 'transform 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Create Free Account
          </Link>
        </div>
      </section>
      
      {/* === FOOTER (REDESIGNED) === */}
      <footer className="footer-section">
        <div className="container footer-grid">
          
          <div className="footer-col brand-col" data-aos="fade-right">
            <div className="nav-logo footer-brand">
              <span className="nav-logo-icon" style={{fontSize: '28px'}}>🛰️</span>
              <span className="nav-logo-text gradient-text" style={{fontSize: '24px', fontWeight: 'bold', marginLeft: '10px'}}>ORBIT</span>
            </div>
            <p className="footer-desc">Transforming ideas into intelligent digital solutions with modern web technologies.</p>
            <div className="social-icons">
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaLinkedinIn /></a>
              <a href="https://github.com/AshenKaveesha/Orbit" target="_blank" rel="noopener noreferrer" className="social-icon"><FaGithub /></a>
            </div>
          </div>

          <div className="footer-col links-col" data-aos="fade-up" data-aos-delay="100">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#tech-stack">Tech Stack</a></li>
              <li><a href="#process">Our Process</a></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          <div className="footer-col links-col" data-aos="fade-up" data-aos-delay="200">
            <h4>Services</h4>
            <ul>
              <li><a href="#">Web Application Development</a></li>
              <li><a href="#">MERN Stack Solutions</a></li>
              <li><a href="#">API Integration</a></li>
              <li><a href="#">UI/UX Design</a></li>
            </ul>
          </div>

          <div className="footer-col contact-col" data-aos="fade-left" data-aos-delay="300">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <span className="contact-icon">📧</span>
                <a href="mailto:madhusanka.path@gmail.com">madhusanka.path@gmail.com</a>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <a href="tel:+94779807466">+94 779 807 466</a>
              </li>
              <li>
                <span className="contact-icon">📍</span>
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom container">
          <p>© 2026 Orbit. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>

        {/* Back to Top Button */}
        {showTopBtn && (
            <div className="top-to-btm">
                <FaArrowUp className="icon-position icon-style" onClick={goToTop} />
            </div>
        )}
      </footer>

    </div>
  );
};

export default LandingPage;