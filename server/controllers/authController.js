// src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, getAllBranchUsers } from '../models/userModel.js';
import { sendOnboardingEmail } from '../utils/emailService.js'; // Import your utility helper here

// Register Admin (Via Postman)
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    
    const userExists = await findUserByEmail(email);
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await createUser(name, email, hashedPassword, 'Headquarters', 'admin');

    res.status(201).json({ message: 'Admin registered successfully', user: newAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Onboard User (Created by Admin & Dispatches Credential Mail)
export const onboardUser = async (req, res) => {
  const { name, email, password, branch } = req.body;
  try {
    if (!name || !email || !password || !branch) {
      return res.status(400).json({ message: 'All fields are required including branch' });
    }

    const userExists = await findUserByEmail(email);
    if (userExists) return res.status(400).json({ message: 'This email is already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. Write the new user details to the PostgreSQL database
    const newUser = await createUser(name, email, hashedPassword, branch, 'user');

    // 2. Transmit the credential profile via Nodemailer service
    // Pass the raw clean 'password' here so the user receives the readable password string
    try {
      await sendOnboardingEmail(email, name, password, branch);
    } catch (emailError) {
      console.error("Critical: User was made, but credential dispatch failed:", emailError);
      // We return 211 status or a special notice so frontend knows email failed but user exists
      return res.status(201).json({ 
        message: 'User created successfully, but system failed to distribute credential mail.', 
        user: newUser,
        emailSent: false 
      });
    }

    res.status(201).json({ message: 'User onboarded and identity mail transmitted successfully!', user: newUser, emailSent: true });
  } catch (error) {
    res.status(500).json({ message: 'Server Error during activation sequence', error: error.message });
  }
};

// Unified Login Logic
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: 'Provide email and password' });

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, 
        branch: user.branch
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Fetch all onboarded branch users
export const getBranchUsers = async (req, res) => {
  try {
    const users = await getAllBranchUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching directory', error: error.message });
  }
};