const pool = require('../config/database');

// Get all accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM accounts ORDER BY account_code`
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching accounts',
      error: error.message 
    });
  }
};

// Create account
exports.createAccount = async (req, res) => {
  const { account_code, account_name, account_type, parent_account_id, currency } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO accounts (account_code, account_name, account_type, parent_account_id, currency) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [account_code, account_name, account_type, parent_account_id, currency || 'USD']
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating account',
      error: error.message 
    });
  }
};

// Update account
exports.updateAccount = async (req, res) => {
  const { account_name, account_type, is_active } = req.body;

  try {
    const result = await pool.query(
      `UPDATE accounts 
       SET account_name = COALESCE($1, account_name),
           account_type = COALESCE($2, account_type),
           is_active = COALESCE($3, is_active)
       WHERE id = $4 
       RETURNING *`,
      [account_name, account_type, is_active, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Account not found' 
      });
    }

    res.json({
      success: true,
      message: 'Account updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating account',
      error: error.message 
    });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM accounts WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Account not found' 
      });
    }

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting account',
      error: error.message 
    });
  }
};

// Get all journal entries
exports.getAllJournalEntries = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT je.*, u.username as created_by_name 
       FROM journal_entries je 
       LEFT JOIN users u ON je.created_by = u.id 
       ORDER BY je.entry_date DESC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching journal entries',
      error: error.message 
    });
  }
};

// Create journal entry
exports.createJournalEntry = async (req, res) => {
  const { entry_date, description, reference, transactions } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert journal entry
    const entryResult = await client.query(
      `INSERT INTO journal_entries (entry_date, description, reference, created_by) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [entry_date, description, reference, req.user.id]
    );

    const journalEntryId = entryResult.rows[0].id;

    // Insert transactions
    let totalDebit = 0;
    let totalCredit = 0;

    for (const txn of transactions) {
      await client.query(
        `INSERT INTO transactions (journal_entry_id, account_id, debit, credit, description) 
         VALUES ($1, $2, $3, $4, $5)`,
        [journalEntryId, txn.account_id, txn.debit || 0, txn.credit || 0, txn.description]
      );

      totalDebit += parseFloat(txn.debit || 0);
      totalCredit += parseFloat(txn.credit || 0);

      // Update account balance
      const balanceChange = (txn.debit || 0) - (txn.credit || 0);
      await client.query(
        `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
        [balanceChange, txn.account_id]
      );
    }

    // Verify debit = credit
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new Error('Debits must equal credits');
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Journal entry created successfully',
      data: entryResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create journal entry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating journal entry',
      error: error.message 
    });
  } finally {
    client.release();
  }
};

// Approve journal entry
exports.approveJournalEntry = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE journal_entries 
       SET status = 'approved', approved_by = $1, approved_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [req.user.id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Journal entry not found' 
      });
    }

    res.json({
      success: true,
      message: 'Journal entry approved successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Approve journal entry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error approving journal entry',
      error: error.message 
    });
  }
};

// Get Balance Sheet
exports.getBalanceSheet = async (req, res) => {
  try {
    const { as_of_date = new Date().toISOString().split('T')[0] } = req.query;

    // Assets
    const assetsResult = await pool.query(
      `SELECT account_name, balance 
       FROM accounts 
       WHERE account_type = 'Asset' AND is_active = true 
       ORDER BY account_code`
    );

    // Liabilities
    const liabilitiesResult = await pool.query(
      `SELECT account_name, balance 
       FROM accounts 
       WHERE account_type = 'Liability' AND is_active = true 
       ORDER BY account_code`
    );

    // Equity
    const equityResult = await pool.query(
      `SELECT account_name, balance 
       FROM accounts 
       WHERE account_type = 'Equity' AND is_active = true 
       ORDER BY account_code`
    );

    const totalAssets = assetsResult.rows.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
    const totalLiabilities = liabilitiesResult.rows.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
    const totalEquity = equityResult.rows.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

    res.json({
      success: true,
      data: {
        as_of_date,
        assets: {
          items: assetsResult.rows,
          total: totalAssets
        },
        liabilities: {
          items: liabilitiesResult.rows,
          total: totalLiabilities
        },
        equity: {
          items: equityResult.rows,
          total: totalEquity
        },
        total_liabilities_and_equity: totalLiabilities + totalEquity
      }
    });
  } catch (error) {
    console.error('Balance sheet error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating balance sheet',
      error: error.message 
    });
  }
};

