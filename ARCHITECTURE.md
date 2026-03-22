# Архітектура Cloud ToDo App

Цей документ описує інфраструктуру AWS та внутрішню архітектуру коду бекенду на базі Node.js.

## Інфраструктура (AWS)

Система побудована на керованих сервісах AWS:

* Frontend: Статичні файли зберігаються в Amazon S3 та доставляються користувачам через CDN Amazon CloudFront.
* Backend: REST API (Node.js + Express) працює в AWS App Runner. Це забезпечує автоматичний скейлінг контейнерів.
* Database: Amazon RDS (PostgreSQL).
* Secrets: Чутливі дані (API-ключі, підключення до БД) підтягуються з AWS Secrets Manager.
* Logs & Metrics: Всі структуровані логи відправляються в Amazon CloudWatch.

## Архітектура коду

Бекенд побудовано з використанням трирівневої архітектури для чіткого розділення відповідальності:

1. Controller / Handler Layer (Express): Приймає HTTP-запити. Валідація вхідних даних (DTO) виконується за допомогою бібліотеки Zod.
2. Service Layer: Містить бізнес-логіку додатку (створення, оновлення задач). Не залежить від HTTP-контексту.
3. Repository Layer: Відповідає за взаємодію з базою даних. SQL-запити виконуються безпосередньо через бібліотеку `pg` (node-postgres).

## Обробка помилок

В API реалізовано централізований обробник помилок (Error Handler Middleware). Будь-яка помилка повертається клієнту в єдиному стандартному форматі:

{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": ["title must be between 3 and 120 characters"]
}

## Схема бази даних

Основна таблиця `tasks`:
* id (UUID)
* title (VARCHAR, 3-120 characters)
* description (VARCHAR, up to 500 characters)
* status (VARCHAR: NEW, IN_PROGRESS, DONE)
* priority (VARCHAR: LOW, MEDIUM, HIGH)
* due_date (TIMESTAMP)
* created_at (TIMESTAMP)
* updated_at (TIMESTAMP)

Для оптимізації фільтрації створено індекси на полях `status` та `priority`.

## Cloud Readiness

* Конфігурація додатку відбувається виключно через змінні середовища (env vars).
* Використовується multi-stage Dockerfile для оптимізації розміру фінального образу.
* Логи структуровані, кожен запит містить унікальний request-id для полегшення дебагінгу в CloudWatch.