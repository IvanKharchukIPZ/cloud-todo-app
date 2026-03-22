const taskService = require('../services/taskService');
const { createTaskSchema } = require('../validators/taskValidator');

class TaskController {
    async createTask(req, res, next) {
        try {
            const validationResult = createTaskSchema.safeParse(req.body);
            if (!validationResult.success) {
                const error = new Error('Помилка валідації даних');
                error.statusCode = 400;
                error.code = 'VALIDATION_ERROR';
                error.details = validationResult.error.errors;
                throw error;
            }
            const task = await taskService.createTask(validationResult.data);
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    }

    async getTasks(req, res, next) {
        try {
            const { status, priority, limit, offset } = req.query;
            const tasks = await taskService.getAllTasks({ status, priority, limit, offset });
            res.status(200).json(tasks);
        } catch (error) {
            next(error);
        }
    }

    async getTaskById(req, res, next) {
        try {
            const task = await taskService.getTaskById(req.params.id);
            if (!task) {
                const error = new Error('Задачу не знайдено');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json(task);
        } catch (error) {
            next(error);
        }
    }

    async updateTaskFully(req, res, next) {
        try {
            const updatedTask = await taskService.updateTask(req.params.id, req.body);
            res.status(200).json(updatedTask);
        } catch (error) {
            next(error);
        }
    }

    async updateTaskPartially(req, res, next) {
        try {
            const updatedTask = await taskService.patchTask(req.params.id, req.body);
            res.status(200).json(updatedTask);
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req, res, next) {
        try {
            await taskService.deleteTask(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TaskController();