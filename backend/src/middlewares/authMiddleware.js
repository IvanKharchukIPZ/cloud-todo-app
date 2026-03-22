const requireApiKey = (req, res, next) => {
    if (req.path === '/health') {
        return next();
    }

    const apiKey = req.headers['x-api-key'];
    const userId = req.headers['x-user-id'];
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

    if (!userId) {
        return res.status(401).json({
            code: 'UNAUTHORIZED',
            message: 'Відсутній ідентифікатор користувача (X-User-Id заголовок)'
        });
    }

    req.user = { id: userId };
    next();
};

module.exports = requireApiKey;