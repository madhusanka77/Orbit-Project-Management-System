const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔴 REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const verificationToken = crypto.randomBytes(20).toString('hex');
    
    const user = await User.create({ 
      name, 
      email: email.toLowerCase(), 
      password, 
      verificationToken 
    });

    if (user) {
      const url = `http://localhost:5000/api/users/verify/${verificationToken}`;
      
      
      const emailHtml = `
      <div style="background-color: #f1f5f9; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
          
          <div style="text-align: center; padding: 25px 20px; border-bottom: 1px solid #f8fafc;">
            <span style="font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: 2px;">🛰️ ORBIT</span>
          </div>

          <div style="text-align: center; padding: 40px 20px 20px;">
            <div style="background: #e0f2fe; width: 100px; height: 100px; border-radius: 50%; margin: 0 auto; line-height: 100px; font-size: 50px;">
              ✉️
            </div>
          </div>

          <div style="padding: 10px 30px 40px; text-align: center;">
            <h2 style="color: #0f172a; font-size: 22px; margin-bottom: 15px; font-weight: 700;">Verify your email to finish signing up</h2>
            
            <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
              Thank you for choosing <strong>Orbit</strong>, ${name}!
            </p>
            
            <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
              Please confirm that this is your email address by clicking the button below.
            </p>
            
            <a href="${url}" style="display: inline-block; background-color: #38bdf8; color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Verify my email
            </a>
            
            <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; word-break: break-all;">
              Or copy and paste this link into your browser:<br>
              <a href="${url}" style="color: #38bdf8;">${url}</a>
            </p>
          </div>

          <div style="background-color: #0f172a; color: #94a3b8; padding: 30px 20px; text-align: center; font-size: 13px; line-height: 1.6;">
            <p style="margin: 0 0 10px 0; color: #cbd5e1;">Manage projects at light speed with Orbit. Reach your goals faster and collaborate seamlessly.</p>
            <p style="margin: 0;">Need help? <a href="mailto:madhusanka.path@gmail.com" style="color: #38bdf8; text-decoration: none;">Contact Support</a></p>
          </div>

        </div>
      </div>
      `;

      await transporter.sendMail({
        from: `"Orbit System 🛰️" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Welcome to Orbit! Verify your email 🚀',
        html: emailHtml
      });
      
      res.status(201).json({ message: 'Registration success! Please check your email to verify.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 VERIFY EMAIL (Updated with beautiful UI)
const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    
    
    if (!user) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Failed - Orbit</title>
          <style>
            body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            .card { background-color: #ffffff; padding: 50px 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; max-width: 450px; width: 90%; }
            .brand { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: 2px; margin-bottom: 30px; display: flex; align-items: center; justify-content: center; gap: 10px; }
            .title { font-size: 28px; color: #334155; margin-bottom: 30px; font-weight: 600; }
            .icon-container { width: 120px; height: 120px; background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 30px; box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3); }
            .icon-container svg { width: 60px; height: 60px; color: white; }
            .message { color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
            .btn { display: inline-block; background: #38bdf8; color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4); }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand"><span>🛰️</span> ORBIT</div>
            <div class="title">Verification Failed</div>
            <div class="icon-container">
              <svg fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </div>
            <div class="message">Invalid or expired verification link. Please try registering again or request a new link.</div>
            <a href="http://localhost:3000/register" class="btn">Back to Register</a>
          </div>
        </body>
        </html>
      `);
    }

    user.isVerified = true;
    user.verificationToken = undefined; 
    await user.save();

    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verified - Orbit</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          .card { background-color: #ffffff; padding: 50px 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; max-width: 450px; width: 90%; }
          .brand { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: 2px; margin-bottom: 30px; display: flex; align-items: center; justify-content: center; gap: 10px; }
          .title { font-size: 26px; color: #334155; margin-bottom: 30px; font-weight: 600; }
          .icon-container { width: 120px; height: 120px; background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 30px; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3); }
          .icon-container svg { width: 60px; height: 60px; color: white; }
          .message { color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
          .btn { display: inline-block; background: #38bdf8; color: #fff; text-decoration: none; padding: 12px 35px; border-radius: 30px; font-weight: bold; font-size: 16px; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4); }
          .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(56, 189, 248, 0.6); }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand"><span>🛰️</span> ORBIT</div>
          <div class="title">Verifying Your Account</div>
          <div class="icon-container">
            <svg fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div class="message">Congratulations! You have successfully verified your email address. Please close this tab or proceed to login.</div>
          <a href="http://localhost:3000/login" class="btn">Go to Login</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Verification failed.');
  }
};

// 🔴 LOGIN USER
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email first' });
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 GET USER PROFILE
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email, pic: user.pic });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// 🔴 UPDATE USER PROFILE (WITH IMAGE SUPPORT)
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.file) {
      user.pic = `/uploads/${req.file.filename}`;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser.pic,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = { registerUser, authUser, verifyEmail, getUserProfile, updateUserProfile };