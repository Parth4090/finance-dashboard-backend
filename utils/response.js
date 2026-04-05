exports.successResponse = (res, message, data, meta = null, statusCode = 200) => {
    const response = {
        success: true,
        message,
        data,
    };
    if (meta) response.meta = meta;
    return res.status(statusCode).json(response);
};
