const express = require('express');
const { 
    getRecords, 
    getRecord, 
    createRecord, 
    updateRecord, 
    deleteRecord 
} = require('../controllers/recordController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Step 1 & 2: Explicit EXACT Middleware Chaining Order (protect -> authorize -> controller)
router.get('/', protect, authorize('read'), getRecords);
router.post('/', protect, authorize('create'), createRecord);

router.get('/:id', protect, authorize('read'), getRecord);
router.put('/:id', protect, authorize('update'), updateRecord);
router.delete('/:id', protect, authorize('delete'), deleteRecord);

module.exports = router;
