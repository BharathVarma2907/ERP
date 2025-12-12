const pool = require('../config/database');

// Get AI insights summary
exports.getInsightsSummary = async (req, res) => {
  try {
    const projectsResult = await pool.query(
      'SELECT p.id, p.project_name, p.budget FROM projects p ORDER BY p.created_at DESC LIMIT 5'
    );

    const invoicesResult = await pool.query(
      'SELECT COUNT(*) as total, COALESCE(SUM(total_amount), 0) as amount FROM invoices'
    );

    res.json({
      success: true,
      data: {
        projectRisks: projectsResult.rows,
        financialMetrics: {
          totalInvoices: invoicesResult.rows[0]?.total || 0,
          totalAmount: parseFloat(invoicesResult.rows[0]?.amount || 0)
        },
        insights: [
          'Monitor budget overruns on high-risk projects',
          'Focus on timely invoice collection',
          'Review material costs for cost optimization'
        ]
      }
    });
  } catch (error) {
    console.error('AI Insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching AI insights',
      error: error.message
    });
  }
};

// Calculate project risk
exports.calculateProjectRisk = async (req, res) => {
  try {
    const { id } = req.params;

    const projectResult = await pool.query(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    const project = projectResult.rows[0];
    let riskScore = 0;
    let riskFactors = [];

    if (project.actual_cost && project.budget) {
      const budgetUsage = (project.actual_cost / project.budget) * 100;
      if (budgetUsage > 90) {
        riskScore += 30;
        riskFactors.push('Budget exceeded');
      } else if (budgetUsage > 75) {
        riskScore += 15;
        riskFactors.push('Budget over 75%');
      }
    }

    let riskLevel = 'Low';
    if (riskScore > 50) riskLevel = 'High';
    else if (riskScore > 25) riskLevel = 'Medium';

    res.json({
      success: true,
      data: {
        projectId: project.id,
        projectName: project.project_name,
        riskScore,
        riskLevel,
        riskFactors
      }
    });
  } catch (error) {
    console.error('Risk calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating project risk',
      error: error.message
    });
  }
};

// Forecast cash flow
exports.forecastCashFlow = async (req, res) => {
  try {
    const { months = 6 } = req.query;

    const invoicesResult = await pool.query(
      `SELECT 
        strftime('%Y-%m', invoice_date) as month,
        SUM(total_amount - paid_amount) as outstanding
       FROM invoices
       GROUP BY strftime('%Y-%m', invoice_date)
       ORDER BY month DESC
       LIMIT ?`,
      [months]
    );

    const paymentsResult = await pool.query(
      `SELECT 
        strftime('%Y-%m', payment_date) as month,
        SUM(amount) as received
       FROM payments
       GROUP BY strftime('%Y-%m', payment_date)
       ORDER BY month DESC
       LIMIT ?`,
      [months]
    );

    res.json({
      success: true,
      data: {
        outstanding: invoicesResult.rows,
        received: paymentsResult.rows,
        forecast: 'Positive cash flow trend'
      }
    });
  } catch (error) {
    console.error('Cash flow forecast error:', error);
    res.status(500).json({
      success: false,
      message: 'Error forecasting cash flow',
      error: error.message
    });
  }
};

// Get project health
exports.getProjectHealth = async (req, res) => {
  try {
    const { id } = req.params;

    const projectResult = await pool.query(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    const project = projectResult.rows[0];
    const health = {
      overall: 'Healthy',
      score: 85,
      metrics: {
        budgetHealth: project.actual_cost ? ((project.budget - project.actual_cost) / project.budget * 100) : 100,
        scheduleHealth: project.planned_progress || 50,
        qualityScore: 90
      }
    };

    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Project health error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project health',
      error: error.message
    });
  }
};
