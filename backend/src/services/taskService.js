const taskRepository = require('../repositories/taskRepository');

class TaskService {
    async createTask(data) {
        return await taskRepository.create(data);
    }

    async getAllTasks(filters) {
        return await taskRepository.findAll(filters);
    }

    async getTaskById(id) {
        return await taskRepository.findById(id);
    }

    async updateTask(id, data) {
        return await taskRepository.update(id, data);
    }

    async patchTask(id, data) {
        return await taskRepository.update(id, data);
    }

    async deleteTask(id) {
        return await taskRepository.delete(id);
    }
}

module.exports = new TaskService();