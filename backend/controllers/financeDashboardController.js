const pool = require('../config/database');

// Finance Dashboard
exports.getFinanceDashboard = async (req, res) => {
  try {
    // Cash flow trend (last 6 months)
    const cashFlowResult = await pool.query(
      `SELECT 
        DATE_TRUNC('month', payment_date) as month,
        SUM(CASE WHEN type = 'inflow' THEN amount ELSE 0 END) as inflow,
        SUM(CASE WHEN type = 'outflow' THEN amount ELSE 0 END) as outflow
       FROM payments
       WHERE payment_date >= NOW() - INTERVAL '6 months'
       GROUP BY DATE_TRUNC('month', payment_date)
       ORDER BY month ASC`
    );

    // Total AR (Accounts Receivable)
    const arResult = await pool.query(
      `SELECT COALESCE(SUM(total_amount - paid_amount), 0) as total 
       FROM invoices 
       WHERE status IN ('pending', 'partial', 'overdue')`
    );

    // Total AP (Accounts Payable) - simplified
    const apResult = await pool.query(
      `SELECT COALESCE(SUM(outstanding_balance), 0) as total FROM vendors`
    );

    // Budget vs Actual (current year)
    const budgetResult = await pool.query(
      `SELECT 
        p.project_name,
        p.budget,
        p.actual_cost,
        CASE 
          WHEN p.budget > 0 THEN ((p.actual_cost / p.budget) * 100)
          ELSE 0 
        END as usage_percent
       FROM projects p
       WHERE EXTRACT(YEAR FROM p.start_date) = EXTRACT(YEAR FROM CURRENT_DATE)
       ORDER BY usage_percent DESC
       LIMIT 10`
    );

    // Top customers by revenue
    const topCustomersResult = await pool.query(
      `SELECT c.customer_name, COALESCE(SUM(i.paid_amount), 0) as total_revenue
       FROM customers c
       LEFT JOIN invoices i ON c.id = i.customer_id
       GROUP BY c.customer_name
       ORDER BY total_revenue DESC
       LIMIT 5`
    );

    // Overdue invoices
    const overdueResult = await pool.query(
      `SELECT COUNT(*) as count, COALESCE(SUM(total_amount - paid_amount), 0) as amount
       FROM invoices
       WHERE status = 'overdue'`
    );

    res.json({
      success: true,
      data: {
        cashFlowTrend: cashFlowResult.rows,
        accountsReceivable: parseFloat(arResult.rows[0].total),
        accountsPayable: parseFloat(apResult.rows[0].total),
        budgetVsActual: budgetResult.rows,
        topCustomers: topCustomersResult.rows,
        overdueInvoices: {
          count: parseInt(overdueResult.rows[0].count),
          amount: parseFloat(overdueResult.rows[0].amount)
        }
      }
    });
  } catch (error) {
    console.error('Finance dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching finance dashboard data',
      error: error.message 
    });
  }
};

// Get exchange rates
exports.getExchangeRates = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM exchange_rates ORDER BY effective_date DESC, from_currency`
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get exchange rates error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching exchange rates',
      error: error.message 
    });
  }
};

// Add/Update exchange rate
exports.upsertExchangeRate = async (req, res) => {
  const { from_currency, to_currency, rate, effective_date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO exchange_rates (from_currency, to_currency, rate, effective_date) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (from_currency, to_currency, effective_date) 
       DO UPDATE SET rate = $3 
       RETURNING *`,
      [from_currency, to_currency, rate, effective_date || new Date().toISOString().split('T')[0]]
    );

    res.json({
      success: true,
      message: 'Exchange rate updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Upsert exchange rate error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating exchange rate',
      error: error.message 
    });
  }
};
