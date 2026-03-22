const request = require('supertest');
const app = require('../../src/app');

describe('Integration Tests: Task API', () => {

    //Перевірка валідації (помилка 400)
    it('1. POST /api/tasks повинен повернути 400 VALIDATION_ERROR, якщо title занадто короткий', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .send({ title: 'ab' });
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
        expect(response.body).toHaveProperty('details');
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    //Перевірка успішного створення (статус 201)
    it('2. POST /api/tasks повинен повернути 201 Created при правильних вхідних даних', async () => {
        const newTask = { 
            title: 'Написати тести повністю', 
            priority: 'HIGH' 
        };

        const response = await request(app)
            .post('/api/tasks')
            .send(newTask);
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newTask.title);
        expect(response.body.priority).toBe('HIGH');
        expect(response.body.status).toBe('NEW');
    });

    //Перевірка отримання списку з пагінацією та фільтрами
    it('3. GET /api/tasks повинен повертати 200 OK і правильну структуру з пагінацією', async () => {
        const response = await request(app)
            .get('/api/tasks?limit=5&offset=0&status=NEW');

        expect(response.statusCode).toBe(200);
        
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        
        expect(response.body).toHaveProperty('meta');
        expect(response.body.meta).toHaveProperty('limit', 5);
        expect(response.body.meta).toHaveProperty('offset', 0);
        expect(response.body.meta).toHaveProperty('total');
    });

});