-- Insert demo tenants
INSERT INTO core.tenants (id, name, domain, plan) VALUES
('11111111-1111-1111-1111-111111111111', 'Platform Admin', 'platform.com', 'enterprise'),
('22222222-2222-2222-2222-222222222222', 'Demo Company', 'demo.company.com', 'business');

-- Insert demo users with bcrypt hashed passwords for 'Admin123!', 'Demo123!', 'User123!'
-- The bcrypt hashes below are samples; use the correct hashes if changing passwords

INSERT INTO auth.users (id, email, password_hash, name, role, tenant_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@platform.com', '$2a$10$8K1p/a0dL2LkUnC9PQ7/dOJtHN1KR9.V5pB3YFvuFy.GqT8mAFKWK', 'Platform Admin', 'platform_admin', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'admin@demo.company.com',  '$2a$10$8K1p/a0dL2LkUnC9PQ7/dOJtHN1KR9.V5pB3YFvuFy.GqT8mAFKWK', 'Demo Admin', 'tenant_admin', '22222222-2222-2222-2222-222222222222'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'user@demo.company.com',      '$2a$10$8K1p/a0dL2LkUnC9PQ7/dOJtHN1KR9.V5pB3YFvuFy.GqT8mAFKWK', 'Demo User', 'user', '22222222-2222-2222-2222-222222222222');

-- Insert modules (only a subset shown for brevity)

INSERT INTO core.modules (id, name, description, category, features, monthly_price, yearly_price) VALUES
('m0000001-0001-0001-0001-000000000001', 'My Tasks', 'Essential task management', 'Core Task Management', '["Add Task", "Complete Task"]', 15.99, 160.00),
('m0000001-0001-0001-0001-000000000002', 'Kanban Board', 'Visual workflow with drag-and-drop', 'Core Task Management', '["Drag and Drop", "Boards"]', 19.99, 200.00),
('m0000001-0001-0001-0001-000000000005', 'Client', 'B2B client management', 'Business Operations', '["CRM", "Lead Tracking"]', 29.99, 300.00),
('m0000001-0001-0001-0001-000000000006', 'Impact', 'KPI tracking dashboards', 'Business Operations', '["KPI Metrics", "Performance Dashboard"]', 24.99, 250.00);

-- Demo subscriptions for Demo Company tenant (tenant_id = '2222...')

INSERT INTO billing.subscriptions (tenant_id, module_id, billing_cycle, price) VALUES
('22222222-2222-2222-2222-222222222222', 'm0000001-0001-0001-0001-000000000001', 'monthly', 15.99),
('22222222-2222-2222-2222-222222222222', 'm0000001-0001-0001-0001-000000000002', 'monthly', 19.99),
('22222222-2222-2222-2222-222222222222', 'm0000001-0001-0001-0001-000000000005', 'yearly', 300.00),
('22222222-2222-2222-2222-222222222222', 'm0000001-0001-0001-0001-000000000006', 'monthly', 24.99);
