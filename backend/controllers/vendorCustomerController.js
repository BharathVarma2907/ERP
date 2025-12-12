const pool = require('../config/database');

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM vendors ORDER BY vendor_name`
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching vendors',
      error: error.message 
    });
  }
};

// Create vendor
exports.createVendor = async (req, res) => {
  const { vendor_name, contact_person, email, phone, address, payment_terms } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO vendors (vendor_name, contact_person, email, phone, address, payment_terms) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [vendor_name, contact_person, email, phone, address, payment_terms]
    );

    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating vendor',
      error: error.message 
    });
  }
};

// Update vendor
exports.updateVendor = async (req, res) => {
  const { vendor_name, contact_person, email, phone, address, payment_terms, is_active } = req.body;

  try {
    const result = await pool.query(
      `UPDATE vendors 
       SET vendor_name = COALESCE($1, vendor_name),
           contact_person = COALESCE($2, contact_person),
           email = COALESCE($3, email),
           phone = COALESCE($4, phone),
           address = COALESCE($5, address),
           payment_terms = COALESCE($6, payment_terms),
           is_active = COALESCE($7, is_active)
       WHERE id = $8 
       RETURNING *`,
      [vendor_name, contact_person, email, phone, address, payment_terms, is_active, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vendor not found' 
      });
    }

    res.json({
      success: true,
      message: 'Vendor updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating vendor',
      error: error.message 
    });
  }
};

// Delete vendor
exports.deleteVendor = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM vendors WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vendor not found' 
      });
    }

    res.json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    console.error('Delete vendor error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting vendor',
      error: error.message 
    });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM customers ORDER BY customer_name`
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching customers',
      error: error.message 
    });
  }
};

// Create customer
exports.createCustomer = async (req, res) => {
  const { customer_name, contact_person, email, phone, address, credit_limit } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO customers (customer_name, contact_person, email, phone, address, credit_limit) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [customer_name, contact_person, email, phone, address, credit_limit || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating customer',
      error: error.message 
    });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  const { customer_name, contact_person, email, phone, address, credit_limit, is_active } = req.body;

  try {
    const result = await pool.query(
      `UPDATE customers 
       SET customer_name = COALESCE($1, customer_name),
           contact_person = COALESCE($2, contact_person),
           email = COALESCE($3, email),
           phone = COALESCE($4, phone),
           address = COALESCE($5, address),
           credit_limit = COALESCE($6, credit_limit),
           is_active = COALESCE($7, is_active)
       WHERE id = $8 
       RETURNING *`,
      [customer_name, contact_person, email, phone, address, credit_limit, is_active, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Customer not found' 
      });
    }

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating customer',
      error: error.message 
    });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM customers WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Customer not found' 
      });
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting customer',
      error: error.message 
    });
  }
};
