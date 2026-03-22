const express = require('express');
const cors = require('cors'); 

const app = express(); 

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-API-Key', 'X-User-Id'], 
    credentials: true
}));

app.use(express.json());

const { requestIdMiddleware, requestLoggerMiddleware } = require('./middlewares/observability');
const requireApiKey = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const taskController = require('./controllers/taskController');

app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.use('/api', requireApiKey);

app.post('/api/tasks', taskController.createTask);
app.get('/api/tasks', taskController.getTasks);
app.get('/api/tasks/:id', taskController.getTaskById);
app.put('/api/tasks/:id', taskController.updateTaskFully);
app.patch('/api/tasks/:id', taskController.updateTaskPartially);
app.delete('/api/tasks/:id', taskController.deleteTask);

app.use(errorHandler);

module.exports = app;