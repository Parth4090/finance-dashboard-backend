const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Please add a type']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    date: {
        type: Date,
        default: Date.now,
        required: [true, 'Please add a date']
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Optimize Database searches natively based on dashboard analytics needs
recordSchema.index({ type: 1, category: 1, date: -1 });
recordSchema.index({ createdBy: 1, type: 1, date: -1 });

module.exports = mongoose.model('Record', recordSchema);
