const taskService = require('../../src/services/taskService');
const taskRepository = require('../../src/repositories/taskRepository');

jest.mock('../../src/repositories/taskRepository');

describe('Task Service Unit Tests', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //Успішне створення задачі
    it('1. повинен успішно створити задачу з переданими даними', async () => {
        const inputData = { title: 'Тестова задача', priority: 'HIGH' };
        const mockDbResponse = { id: 1, title: 'Тестова задача', priority: 'HIGH', status: 'NEW' };
        
        taskRepository.create.mockResolvedValue(mockDbResponse);

        const result = await taskService.createTask(inputData);

        expect(result).toEqual(mockDbResponse);
        expect(taskRepository.create).toHaveBeenCalledTimes(1);
        expect(taskRepository.create).toHaveBeenCalledWith(inputData);
    });

    //Створення задачі (перевірка значень за замовчуванням)
    it('2. повинен створювати задачу зі статусом NEW та пріоритетом MEDIUM за замовчуванням', async () => {
        const inputData = { title: 'Мінімальна задача' };
        const mockDbResponse = { id: 2, title: 'Мінімальна задача', priority: 'MEDIUM', status: 'NEW' };
        
        taskRepository.create.mockResolvedValue(mockDbResponse);

        const result = await taskService.createTask(inputData);

        expect(result.priority).toBe('MEDIUM');
        expect(result.status).toBe('NEW');
    });

    //Успішне отримання задачі за ID
    it('3. повинен повертати задачу за валідним ID', async () => {
        const mockTask = { id: 1, title: 'Задача 1' };
        taskRepository.findById.mockResolvedValue(mockTask);

        const result = await taskService.getTaskById(1);

        expect(result).toEqual(mockTask);
        expect(taskRepository.findById).toHaveBeenCalledWith(1);
    });

    //Помилка 404, якщо задачу не знайдено при запиті за ID
    it('4. повинен викидати помилку 404, якщо задачу не знайдено', async () => {
        taskRepository.findById.mockResolvedValue(null);

        await expect(taskService.getTaskById(999)).rejects.toThrow('Задачу не знайдено');
    });

    //Успішне часткове оновлення (PATCH)
    it('5. повинен успішно оновлювати статус задачі', async () => {
        const updateData = { status: 'DONE' };
        const mockUpdatedTask = { id: 1, title: 'Задача', status: 'DONE' };
        
        taskRepository.findById.mockResolvedValue({ id: 1, title: 'Задача', status: 'NEW' });
        taskRepository.update.mockResolvedValue(mockUpdatedTask);

        const result = await taskService.updateTask(1, updateData);

        expect(result.status).toBe('DONE');
        expect(taskRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    //Успішне видалення задачі
    it('6. повинен успішно видаляти задачу', async () => {
        taskRepository.findById.mockResolvedValue({ id: 1, title: 'Задача для видалення' });
        taskRepository.delete.mockResolvedValue(true);

        const result = await taskService.deleteTask(1);

        expect(result).toBe(true);
        expect(taskRepository.delete).toHaveBeenCalledWith(1);
    });
});