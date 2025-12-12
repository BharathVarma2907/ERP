const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate, authorize } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');

router.use(authenticate);

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', authorize('Admin', 'Project Manager'), auditLog('CREATE_PROJECT'), projectController.createProject);
router.put('/:id', authorize('Admin', 'Project Manager'), auditLog('UPDATE_PROJECT'), projectController.updateProject);
router.delete('/:id', authorize('Admin', 'Project Manager'), auditLog('DELETE_PROJECT'), projectController.deleteProject);

module.exports = router;
