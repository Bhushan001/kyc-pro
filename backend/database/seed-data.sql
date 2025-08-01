-- Demo tenant & users
INSERT INTO core.tenants (id, name, domain) VALUES
  ('11111111-1111-1111-1111-111111111111','Platform','platform.com'),
  ('22222222-2222-2222-2222-222222222222','Demo Company','demo.company.com');

-- Password: bcrypt('Admin123!') etc.
INSERT INTO auth.users (id,email,password_hash,name,role,tenant_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','admin@platform.com',
   '$2a$10$8K1p/a0dL2LkUnC9PQ7/dOJtHN1KR9.V5pB3YFvuFy.GqT8mAFKWK',
   'Platform Admin','platform_admin','11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','admin@demo.company.com',
   '$2a$10$8K1p/a0dL2LkUnC9PQ7/dOJtHN1KR9.V5pB3YFvuFy.GqT8mAFKWK',
   'Demo Admin','tenant_admin','22222222-2222-2222-2222-222222222222'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc','user@demo.company.com',
   '$2a$10$8K1p/a0dL2LkUnC9PQ7/dOJtHN1KR9.V5pB3YFvuFy.GqT8mAFKWK',
   'End User','user','22222222-2222-2222-2222-222222222222');
