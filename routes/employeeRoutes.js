import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getEmployees, getEmployeeById } from '../controllers/employeeController.js';

const router = express.Router();

router.use(authenticate);

// GET /employees
router.get('/', getEmployees);

// GET /employees/:id
router.get('/:id', getEmployeeById);

export default router;
