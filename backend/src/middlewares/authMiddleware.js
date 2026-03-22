const requireApiKey = (req, res, next) => {
    if (req.path === '/health') {
        return next();
    }

    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;

    if (!apiKey) {
        return res.status(401).json({
            code: 'UNAUTHORIZED',
            message: 'Відсутній API ключ (X-API-Key заголовок)'
        });
    }

    if (apiKey !== validApiKey) {
        return res.status(401).json({
            code: 'UNAUTHORIZED',
            message: 'Недійсний API ключ'
        });
    }

    next();
};

module.exports = requireApiKey;