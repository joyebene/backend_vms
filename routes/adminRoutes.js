import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
    updateAdminConfig,
    addEmployee,
    getDashboardData,
    checkOutVisitor,
    exportVisitorsToExcel,
    getAllForms,
    getFormById,
    getAllVisit,
    updateStatus,
    editForm,
    scheduleVisit,
    generateQrCode,
    validateQrCode
} from '../controllers/adminController.js';

const router = express.Router();


router.get('/visitors', getAllForms);
router.get('/visitor/:id', getFormById);
router.get('/visits', getAllVisit);
router.patch('/edit/:type/:id', editForm);
router.patch('/updateStatus/:type/:id', updateStatus);
router.put('/config', protect, updateAdminConfig);
router.post('/employees', protect, addEmployee);
router.get('/dashboard', protect, getDashboardData);
router.post('/visitors/:id/checkout',  checkOutVisitor);
router.get('/visitors/export', exportVisitorsToExcel);
router.post('/schedulevisit', scheduleVisit);
router.get('/qr/:id', generateVisitorQr);
router.get('/validate-qr', validateQrCode);

export default router;