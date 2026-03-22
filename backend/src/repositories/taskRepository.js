const db = require('../config/db');

class TaskRepository {
    async create(userId, taskData) {
        const query = `
            INSERT INTO tasks (title, description, priority, status, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [
            taskData.title, 
            taskData.description, 
            taskData.priority || 'MEDIUM', 
            taskData.status || 'NEW',
            userId
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async findAll(userId, { status, priority, limit = 10, offset = 0 }) {
        let query = 'SELECT * FROM tasks WHERE user_id = $1';
        const values = [userId];
        let paramIndex = 2;

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

    async findById(userId, id) {
        const query = 'SELECT * FROM tasks WHERE id = $1 AND user_id = $2';
        const result = await db.query(query, [id, userId]);
        return result.rows[0];
    }

    async update(userId, id, taskData) {
        const fields = [];
        const values = [id, userId]; 
        let paramIndex = 3;

        for (const [key, value] of Object.entries(taskData)) {
            if (['title', 'description', 'priority', 'status'].includes(key)) {
                fields.push(`${key} = $${paramIndex++}`);
                values.push(value);
            }
        }

        if (fields.length === 0) return this.findById(userId, id);

        const query = `
            UPDATE tasks 
            SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND user_id = $2
            RETURNING *;
        `;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async delete(userId, id) {
        const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id';
        const result = await db.query(query, [id, userId]);
        return result.rowCount > 0;
    }
}

module.exports = new TaskRepository();