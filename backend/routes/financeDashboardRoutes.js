const express = require('express');
const router = express.Router();
const fdController = require('../controllers/financeDashboardController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', fdController.getFinanceDashboard);
router.get('/exchange-rates', fdController.getExchangeRates);
router.post('/exchange-rates', fdController.upsertExchangeRate);

module.exports = router;
