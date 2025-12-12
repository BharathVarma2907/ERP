const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');

// All admin routes require authentication and Admin role
router.use(authenticate);
router.use(authorize('Admin'));

// User management
router.get('/users', auditLog('VIEW_USERS'), adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', auditLog('UPDATE_USER'), adminController.updateUser);
router.delete('/users/:id', auditLog('DELETE_USER'), adminController.deleteUser);

// Audit logs
router.get('/audit-logs', adminController.getAuditLogs);

// Roles
router.get('/roles', adminController.getRoles);

module.exports = router;
