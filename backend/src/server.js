const app = require('./app');
const initDb = require('./config/init-db');

const PORT = process.env.PORT || 8080;
let server; 

async function startServer() {
    try {
        await initDb();

        server = app.listen(PORT, () => {
            console.log(`Сервер успішно запущено на порту ${PORT}`);
        });

        process.on('SIGTERM', () => gracefulShutdown(server));
        process.on('SIGINT', () => gracefulShutdown(server));

    } catch (err) {
        console.error('Критична помилка при запуску:', err.message);
        process.exit(1);
    }
}

const gracefulShutdown = (serverInstance) => {
    if (!serverInstance) process.exit(0);

    console.log('Отримано сигнал на завершення. Закриваємо з\'єднання...');
    
    serverInstance.close(() => {
        console.log('HTTP-сервер закрито.');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Примусове завершення роботи сервера через таймаут');
        process.exit(1);
    }, 10000);
};

startServer();