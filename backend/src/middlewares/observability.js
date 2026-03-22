const { v4: uuidv4 } = require('uuid');

const requestIdMiddleware = (req, res, next) => {
    req.id = uuidv4();
    next();
};

const requestLoggerMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ID: ${req.id || 'no-id'} - ${req.method} ${req.url}`);
    next();
};

module.exports = {
    requestIdMiddleware,
    requestLoggerMiddleware
};