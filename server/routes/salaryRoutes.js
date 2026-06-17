import express from 'express';
import { submitSalary, getMySubmissions, getAdminMasterLedger } from '../controllers/salaryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/submit', protect, submitSalary);
router.get('/my-submissions', protect, getMySubmissions);
router.get('/admin-all-submissions', protect, getAdminMasterLedger);

export default router;