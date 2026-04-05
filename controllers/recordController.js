const recordService = require('../services/recordService');
const { successResponse } = require('../utils/response');
const logger = require('../utils/logger');

exports.getRecords = async (req, res, next) => {
    try {
        if (req.query.format === 'csv') {
            const csv = await recordService.exportRecords(req.query);
            res.header('Content-Type', 'text/csv');
            res.attachment('records_export.csv');
            logger.info({ action: "EXPORT_CSV", user: req.user.id, timestamp: new Date() });
            return res.send(csv);
        }

        const { data, total, page, limit } = await recordService.getRecords(req.query);
        successResponse(res, 'Records fetched successfully', data, { 
            total,
            page, 
            limit,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        next(err);
    }
};

exports.getRecord = async (req, res, next) => {
    try {
        const record = await recordService.getRecordById(req.params.id);
        successResponse(res, 'Record fetched successfully', record);
    } catch (err) {
        next(err);
    }
};

exports.createRecord = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;
        const { record, warning } = await recordService.createRecord(req.body);
        
        let meta = null;
        if (warning) meta = { warning };
        
        // Structured Logging implementation
        logger.info({
            action: "CREATE_RECORD",
            user: req.user.id,
            type: req.body.type,
            amount: req.body.amount,
            timestamp: new Date()
        });

        successResponse(res, 'Record created successfully', record, meta, 201);
    } catch (err) {
        next(err);
    }
};

exports.updateRecord = async (req, res, next) => {
    try {
        const record = await recordService.updateRecord(req.params.id, req.body);
        
        logger.info({
            action: "UPDATE_RECORD",
            user: req.user.id,
            recordId: req.params.id,
            timestamp: new Date()
        });
        
        successResponse(res, 'Record updated successfully', record);
    } catch (err) {
        next(err);
    }
};

exports.deleteRecord = async (req, res, next) => {
    try {
        await recordService.deleteRecord(req.params.id);
        
        logger.info({
            action: "DELETE_RECORD",
            user: req.user.id,
            recordId: req.params.id,
            timestamp: new Date()
        });
        
        successResponse(res, 'Record deleted successfully', null);
    } catch (err) {
        next(err);
    }
};
