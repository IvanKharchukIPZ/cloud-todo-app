const fs = require('fs');
const path = require('path');
const db = require('./db');

const initDb = async () => {
    try {
        const sqlPath = path.join(__dirname, '../../migrations/V1__Create_tasks_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Починаємо міграцію бази даних...');
        await db.query(sql);
        console.log('Таблиця "tasks" готова до роботи!');
    } catch (err) {
        if (err.code === '42P07') {
            console.log('Таблиця "tasks" вже існує, йдемо далі.');
        } else {
            console.error('Помилка під час створення таблиці:', err.message);
        }
    }
};

module.exports = initDb;