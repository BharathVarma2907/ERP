const express = require('express');
const router = express.Router();
const vcController = require('../controllers/vendorCustomerController');
const { authenticate, authorize } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');

router.use(authenticate);

// Vendors
router.get('/vendors', vcController.getAllVendors);
router.post('/vendors', authorize('Admin', 'Finance Manager'), auditLog('CREATE_VENDOR'), vcController.createVendor);
router.put('/vendors/:id', authorize('Admin', 'Finance Manager'), auditLog('UPDATE_VENDOR'), vcController.updateVendor);
router.delete('/vendors/:id', authorize('Admin', 'Finance Manager'), auditLog('DELETE_VENDOR'), vcController.deleteVendor);

// Customers
router.get('/customers', vcController.getAllCustomers);
router.post('/customers', authorize('Admin', 'Finance Manager'), auditLog('CREATE_CUSTOMER'), vcController.createCustomer);
router.put('/customers/:id', authorize('Admin', 'Finance Manager'), auditLog('UPDATE_CUSTOMER'), vcController.updateCustomer);
router.delete('/customers/:id', authorize('Admin', 'Finance Manager'), auditLog('DELETE_CUSTOMER'), vcController.deleteCustomer);

module.exports = router;
