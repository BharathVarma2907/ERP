const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiInsightsController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/summary', aiController.getInsightsSummary);
router.get('/project-risk/:id', aiController.calculateProjectRisk);
router.get('/cash-flow-forecast', aiController.forecastCashFlow);
router.get('/project-health/:id', aiController.getProjectHealth);

module.exports = router;
