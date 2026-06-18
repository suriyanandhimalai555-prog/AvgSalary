// src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, getAllBranchUsers, updateUserPassword } from '../models/userModel.js';
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

// Get Current Logged In User Profile Data
export const getUserProfile = async (req, res) => {
  try {
    // req.user is automatically populated by your 'protect' middleware
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'User profile not found' });

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching user profile', error: error.message });
  }
};

// Change Password Endpoint
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required' });
    }

    // 1. Grab the user's email from the validated token object
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ message: 'Unauthorized session' });
    }

    // 2. Fetch a fresh, complete user record from the DB to ensure 'password' hash is present
    const fullUser = await findUserByEmail(userEmail);
    if (!fullUser) {
      return res.status(404).json({ message: 'User record not found in directory' });
    }

    // 3. Compare submitted current password against the database hash
    const isMatch = await bcrypt.compare(currentPassword, fullUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'The current password you entered is incorrect' });
    }

    // 4. Prevent updating to the exact same password
    const isSamePassword = await bcrypt.compare(newPassword, fullUser.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password cannot be the same as your current password' });
    }

    // 5. Encrypt and save the new password string
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Call your model updater function
    await updateUserPassword(fullUser.id, hashedPassword);

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    // Look at your VS Code / Node terminal when this prints!
    console.error("SYSTEM ERROR DURING PASSWORD MODIFICATION:", error);
    
    res.status(500).json({ 
      message: 'Internal Server Error modifying security profile', 
      error: error.message 
    });
  }
};