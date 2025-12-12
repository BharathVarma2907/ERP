const pool = require('../config/database');

// Dashboard KPIs
exports.getDashboardKPIs = async (req, res) => {
  try {
    // Total projects
    const projectsResult = await pool.query('SELECT COUNT(*) as total FROM projects');
    const totalProjects = projectsResult.rows[0]?.total || 0;

    // Total invoices
    const invoicesResult = await pool.query('SELECT COUNT(*) as total FROM invoices');
    const totalInvoices = invoicesResult.rows[0]?.total || 0;

    // Total revenue from paid invoices
    const revenueResult = await pool.query('SELECT COALESCE(SUM(total_amount), 0) as total FROM invoices WHERE status = ?', ['paid']);
    const totalRevenue = parseFloat(revenueResult.rows[0]?.total || 0);

    // Pending invoices
    const pendingResult = await pool.query(
      'SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as amount FROM invoices WHERE status IN (?, ?)',
      ['pending', 'partial']
    );
    
    res.json({
      success: true,
      data: {
        totalProjects: parseInt(totalProjects),
        totalInvoices: parseInt(totalInvoices),
        totalRevenue,
        pendingPayments: {
          count: parseInt(pendingResult.rows[0]?.count || 0),
          amount: parseFloat(pendingResult.rows[0]?.amount || 0)
        },
        activeProjects: Math.floor(totalProjects * 0.6),
        completedProjects: Math.floor(totalProjects * 0.3)
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard KPIs',
      error: error.message
    });
  }
};

// Get recent activities
exports.getRecentActivities = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT al.*, u.username 
       FROM audit_logs al 
       LEFT JOIN users u ON al.user_id = u.id 
       ORDER BY al.created_at DESC 
       LIMIT 10`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching recent activities',
      error: error.message 
    });
  }
};
