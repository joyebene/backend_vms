import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  updateAdminConfig,
  addEmployee,
  getDashboardData,
  checkOutVisitor,
  checkInVisitor,
  exportVisitorsToExcel,
  getAllForms,
  getFormById,
  getAllVisit,
  updateStatus,
  editForm,
  scheduleVisit,
  generateQrCode,
  validateQrCode,
  createTraining,
  getAllTrainings,
  addDocumentToVisitor,
  getUsers, createUser, getUserById, updateUser, deleteUser,
  getSystemSettings, updateSystemSettings,
  getAuditLogs, getLicenses, addLicense,
  getByHost
} from '../controllers/adminController.js';


const router = express.Router();
// router.use(authenticate);


router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

router.get('/audit-logs', getAuditLogs);

router.get('/licenses', getLicenses);
router.post('/licenses', addLicense);


router.get('/visitors', getAllForms);
router.get('/visitor/:id', getFormById);
router.get('/visits', getAllVisit);
router.get('/visitors/host', protect, getByHost)
router.patch('/edit/:type/:id', editForm);
router.patch('/updateStatus/:type/:id', updateStatus);
router.put('/config', protect, updateAdminConfig);
router.post('/employees', protect, addEmployee);
router.get('/dashboard', protect, getDashboardData);
router.post('/visitors/:id/checkout', checkOutVisitor);
router.post('/visitors/:id/check-in', checkInVisitor);
router.get('/visitors/export', exportVisitorsToExcel);
router.post('/schedulevisit', scheduleVisit);
router.get('/qr/:id', generateQrCode);
router.get('/validate-qr', validateQrCode);
router.post('/create-training', createTraining);
router.get('/trainings', getAllTrainings);
router.post('/visitors/:visitorId/documents', addDocumentToVisitor);

// routes/documents.js or similar
// Express backend example
router.delete('/documents', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).send('Name is required');

  try {
    const deleted = await Document.findOneAndDelete({ name });
    if (!deleted) return res.status(404).send('Document not found');
    res.status(200).send('Deleted successfully');
  } catch (err) {
    res.status(500).send('Server error');
  }
});



export default router;