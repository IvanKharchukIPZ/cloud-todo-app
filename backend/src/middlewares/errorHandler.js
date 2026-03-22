// Централізований обробник помилок
function errorHandler(err, req, res, next) {
    console.error(`[Error] ${err.message}`);

    const statusCode = err.statusCode || 500;
    const response = {
        code: err.code || 'INTERNAL_SERVER_ERROR',
        message: err.message || 'Внутрішня помилка сервера',
        details: err.details || []
    };

    res.status(statusCode).json(response);
}

module.exports = errorHandler;