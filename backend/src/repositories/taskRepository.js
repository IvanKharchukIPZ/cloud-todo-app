const db = require('../config/db');

class TaskRepository {
    async create(taskData) {
        const query = `
            INSERT INTO tasks (title, description, priority, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [
            taskData.title, 
            taskData.description, 
            taskData.priority || 'MEDIUM', 
            taskData.status || 'NEW'
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async findAll({ status, priority, limit = 10, offset = 0 }) {
        let query = 'SELECT * FROM tasks WHERE 1=1';
        const values = [];
        let paramIndex = 1;

        if (status) {
            query += ` AND status = $${paramIndex++}`;
            values.push(status);
        }

        if (priority) {
            query += ` AND priority = $${paramIndex++}`;
            values.push(priority);
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        values.push(limit, offset);

        const result = await db.query(query, values);
        return result.rows;
    }

    async findById(id) {
        const query = 'SELECT * FROM tasks WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async update(id, taskData) {
        const fields = [];
        const values = [id];
        let paramIndex = 2;

        for (const [key, value] of Object.entries(taskData)) {
            if (['title', 'description', 'priority', 'status'].includes(key)) {
                fields.push(`${key} = $${paramIndex++}`);
                values.push(value);
            }
        }

        if (fields.length === 0) return this.findById(id);

        const query = `
            UPDATE tasks 
            SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *;
        `;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async delete(id) {
        const query = 'DELETE FROM tasks WHERE id = $1 RETURNING id';
        const result = await db.query(query, [id]);
        return result.rowCount > 0;
    }
}

module.exports = new TaskRepository();