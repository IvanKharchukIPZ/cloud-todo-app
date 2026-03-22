CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(120) NOT NULL CHECK (char_length(title) >= 3),
    description VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'NEW' 
        CHECK (status IN ('NEW', 'IN_PROGRESS', 'DONE')),
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' 
        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);