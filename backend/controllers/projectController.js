const pool = require('../config/database');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM projects ORDER BY start_date DESC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching projects',
      error: error.message 
    });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM projects WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching project',
      error: error.message 
    });
  }
};

// Create project
exports.createProject = async (req, res) => {
  const { 
    project_name, 
    description, 
    customer_id, 
    start_date, 
    end_date, 
    budget, 
    planned_progress 
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO projects 
       (project_name, description, customer_id, start_date, end_date, budget, planned_progress, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [project_name, description, customer_id, start_date, end_date, budget, planned_progress || 0, req.user.id]
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating project',
      error: error.message 
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  const { 
    project_name, 
    description, 
    status, 
    end_date, 
    budget, 
    actual_cost,
    planned_progress,
    actual_progress
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE projects 
       SET project_name = COALESCE($1, project_name),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           end_date = COALESCE($4, end_date),
           budget = COALESCE($5, budget),
           actual_cost = COALESCE($6, actual_cost),
           planned_progress = COALESCE($7, planned_progress),
           actual_progress = COALESCE($8, actual_progress)
       WHERE id = $9 
       RETURNING *`,
      [project_name, description, status, end_date, budget, actual_cost, planned_progress, actual_progress, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating project',
      error: error.message 
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting project',
      error: error.message 
    });
  }
};
