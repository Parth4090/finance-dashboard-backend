const recordRepository = require('../repositories/recordRepository');

class DashboardService {
    async getSummary() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const last7Days = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

        // 1. Totals & Ratio
        const totals = await recordRepository.aggregate([
            { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } }
        ]);

        let totalIncome = 0;
        let totalExpenses = 0;
        totals.forEach(t => {
            if (t._id === 'income') totalIncome = t.totalAmount;
            if (t._id === 'expense') totalExpenses = t.totalAmount;
        });
        const netBalance = totalIncome - totalExpenses;
        const incomeVsExpenseRatio = totalExpenses === 0 ? totalIncome : parseFloat((totalIncome / totalExpenses).toFixed(2));

        // 2. This Month Top spending categories
        const topCategories = await recordRepository.aggregate([
            { $match: { type: 'expense', date: { $gte: startOfMonth } } },
            { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
            { $sort: { totalAmount: -1 } },
            { $limit: 3 },
            { $project: { _id: 0, category: "$_id", totalAmount: 1 } }
        ]);

        // 3. Last 7 days activity
        const last7DaysActivity = await recordRepository.aggregate([
            { $match: { date: { $gte: last7Days } } },
            { 
               $group: { 
                   _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                   income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                   expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
               }
            },
            { $sort: { "_id": 1 } },
            { $project: { _id: 0, date: "$_id", income: 1, expense: 1 } }
        ]);

        // 4. Monthly trends (current year)
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const monthlyTrends = await recordRepository.aggregate([
            { $match: { date: { $gte: startOfYear } } },
            {
                $group: {
                    _id: { month: { $month: "$date" }, type: "$type" },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.month": 1 } }
        ]);

        return {
            summary: { totalIncome, totalExpenses, netBalance, incomeVsExpenseRatio },
            topCategories,
            last7DaysActivity,
            monthlyTrends
        };
    }
}
module.exports = new DashboardService();
