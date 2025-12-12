const pool = require('../config/database');

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, c.customer_name, p.project_name 
       FROM invoices i 
       LEFT JOIN customers c ON i.customer_id = c.id 
       LEFT JOIN projects p ON i.project_id = p.id 
       ORDER BY i.invoice_date DESC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching invoices',
      error: error.message 
    });
  }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, c.customer_name, c.email, c.address, p.project_name 
       FROM invoices i 
       LEFT JOIN customers c ON i.customer_id = c.id 
       LEFT JOIN projects p ON i.project_id = p.id 
       WHERE i.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invoice not found' 
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching invoice',
      error: error.message 
    });
  }
};

// Create invoice
exports.createInvoice = async (req, res) => {
  const { 
    invoice_number, 
    customer_id, 
    project_id, 
    invoice_date, 
    due_date, 
    total_amount, 
    tax_amount, 
    currency,
    line_items,
    notes 
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get exchange rate if not USD
    let exchangeRate = 1;
    if (currency && currency !== 'USD') {
      const rateResult = await client.query(
        `SELECT rate FROM exchange_rates 
         WHERE from_currency = $1 AND to_currency = 'USD' 
         ORDER BY effective_date DESC LIMIT 1`,
        [currency]
      );
      if (rateResult.rows.length > 0) {
        exchangeRate = parseFloat(rateResult.rows[0].rate);
      }
    }

    // Insert invoice
    const result = await client.query(
      `INSERT INTO invoices 
       (invoice_number, customer_id, project_id, invoice_date, due_date, 
        total_amount, tax_amount, currency, exchange_rate, line_items, notes, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [invoice_number, customer_id, project_id, invoice_date, due_date, 
       total_amount, tax_amount || 0, currency || 'USD', exchangeRate, 
       JSON.stringify(line_items), notes, req.user.id]
    );

    // Update customer balance
    await client.query(
      `UPDATE customers 
       SET outstanding_balance = outstanding_balance + $1 
       WHERE id = $2`,
      [total_amount, customer_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create invoice error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating invoice',
      error: error.message 
    });
  } finally {
    client.release();
  }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
  const { status, due_date, notes } = req.body;

  try {
    const result = await pool.query(
      `UPDATE invoices 
       SET status = COALESCE($1, status),
           due_date = COALESCE($2, due_date),
           notes = COALESCE($3, notes)
       WHERE id = $4 
       RETURNING *`,
      [status, due_date, notes, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invoice not found' 
      });
    }

    // Check if overdue
    if (result.rows[0].status === 'pending') {
      const dueDate = new Date(result.rows[0].due_date);
      const today = new Date();
      if (dueDate < today) {
        await pool.query(
          `UPDATE invoices SET status = 'overdue' WHERE id = $1`,
          [req.params.id]
        );
      }
    }

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating invoice',
      error: error.message 
    });
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get invoice details
    const invoiceResult = await client.query(
      'SELECT customer_id, total_amount, paid_amount FROM invoices WHERE id = $1',
      [req.params.id]
    );

    if (invoiceResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        success: false, 
        message: 'Invoice not found' 
      });
    }

    const { customer_id, total_amount, paid_amount } = invoiceResult.rows[0];

    // Update customer balance
    const balanceChange = parseFloat(total_amount) - parseFloat(paid_amount);
    await client.query(
      `UPDATE customers 
       SET outstanding_balance = outstanding_balance - $1 
       WHERE id = $2`,
      [balanceChange, customer_id]
    );

    // Delete invoice
    await client.query('DELETE FROM invoices WHERE id = $1', [req.params.id]);

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete invoice error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting invoice',
      error: error.message 
    });
  } finally {
    client.release();
  }
};

// Record payment
exports.recordPayment = async (req, res) => {
  const { invoice_id, amount, payment_date, payment_method, reference, notes } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get invoice details
    const invoiceResult = await client.query(
      'SELECT customer_id, total_amount, paid_amount, currency FROM invoices WHERE id = $1',
      [invoice_id]
    );

    if (invoiceResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        success: false, 
        message: 'Invoice not found' 
      });
    }

    const invoice = invoiceResult.rows[0];
    const newPaidAmount = parseFloat(invoice.paid_amount) + parseFloat(amount);

    // Check if payment exceeds total
    if (newPaidAmount > parseFloat(invoice.total_amount)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        success: false, 
        message: 'Payment amount exceeds invoice total' 
      });
    }

    // Insert payment
    const paymentResult = await client.query(
      `INSERT INTO payments 
       (invoice_id, amount, payment_date, payment_method, reference, notes, type, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, 'inflow', $7) 
       RETURNING *`,
      [invoice_id, amount, payment_date, payment_method, reference, notes, req.user.id]
    );

    // Update invoice
    const newStatus = newPaidAmount >= parseFloat(invoice.total_amount) ? 'paid' : 'partial';
    await client.query(
      `UPDATE invoices 
       SET paid_amount = paid_amount + $1, status = $2 
       WHERE id = $3`,
      [amount, newStatus, invoice_id]
    );

    // Update customer balance
    await client.query(
      `UPDATE customers 
       SET outstanding_balance = outstanding_balance - $1 
       WHERE id = $2`,
      [amount, invoice.customer_id]
    );

    // Create notification
    await client.query(
      `INSERT INTO notifications (user_id, title, message, type) 
       VALUES ($1, 'Payment Received', 'Payment of $${amount} received for invoice #${invoice_id}', 'payment')`,
      [req.user.id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: paymentResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Record payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error recording payment',
      error: error.message 
    });
  } finally {
    client.release();
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, i.invoice_number, c.customer_name 
       FROM payments p 
       LEFT JOIN invoices i ON p.invoice_id = i.id 
       LEFT JOIN customers c ON i.customer_id = c.id 
       ORDER BY p.payment_date DESC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching payments',
      error: error.message 
    });
  }
};
