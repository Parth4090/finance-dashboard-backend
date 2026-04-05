const express = require('express');
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Explicit Middleware Chaining
router.get('/', protect, authorize('manage_users'), getUsers);

router.get('/:id', protect, authorize('manage_users'), getUser);
router.put('/:id', protect, authorize('manage_users'), updateUser);
router.delete('/:id', protect, authorize('manage_users'), deleteUser);

module.exports = router;
