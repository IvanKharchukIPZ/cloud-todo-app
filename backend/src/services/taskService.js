const taskRepository = require('../repositories/taskRepository');

class TaskService {
    async createTask(userId, data) {
        return await taskRepository.create(userId, data);
    }

    async getAllTasks(userId, filters) {
        return await taskRepository.findAll(userId, filters);
    }

    async getTaskById(userId, id) {
        return await taskRepository.findById(userId, id);
    }

    async updateTask(userId, id, data) {
        return await taskRepository.update(userId, id, data);
    }

    async patchTask(userId, id, data) {
        return await taskRepository.update(userId, id, data);
    }

    async deleteTask(userId, id) {
        return await taskRepository.delete(userId, id);
    }
}

module.exports = new TaskService();