// Get Profit & Loss Statement
exports.getProfitLoss = async (req, res) => {
  try {
    const { start_date, end_date = new Date().toISOString().split('T')[0] } = req.query;
    const startDate = start_date || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

    // Revenue
    const revenueResult = await pool.query(
      `SELECT a.account_name, 
              COALESCE(SUM(t.credit - t.debit), 0) as amount
       FROM accounts a
       LEFT JOIN transactions t ON a.id = t.account_id
       LEFT JOIN journal_entries je ON t.journal_entry_id = je.id
       WHERE a.account_type = 'Revenue' 
         AND a.is_active = true
         AND (je.entry_date IS NULL OR (je.entry_date >= $1 AND je.entry_date <= $2))
       GROUP BY a.account_name
       ORDER BY a.account_code`,
      [startDate, end_date]
    );

    // Expenses
    const expensesResult = await pool.query(
      `SELECT a.account_name, 
              COALESCE(SUM(t.debit - t.credit), 0) as amount
       FROM accounts a
       LEFT JOIN transactions t ON a.id = t.account_id
       LEFT JOIN journal_entries je ON t.journal_entry_id = je.id
       WHERE a.account_type = 'Expense' 
         AND a.is_active = true
         AND (je.entry_date IS NULL OR (je.entry_date >= $1 AND je.entry_date <= $2))
       GROUP BY a.account_name
       ORDER BY a.account_code`,
      [startDate, end_date]
    );

    const totalRevenue = revenueResult.rows.reduce((sum, acc) => sum + parseFloat(acc.amount), 0);
    const totalExpenses = expensesResult.rows.reduce((sum, acc) => sum + parseFloat(acc.amount), 0);
    const netIncome = totalRevenue - totalExpenses;

    res.json({
      success: true,
      data: {
        period: { start_date: startDate, end_date },
        revenue: {
          items: revenueResult.rows,
          total: totalRevenue
        },
        expenses: {
          items: expensesResult.rows,
          total: totalExpenses
        },
        net_income: netIncome
      }
    });
  } catch (error) {
    console.error('Profit & Loss error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating P&L statement',
      error: error.message 
    });
  }
};

// Get Cash Flow Statement
exports.getCashFlow = async (req, res) => {
  try {
    const { start_date, end_date = new Date().toISOString().split('T')[0] } = req.query;
    const startDate = start_date || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

    const result = await pool.query(
      `SELECT 
        DATE_TRUNC('month', payment_date) as month,
        SUM(CASE WHEN type = 'inflow' THEN amount ELSE 0 END) as inflow,
        SUM(CASE WHEN type = 'outflow' THEN amount ELSE 0 END) as outflow
       FROM payments
       WHERE payment_date >= $1 AND payment_date <= $2
       GROUP BY DATE_TRUNC('month', payment_date)
       ORDER BY month`,
      [startDate, end_date]
    );

    const data = result.rows.map(row => ({
      month: row.month,
      inflow: parseFloat(row.inflow),
      outflow: parseFloat(row.outflow),
      net: parseFloat(row.inflow) - parseFloat(row.outflow)
    }));

    res.json({
      success: true,
      data: {
        period: { start_date: startDate, end_date },
        cash_flow: data
      }
    });
  } catch (error) {
    console.error('Cash flow error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating cash flow statement',
      error: error.message 
    });
  }
};
