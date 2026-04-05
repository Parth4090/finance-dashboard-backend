const recordRepository = require('../repositories/recordRepository');
const AppError = require('../utils/AppError');

class RecordService {
    async getRecords(queryObj) {
        const reqQuery = { ...queryObj };
        const removeFields = ['select', 'sort', 'page', 'limit', 'format'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        const page = parseInt(queryObj.page, 10) || 1;
        const limit = parseInt(queryObj.limit, 10) || 20;
        const skip = (page - 1) * limit;

        const { data, total } = await recordRepository.findCountAndPaginate(
            queryStr, skip, limit, queryObj.select, queryObj.sort
        );

        return { data, total, page, limit };
    }

    async getRecordById(id) {
        const record = await recordRepository.findById(id);
        if (!record) throw new AppError('Record not found', 404);
        return record;
    }

    async createRecord(data) {
        const record = await recordRepository.create(data);
        
        let warning = null;
        // BUDGET LIMIT ALERT FEATURE
        // Check expenses for the current month
        if (data.type === 'expense') {
            const expenseLimit = 5000;
            const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            
            const monthExpenses = await recordRepository.aggregate([
                { $match: { createdBy: data.createdBy, type: 'expense', date: { $gte: currentMonthStart } } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            
            const totalThisMonth = monthExpenses.length > 0 ? monthExpenses[0].total : 0;
            
            if (totalThisMonth > expenseLimit) {
                warning = `Budget Alert: Your expenses this month (${totalThisMonth}) have exceeded the limit of ${expenseLimit}.`;
            }
        }
        return { record, warning };
    }

    async updateRecord(id, data) {
        const record = await recordRepository.update(id, data);
        if (!record) throw new AppError('Record not found', 404);
        return record;
    }

    async deleteRecord(id) {
        const record = await recordRepository.delete(id);
        if (!record) throw new AppError('Record not found', 404);
        return record;
    }

    async exportRecords(queryObj) {
        const reqQuery = { ...queryObj };
        delete reqQuery.format;
        
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        const filters = JSON.parse(queryStr);
        
        const records = await recordRepository.find(filters);
        
        // CSV Format Construction
        const csvHeader = 'ID,Amount,Type,Category,Date,Notes,CreatedAt\n';
        const csvRows = records.map(r => {
            return `"${r._id}","${r.amount}","${r.type}","${r.category}","${r.date.toISOString()}","${r.notes || ''}","${r.createdAt.toISOString()}"`;
        }).join('\n');
        
        return csvHeader + csvRows;
    }
}
module.exports = new RecordService();
