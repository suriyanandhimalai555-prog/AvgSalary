import express from 'express';
import { registerAdmin, loginAdmin, onboardUser, getBranchUsers, getUserProfile, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/onboard', protect, onboardUser); // Protected route

router.get('/branch-users', protect, getBranchUsers);

// NEW PROFILE MANAGEMENT ENDPOINTS
router.get('/profile', protect, getUserProfile);
router.put('/change-password', protect, changePassword);

export default router;