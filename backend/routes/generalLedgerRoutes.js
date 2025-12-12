const express = require('express');
const router = express.Router();
const glController = require('../controllers/generalLedgerController');
const { authenticate, authorize } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');

router.use(authenticate);

// Accounts
router.get('/accounts', glController.getAllAccounts);
router.post('/accounts', authorize('Admin', 'Finance Manager'), auditLog('CREATE_ACCOUNT'), glController.createAccount);
router.put('/accounts/:id', authorize('Admin', 'Finance Manager'), auditLog('UPDATE_ACCOUNT'), glController.updateAccount);
router.delete('/accounts/:id', authorize('Admin', 'Finance Manager'), auditLog('DELETE_ACCOUNT'), glController.deleteAccount);

// Journal Entries
router.get('/journal-entries', glController.getAllJournalEntries);
router.post('/journal-entries', authorize('Admin', 'Finance Manager'), auditLog('CREATE_JOURNAL_ENTRY'), glController.createJournalEntry);
router.put('/journal-entries/:id/approve', authorize('Admin', 'Finance Manager'), auditLog('APPROVE_JOURNAL_ENTRY'), glController.approveJournalEntry);

// Financial Statements
router.get('/reports/balance-sheet', glController.getBalanceSheet);
router.get('/reports/profit-loss', glController.getProfitLoss);
router.get('/reports/cash-flow', glController.getCashFlow);

module.exports = router;
