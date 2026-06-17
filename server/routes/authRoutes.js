import express from 'express';
import { registerAdmin, loginAdmin, onboardUser, getBranchUsers } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/onboard', protect, onboardUser); // Protected route

router.get('/branch-users', protect, getBranchUsers);

export default router;