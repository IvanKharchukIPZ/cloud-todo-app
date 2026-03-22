ALTER TABLE tasks ADD COLUMN user_id VARCHAR(255);

UPDATE tasks SET user_id = 'default-system-user' WHERE user_id IS NULL;

ALTER TABLE tasks ALTER COLUMN user_id SET NOT NULL;

CREATE INDEX idx_tasks_user_id ON tasks(user_id);