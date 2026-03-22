const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
    console.warn('Попередження: DATABASE_URL не знайдено у змінних середовища.');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(() => console.log('Успішно підключено до бази даних PostgreSQL'))
    .catch(err => console.error('Помилка підключення до БД:', err.message));

module.exports = {
    query: (text, params) => pool.query(text, params),
    end: () => pool.end()
};