const Record = require('../models/Record');

class RecordRepository {
    async create(data) {
        return await Record.create(data);
    }

    async findById(id) {
        return await Record.findById(id);
    }

    async update(id, data) {
        return await Record.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async delete(id) {
        return await Record.findByIdAndDelete(id);
    }

    async findCountAndPaginate(queryStr, skip, limit, select, sort) {
        let query = Record.find(JSON.parse(queryStr));
        
        if (select) {
            query = query.select(select.split(',').join(' '));
        }
        
        if (sort) {
            query = query.sort(sort.split(',').join(' '));
        } else {
            query = query.sort('-createdAt');
        }

        const total = await Record.countDocuments(JSON.parse(queryStr));
        const data = await query.skip(skip).limit(limit);

        return { data, total };
    }

    async aggregate(pipeline) {
        return await Record.aggregate(pipeline);
    }

    async find(query, sort = '-createdAt') {
        return await Record.find(query).sort(sort);
    }
}

module.exports = new RecordRepository();
