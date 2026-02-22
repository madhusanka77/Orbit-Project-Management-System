import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './LandingPage.css';

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState(null); 
  const [preview, setPreview] = useState(null); 

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    } else {
      setName(userInfo.name || ""); 
      setEmail(userInfo.email || "");
      const currentPic = userInfo.pic && userInfo.pic.startsWith('http') 
        ? userInfo.pic 
        : `http://localhost:5000${userInfo.pic}`;
      setPreview(currentPic);
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (password) formData.append('password', password);
      if (pic) formData.append('pic', pic);

      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data', 
          Authorization: `Bearer ${userInfo.token}` 
        }
      };

      const { data } = await axios.put('http://localhost:5000/api/users/profile', formData, config);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setName(data.name);
      setPreview(`http://localhost:5000${data.pic}`);
      setPassword('');
      setConfirmPassword('');
      toast.success("Profile Updated Successfully! 🌟");
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Update Failed");
    }
  };

  return (
    <div className="landing-container">
      <div className="solar-system">
        <div className="sun"></div>
        <div className="orbit mercury-orbit"><div className="planet mercury"></div></div>
        <div className="orbit venus-orbit"><div className="planet venus"></div></div>
        <div className="orbit earth-orbit"><div className="planet earth"></div></div>
      </div>

      <div className="auth-overlay">
        <div className="auth-box" style={{ maxWidth: '500px', marginTop: '50px' }}>
          <Link to="/dashboard" style={{ color: '#38bdf8', textDecoration: 'none', float: 'left', fontWeight: 'bold' }}>← Back</Link>
          <div style={{ clear: 'both' }}></div>

          <div style={{ margin: '20px auto', width: '120px', height: '120px', position: 'relative' }}>
            <img 
              src={preview || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid #38bdf8' }} 
            />
            <label htmlFor="pic-upload" style={{ position: 'absolute', bottom: '0', right: '0', background: '#fdb813', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>📷</label>
            <input type="file" id="pic-upload" style={{ display: 'none' }} onChange={handleImageChange} accept="image/*" />
          </div>

          <h2 className="auth-title">My Profile</h2>

          <form onSubmit={updateHandler}>
            <div style={{ textAlign: 'left' }}>
              <label className="auth-label">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="auth-input" required />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label className="auth-label">Email Address</label>
              <input type="email" value={email} readOnly className="auth-input" style={{ opacity: 0.7 }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label className="auth-label">New Password (Optional)</label>
              <input type="password" placeholder="Leave blank to keep current" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label className="auth-label">Confirm Password</label>
              <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="auth-input" />
            </div>
            <button type="submit" className="auth-btn">Update Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;