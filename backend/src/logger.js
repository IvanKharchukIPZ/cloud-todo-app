const formatLog = (level, message, meta = {}) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level: level,
        message: message,
        ...meta
    };
    return JSON.stringify(logEntry);
};

const logger = {
    info: (message, meta) => {
        console.log(formatLog('INFO', message, meta));
    },
    error: (message, meta) => {
        console.error(formatLog('ERROR', message, meta));
    },
    warn: (message, meta) => {
        console.warn(formatLog('WARN', message, meta));
    },
    debug: (message, meta) => {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(formatLog('DEBUG', message, meta));
        }
    }
};

module.exports = logger;