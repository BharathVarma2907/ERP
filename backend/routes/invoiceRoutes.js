const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticate, authorize } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');

router.use(authenticate);

// Invoices
router.get('/invoices', invoiceController.getAllInvoices);
router.get('/invoices/:id', invoiceController.getInvoiceById);
router.post('/invoices', authorize('Admin', 'Finance Manager', 'Project Manager'), auditLog('CREATE_INVOICE'), invoiceController.createInvoice);
router.put('/invoices/:id', authorize('Admin', 'Finance Manager'), auditLog('UPDATE_INVOICE'), invoiceController.updateInvoice);
router.delete('/invoices/:id', authorize('Admin', 'Finance Manager'), auditLog('DELETE_INVOICE'), invoiceController.deleteInvoice);

// Payments
router.get('/payments', invoiceController.getAllPayments);
router.post('/payments', authorize('Admin', 'Finance Manager'), auditLog('RECORD_PAYMENT'), invoiceController.recordPayment);

module.exports = router;
