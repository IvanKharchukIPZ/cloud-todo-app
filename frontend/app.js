const API_BASE_URL = 'https://qnnpmfasaw.us-east-1.awsapprunner.com/api'; 

const HEADERS = {
    'Content-Type': 'application/json',
    'X-API-Key': 'my-super-secret-key-123' 
};

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();

    document.getElementById('filter-status').addEventListener('change', fetchTasks);
    document.getElementById('filter-priority').addEventListener('change', fetchTasks);
});

async function fetchTasks() {
    const statusFilter = document.getElementById('filter-status').value;
    const priorityFilter = document.getElementById('filter-priority').value;

    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (priorityFilter) params.append('priority', priorityFilter);

    try {
        const response = await fetch(`${API_BASE_URL}/tasks?${params.toString()}`, { 
            method: 'GET',
            headers: HEADERS 
        });
        
        if (!response.ok) throw new Error('Помилка авторизації або сервера');
        
        const result = await response.json();
        renderTasks(result.data || result);
    } catch (error) {
        console.error('Помилка завантаження задач:', error);
        alert('Не вдалося завантажити задачі. Перевірте API_BASE_URL та X-API-Key.');
    }
}

document.getElementById('todo-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const titleInput = document.getElementById('task-title');
    const priorityInput = document.getElementById('task-priority');

    const newTask = {
        title: titleInput.value,
        priority: priorityInput.value,
        status: 'NEW'
    };

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(newTask)
        });

        if (response.ok) {
            titleInput.value = '';
            fetchTasks(); 
        } else {
            const errData = await response.json();
            alert(`Помилка: ${errData.message}`);
        }
    } catch (error) {
        console.error('Помилка створення задачі:', error);
    }
});

async function markAsDone(id) {
    try {
        await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PATCH',
            headers: HEADERS,
            body: JSON.stringify({ status: 'DONE' })
        });
        fetchTasks();
    } catch (error) {
        console.error('Помилка оновлення задачі:', error);
    }
}

async function deleteTask(id) {
    if (!confirm('Ви впевнені, що хочете видалити цю задачу?')) return;

    try {
        await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: HEADERS
        });
        fetchTasks();
    } catch (error) {
        console.error('Помилка видалення задачі:', error);
    }
}

function renderTasks(tasks) {
    const list = document.getElementById('task-list');
    list.innerHTML = '';

    if (tasks.length === 0) {
        list.innerHTML = '<li style="justify-content: center; color: #7f8c8d;">Задач не знайдено</li>';
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.setAttribute('data-priority', task.priority);
        
        const isDone = task.status === 'DONE';
        const titleStyle = isDone ? 'text-decoration: line-through; color: #95a5a6;' : '';

        li.innerHTML = `
            <div class="task-info">
                <span style="${titleStyle} font-weight: bold;">${task.title}</span>
                <span class="task-meta">Статус: ${task.status} | Пріоритет: ${task.priority}</span>
            </div>
            <div class="task-actions">
                ${!isDone ? `<button class="done-btn" onclick="markAsDone('${task.id}')">✓</button>` : ''}
                <button class="delete-btn" onclick="deleteTask('${task.id}')">✗</button>
            </div>
        `;
        list.appendChild(li);
    });
}