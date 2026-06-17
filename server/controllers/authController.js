import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, getAllBranchUsers } from '../models/userModel.js';

// Register Admin (Via Postman)
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    
    const userExists = await findUserByEmail(email);
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Forces role to be 'admin'
    const newAdmin = await createUser(name, email, hashedPassword, 'Headquarters', 'admin');

    res.status(201).json({ message: 'Admin registered successfully', user: newAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Onboard User (Created by Admin)
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

    // Default role parameters fallback to 'user' inside model
    const newUser = await createUser(name, email, hashedPassword, branch, 'user');

    res.status(201).json({ message: 'User onboarded successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
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
        role: user.role, // Frontend reads this to know where to navigate
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
    // Calls the model query to grab from the PostgreSQL users table
    const users = await getAllBranchUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching directory', error: error.message });
  }
};