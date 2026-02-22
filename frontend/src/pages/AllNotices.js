import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './LandingPage.css';

const AllNotices = () => {
  const [notices, setNotices] = useState([]);
  const [message, setMessage] = useState(''); 
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const ADMIN_EMAIL = 'pathummadhusanka62@gmail.com';
  // Admin Check
  const isAdmin = userInfo?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line
  }, []);

  const fetchNotices = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/global-notices', config);
      setNotices(data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/global-notices', { message }, config);
      
      setNotices([data, ...notices]); 
      setMessage('');
      toast.success("Announcement Posted! 📢");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post");
    }
  };

  // 🔴 Delete Function
  const deleteHandler = async (id) => {
    if(!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`http://localhost:5000/api/global-notices/${id}`, config);
      

      setNotices(notices.filter(n => n._id !== id));
      toast.error("Notice Deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="landing-container">
       <div className="solar-system">
        <div className="sun"></div>
        <div className="orbit earth-orbit"><div className="planet earth"></div></div>
      </div>

      <div className="content-container" style={{ padding: '50px 20px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <Link to="/dashboard" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', marginBottom: '20px', background: 'rgba(56, 189, 248, 0.1)', padding: '8px 15px', borderRadius: '20px' }}>
             ← Back to Dashboard
          </Link>

          <h2 style={{ color: '#fff', fontSize: '28px', marginBottom: '30px' }}>
            📢 System Announcements
          </h2>

          {/* Admin Form */}
          {isAdmin && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #10b981' }}>
              <h3 style={{ color: '#10b981', margin: '0 0 10px 0' }}>Write an Announcement ✍️</h3>
              <form onSubmit={submitHandler} style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Type your message here..." 
                  className="auth-input" 
                  style={{ marginBottom: 0 }}
                  required
                />
                <button type="submit" className="auth-btn" style={{ width: 'auto', marginTop: 0, background: '#10b981' }}>Post</button>
              </form>
            </div>
          )}

          {notices.length === 0 ? (
            <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '50px', background: 'rgba(0,0,0,0.3)', padding: '30px', borderRadius: '10px' }}>
              No announcements yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {notices.map((notice) => (
                <div key={notice._id} style={{ 
                  background: 'rgba(30, 41, 59, 0.8)', 
                  padding: '20px', 
                  borderRadius: '10px', 
                  borderLeft: '5px solid #f59e0b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  position: 'relative' 
                }}>
                  
                  {/* 🔴 Delete Button (Only for Admin) */}
                  {isAdmin && (
                    <button 
                      onClick={() => deleteHandler(notice._id)}
                      style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        border: 'none',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                      }}
                      title="Delete Notice"
                    >
                      ✕
                    </button>
                  )}

                  <p style={{ color: '#fff', fontSize: '18px', margin: '0 0 10px 0', paddingRight: '30px' }}>{notice.message}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                    <span>By: <span style={{ color: '#38bdf8' }}>{notice.user?.name || 'Admin'}</span></span>
                    <span>{new Date(notice.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllNotices;