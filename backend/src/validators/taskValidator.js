const { z } = require('zod');

const createTaskSchema = z.object({
    title: z.string().min(3).max(120),
    description: z.string().max(500).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    status: z.enum(['NEW', 'IN_PROGRESS', 'DONE']).optional()
});

module.exports = { createTaskSchema };