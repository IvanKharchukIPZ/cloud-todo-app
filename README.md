# Cloud ToDo API + Web Client

Цей репозиторій містить MVP хмарного додатку для управління задачами. Проєкт складається з бекенду (Node.js/Express) та фронтенду, розгорнутих в AWS.

## Посилання на проєкт

* Frontend (CloudFront): d3vq451rlud1hr.cloudfront.net
* Backend API (App Runner): https://qnnpmfasaw.us-east-1.awsapprunner.com

## Локальний запуск (Docker Compose)

Для локального розгортання API та бази даних PostgreSQL використовується Docker Compose.

1. Клонуйте репозиторій:
   git clone https://github.com/IvanKharchukIPZ/cloud-todo-app.git
   cd cloud-todo-app

2. Створіть файл `.env` у директорії `backend` на основі `.env.example`:
   PORT=8080
   DATABASE_URL=postgresql://postgres:local_secret_password@db:5432/todo_db
   API_KEY=my-super-secret-key-123

3. Запустіть проєкт:
   docker-compose up --build -d

API буде доступне за адресою: http://localhost:8080.

## Міграції бази даних

Ініціалізація схеми бази даних виконується автоматично при першому запуску контейнера `db`. SQL-скрипти з папки `backend/migrations` автоматично виконуються завдяки їх монтуванню в `/docker-entrypoint-initdb.d`. Жодних додаткових команд для міграцій при локальному запуску вводити не потрібно.

## Тестування

Проєкт використовує Jest та Supertest для тестування.

Для запуску всіх тестів виконайте команду:
npm test

## CI/CD Pipeline

Налаштовано автоматизацію через GitHub Actions. При пуші в гілку `main` виконуються наступні кроки:
1. Перевірка коду лінтером.
2. Запуск тестів (Jest).
3. Збірка Docker-образу та пуш в Amazon ECR.
4. Автоматичний деплой в AWS App Runner.