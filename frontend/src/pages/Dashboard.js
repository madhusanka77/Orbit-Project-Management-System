import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import './LandingPage.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) { navigate('/'); return; }
    fetchProjects();
    // eslint-disable-next-line
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/projects', config);
      setProjects(data);
    } catch (error) { console.error(error); }
  };

  const createProjectHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('http://localhost:5000/api/projects', { name, description }, config);
      setName(''); 
      setDescription(''); 
      fetchProjects();
      toast.success("Workspace created! 🚀");
    } catch (error) { toast.error("Failed to create workspace."); }
  };

  const deleteProjectHandler = async (e, id) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if(!window.confirm("Delete workspace?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`http://localhost:5000/api/projects/${id}`, config);
      fetchProjects(); 
      toast.error("Workspace deleted."); 
    } catch (error) { 
      toast.error("Only Admin can delete."); 
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
    toast.info("Logged out 👋"); 
  };

  const userPic = userInfo?.pic 
    ? (userInfo.pic.startsWith('http') ? userInfo.pic : `http://localhost:5000${userInfo.pic}`)
    : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

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
    <div className="landing-container">
      
      <Particles id="tsparticles-dashboard" init={particlesInit} options={particlesConfig} />

      <div className="content-container" style={{display: 'block', minHeight: '100vh', position: 'relative', zIndex: 10}}>
        
        <nav className="navbar" style={{borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px 40px', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(15px)'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>🛰️</span>
            <span className="logo-text" style={{ fontSize: '24px', textShadow: '0 0 10px rgba(56, 189, 248, 0.5)' }}>ORBIT</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/notices" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'linear-gradient(135deg, #fdb813 0%, #d97706 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)' }}>
                📢 Notices
              </button>
            </Link>

            <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={userPic} alt="user" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }} />
              <span style={{ color: '#cbd5e1' }}>
                Hello, <b style={{ color: '#38bdf8' }}>{userInfo?.name}</b>
              </span>
            </Link>
            <button onClick={logoutHandler} className="btn-primary" style={{ padding: '8px 20px', width: 'auto', marginTop: 0 }}>Logout</button>
          </div>
        </nav>

        <div style={{ padding: '40px', display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          <div className="auth-box" style={{ 
            maxWidth: '400px', margin: '0', textAlign: 'left', height: 'fit-content',
            background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            padding: '30px', borderRadius: '20px'
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>🚀 New Workspace</h3>
            <form onSubmit={createProjectHandler}>
              <label className="auth-label">Workspace Name</label>
              <input type="text" className="auth-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex: SE Project" />
              
              <label className="auth-label">Description</label>
              <textarea className="auth-input" value={description} onChange={(e) => setDescription(e.target.value)} style={{ minHeight: '100px', resize: 'vertical' }} placeholder="Short description..." />
              
              <button type="submit" className="auth-btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Create Workspace</button>
            </form>
          </div>

          <div style={{ flex: 1, minWidth: '300px', maxWidth: '800px' }}>
            <h3 style={{ fontSize: '22px', color: '#fff', marginBottom: '20px' }}>My Workspaces ({projects.length})</h3>
            
            {projects.length === 0 ? (
               <div style={{ color: '#94a3b8', background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '30px', borderRadius: '20px', textAlign: 'center' }}>
                 No workspaces found. Create one to get started!
               </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px', alignItems: 'stretch' }}>
                {projects.map(project => {
                  
                  const projectTasks = project.tasks || [];
                  const completedCount = projectTasks.filter(t => t.status === 'Done').length;
                  const progressPercentage = projectTasks.length === 0 ? 0 : Math.round((completedCount / projectTasks.length) * 100);

                  return (
                    <Link key={project._id} to={`/project/${project._id}`} style={{ textDecoration: 'none', display: 'flex' }}>
                      
                      <div style={{ 
                        background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', 
                        border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', 
                        borderRadius: '20px', padding: '25px', position: 'relative', transition: 'all 0.3s ease', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', width: '100%'
                      }} className="workspace-card">
                        
                        {project.user._id === userInfo._id && (
                          <button 
                            onClick={(e) => deleteProjectHandler(e, project._id)}
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', zIndex: 10 }}
                            title="Delete Workspace"
                            onMouseOver={(e) => {e.target.style.background = '#ef4444'; e.target.style.color = '#fff';}}
                            onMouseOut={(e) => {e.target.style.background = 'rgba(239, 68, 68, 0.1)'; e.target.style.color = '#ef4444';}}
                          >✕</button>
                        )}

                        <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', margin: '0 0 10px 0', paddingRight: '30px' }}>⚡ {project.name}</h4>
                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: '1.5', flex: 1 }}>{project.description || 'No description provided.'}</p>
                        
                        <div style={{ marginTop: '15px', fontSize: '13px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '5px 10px', borderRadius: '8px', display: 'inline-block', width: 'fit-content' }}>
                          {project.members?.length > 0 ? `👥 ${project.members.length} Members` : '👤 Only You'}
                        </div>

                        <div style={{ marginTop: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>
                            <span>Progress</span><span style={{color: '#38bdf8'}}>{progressPercentage}%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #c084fc)', boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)', transition: 'width 0.8s ease-in-out' }}></div>
                          </div>
                        </div>

                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;