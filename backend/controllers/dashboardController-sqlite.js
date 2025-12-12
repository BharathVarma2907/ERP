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

    // Total revenue
    const revenueResult = await pool.query('SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE status = ?', ['Paid']);
    const totalRevenue = parseFloat(revenueResult.rows[0]?.total || 0);

    // Pending invoices amount
    const pendingResult = await pool.query(
      'SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as amount FROM invoices WHERE status IN (?, ?)',
      ['Sent', 'Draft']
    );
    
    res.json({
      success: true,
      data: {
        totalProjects,
        totalInvoices,
        totalRevenue,
        pendingInvoices: {
          count: pendingResult.rows[0]?.count || 0,
          amount: parseFloat(pendingResult.rows[0]?.amount || 0)
        }
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

// Get dashboard overview
exports.getDashboardOverview = async (req, res) => {
  try {
    // Recent invoices
    const recentInvoices = await pool.query(
      'SELECT * FROM invoices ORDER BY created_at DESC LIMIT 5'
    );

    // Recent projects
    const recentProjects = await pool.query(
      'SELECT p.*, pp.completion_percentage FROM projects p LEFT JOIN project_progress pp ON p.id = pp.project_id ORDER BY p.created_at DESC LIMIT 5'
    );

    res.json({
      success: true,
      data: {
        recentInvoices: recentInvoices.rows,
        recentProjects: recentProjects.rows
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard overview',
      error: error.message
    });
  }
};
