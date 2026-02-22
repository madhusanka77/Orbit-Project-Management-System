import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import './LandingPage.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  
  // Tasks State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignedTo, setTaskAssignedTo] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [tasks, setTasks] = useState([]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const [memberEmail, setMemberEmail] = useState('');
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line
  }, [id, userInfo.token]);

  const fetchProject = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`http://localhost:5000/api/projects/${id}`, config);
      setProject(data);
      setTasks(data.tasks || []); 
    } catch (error) { 
      console.error("Error fetching workspace", error); 
    }
  };

  const addMemberHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(`http://localhost:5000/api/projects/${id}/members`, { email: memberEmail }, config);
      toast.success("Collaborator added! 🤝");
      setMemberEmail(''); fetchProject(); 
    } catch (error) { toast.error(error.response?.data?.message || "User not found"); }
  };

  const addTaskHandler = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const config = { 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${userInfo.token}` 
        } 
      };

      const { data } = await axios.post(
        `http://localhost:5000/api/projects/${id}/tasks`, 
        { 
          title: taskTitle, 
          assignedTo: taskAssignedTo, 
          dueDate: taskDueDate, 
          priority: taskPriority
        }, 
        config
      );

      setTasks(data.tasks);
      
      // Form Clear
      setTaskTitle(''); 
      setTaskAssignedTo(''); 
      setTaskDueDate(''); 
      setTaskPriority('Medium');
      
      toast.success("Task added! 🚀");
    } catch (error) { 
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add task."); 
    }
  };

  const updateTaskStatusHandler = async (taskId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put(`http://localhost:5000/api/projects/${id}/tasks/${taskId}`, { status: newStatus }, config);
      setTasks(data.tasks);
      if(newStatus === 'Done') toast.success("Task Completed! 🎉");
    } catch (error) { console.error(error); }
  };

  const deleteTaskHandler = async (taskId) => {
    if (!window.confirm("Delete task?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.delete(`http://localhost:5000/api/projects/${id}/tasks/${taskId}`, config);
      setTasks(data.tasks);
      toast.error("Task deleted!");
    } catch (error) { console.error(error); }
  };

  // 🔴 Particles Background Logic
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

  if (!project) return <div style={{textAlign: 'center', marginTop: '50px', color: '#fff'}}>Loading Workspace... 🛰️</div>;

  const completedCount = tasks.filter(t => t.status === 'Done').length;
  const progressPercentage = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const getStatusColor = (status) => {
    if (status === 'Done') return '#10b981';
    if (status === 'In Progress') return '#f59e0b';
    return '#38bdf8';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || (task.priority || 'Medium') === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="landing-container">
      
      {/* 🔴 Particles Background එක */}
      <Particles id="tsparticles-project-details" init={particlesInit} options={particlesConfig} />

      <div className="content-container" style={{ display: 'block', minHeight: '100vh', padding: '40px 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold', marginBottom: '20px', background: 'rgba(56, 189, 248, 0.1)', padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.3)', transition: 'all 0.3s ease' }}
            onMouseOver={(e) => {e.target.style.background = '#38bdf8'; e.target.style.color = '#0f172a';}}
            onMouseOut={(e) => {e.target.style.background = 'rgba(56, 189, 248, 0.1)'; e.target.style.color = '#38bdf8';}}
          >
            ← Back to Dashboard
          </Link>
          
          {/* 🔴 Project Header Box (Glassmorphism Effect) */}
          <div style={{ 
            background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', 
            padding: '40px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)', marginBottom: '30px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', margin: '0 0 10px 0', textShadow: '0 0 10px rgba(56, 189, 248, 0.5)' }}>{project.name}</h2>
                <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6' }}>{project.description}</p>
              </div>
              <div style={{ textAlign: 'right', minWidth: '200px' }}>
                 <div style={{ marginBottom: '10px', color: '#cbd5e1', fontWeight: 'bold' }}>Team Members</div>
                 <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <span style={{ background: '#38bdf8', color: '#0f172a', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(56, 189, 248, 0.3)' }}>👑 Admin</span>
                    {project.members && project.members.map(m => (
                      <span key={m._id} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>👤 {m.name || m.username}</span>
                    ))}
                 </div>
              </div>
            </div>

            {project.user._id === userInfo._id && (
              <form onSubmit={addMemberHandler} style={{ marginTop: '25px', display: 'flex', gap: '10px', maxWidth: '500px' }}>
                <input type="email" placeholder="Invite member by email..." value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} className="auth-input" style={{ marginBottom: 0, padding: '12px', flex: 1 }} required />
                <button type="submit" className="auth-btn btn-primary" style={{ width: 'auto', marginTop: 0, padding: '0 25px' }}>Invite</button>
              </form>
            )}

            <div style={{ marginTop: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#38bdf8', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                <span>Project Progress</span><span>{progressPercentage}%</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #c084fc)', boxShadow: '0 0 15px rgba(56, 189, 248, 0.6)', transition: 'width 0.8s ease-in-out' }}></div>
              </div>
            </div>
          </div>

          {/* 🔴 Tasks Box (Glassmorphism Effect) */}
          <div style={{ 
            background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', 
            padding: '40px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)' 
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <h3 style={{ color: '#fff', fontSize: '22px', margin: 0, fontWeight: 'bold' }}>📋 Work Tasks</h3>
              <span style={{ background: '#38bdf8', color: '#0f172a', padding: '3px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold' }}>{filteredTasks.length}</span>
            </div>

            {/* SEARCH & FILTER BAR */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '20px', borderRadius: '15px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <input type="text" placeholder="🔍 Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="auth-input" style={{ marginBottom: '15px' }} />
              <div style={{ display: 'flex', gap: '15px' }}>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="auth-input" style={{ marginBottom: 0, flex: 1, fontSize: '14px' }}>
                  <option style={{color: '#000'}} value="All">All Statuses</option>
                  <option style={{color: '#000'}} value="To Do">To Do</option>
                  <option style={{color: '#000'}} value="In Progress">In Progress</option>
                  <option style={{color: '#000'}} value="Done">Done</option>
                </select>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="auth-input" style={{ marginBottom: 0, flex: 1, fontSize: '14px' }}>
                  <option style={{color: '#000'}} value="All">All Priorities</option>
                  <option style={{color: '#000'}} value="High">🔴 High</option>
                  <option style={{color: '#000'}} value="Medium">🟡 Medium</option>
                  <option style={{color: '#000'}} value="Low">🟢 Low</option>
                </select>
              </div>
            </div>

            {/* Add Task Form */}
            <form onSubmit={addTaskHandler} style={{ marginBottom: '30px' }}>
              <input type="text" placeholder="Add a new task..." value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="auth-input" style={{ marginBottom: '15px' }} required />
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                <select value={taskAssignedTo} onChange={(e) => setTaskAssignedTo(e.target.value)} className="auth-input" style={{ marginBottom: 0, color: '#fff', flex: 1 }}>
                  <option style={{color: '#000'}} value="">Assign to...</option>
                  <option style={{color: '#000'}} value={typeof project.user === 'object' ? project.user._id : project.user}>
                     {typeof project.user === 'object' ? project.user.name : "Admin"}
                  </option>
                  {project.members && project.members.map(m => (
                    <option style={{color: '#000'}} key={m._id} value={m._id}>{m.name || m.username}</option>
                  ))}
                </select>
                <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} className="auth-input" style={{ marginBottom: 0, width: '130px', color: '#fff' }}>
                  <option style={{color: '#000'}} value="High">🔴 High</option>
                  <option style={{color: '#000'}} value="Medium">🟡 Medium</option>
                  <option style={{color: '#000'}} value="Low">🟢 Low</option>
                </select>
                <input type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} className="auth-input" style={{ marginBottom: 0, width: '160px', color: '#fff' }} />
              </div>
              <button type="submit" className="auth-btn btn-primary" style={{ width: '100%', marginTop: '5px', padding: '12px' }}>+ Add Task</button>
            </form>

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {filteredTasks.map((task) => {
                const isAssignee = task.assignedTo && (task.assignedTo._id === userInfo._id);
                const isAdmin = project.user._id === userInfo._id;
                const canUpdateStatus = isAssignee || isAdmin;

                return (
                  <div key={task._id} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px', borderRadius: '15px',
                    background: 'rgba(15, 23, 42, 0.4)', borderLeft: `5px solid ${getStatusColor(task.status)}`, 
                    borderTop: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'transform 0.2s ease', cursor: 'default'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ display: 'block', fontWeight: 'bold', color: '#fff', fontSize: '16px', textDecoration: task.status === 'Done' ? 'line-through' : 'none' }}>{task.title}</span>
                          <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)' }}>{task.priority || 'Medium'}</span>
                      </div>
                      <div style={{ fontSize: '13px', marginTop: '6px', color: '#94a3b8' }}>👤 Assigned to: <span style={{color: '#38bdf8'}}>{task.assignedTo?.name || task.assignedTo?.username || 'Anyone'}</span></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <select 
                          value={task.status || 'To Do'} 
                          onChange={(e) => updateTaskStatusHandler(task._id, e.target.value)} 
                          disabled={!canUpdateStatus}
                          style={{ 
                            background: getStatusColor(task.status), 
                            color: '#0f172a', 
                            fontWeight: 'bold', 
                            border: 'none', 
                            padding: '6px 12px', 
                            borderRadius: '8px', 
                            fontSize: '13px', 
                            outline: 'none',
                            opacity: canUpdateStatus ? 1 : 0.5,
                            cursor: canUpdateStatus ? 'pointer' : 'not-allowed',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                          }}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>

                        {isAdmin && (
                          <button onClick={() => deleteTaskHandler(task._id)} style={{ border: 'none', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', transition: 'all 0.3s' }}
                          onMouseOver={(e) => {e.target.style.background = '#ef4444'; e.target.style.color = '#fff';}}
                          onMouseOut={(e) => {e.target.style.background = 'rgba(239, 68, 68, 0.15)'; e.target.style.color = '#ef4444';}}
                          >✕</button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;