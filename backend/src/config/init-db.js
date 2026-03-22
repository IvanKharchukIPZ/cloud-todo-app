const fs = require('fs');
const path = require('path');
const db = require('./db');

const initDb = async () => {
    try {
        const migrationsDir = path.join(__dirname, '../../migrations');
        
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        console.log('Починаємо перевірку та запуск міграцій...');

        for (const file of files) {
            const sqlPath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(sqlPath, 'utf8');

            try {
                console.log(`-> Виконання ${file}...`);
                await db.query(sql);
                console.log(`   Успішно!`);
            } catch (err) {

                if (err.code === '42P07' || err.code === '42701') {
                    console.log(`   Пропущено (вже застосовано).`);
                } else {
                    console.error(`   Помилка під час виконання ${file}:`, err.message);
                    throw err; 
                }
            }
        }
        
        console.log('Всі міграції актуальні! База готова до роботи.');
    } catch (err) {
        console.error('Критична помилка ініціалізації БД:', err.message);
    }
};

module.exports = initDb;