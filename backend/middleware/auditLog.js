const pool = require('../config/database');

// Audit log middleware
exports.auditLog = (action) => {
  return async (req, res, next) => {
    const userId = req.user?.id || null;
    const userRole = req.user?.role || 'guest';
    const ipAddress = req.ip || req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    
    try {
      await pool.query(
        `INSERT INTO audit_logs (user_id, action, endpoint, ip_address, user_role, details) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, action, endpoint, ipAddress, userRole, JSON.stringify(req.body)]
      );
    } catch (error) {
      console.error('Audit log error:', error);
    }
    
    next();
  };
};
