import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

import AllNotices from './pages/AllNotices';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register'; 
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import Profile from './pages/Profile'; 


import LoadingScreen from './pages/LoadingScreen'; 

function App() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notices" element={<AllNotices />} />
        
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Routes>
      
      <ToastContainer position="top-right" autoClose={3000} theme="colored" /> 
    </Router>
  );
}

export default App;