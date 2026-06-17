const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/login', adminController.adminLogin);
router.get('/dashboard', adminMiddleware, adminController.dashboard);
router.get('/users', adminMiddleware, adminController.listUsers);
router.post('/users', adminMiddleware, adminController.createUser);
router.get('/users/export', adminMiddleware, adminController.exportCsv);
router.patch('/users/:id', adminMiddleware, adminController.updateUser);
router.get('/webhooks', adminMiddleware, adminController.webhookLogs);
router.get('/activity', adminMiddleware, adminController.activityLogs);
router.post('/change-password', adminMiddleware, adminController.changePassword);

module.exports = router;
