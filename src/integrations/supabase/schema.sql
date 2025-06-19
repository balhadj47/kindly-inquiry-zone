
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create users table with all required fields
create table if not exists users (
  id serial primary key,
  auth_user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text not null default '',
  role_id integer not null default 3,
  status text not null default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  driver_license text,
  total_trips integer default 0,
  last_trip timestamp with time zone,
  profile_image text,
  badge_number text,
  date_of_birth date,
  place_of_birth text,
  address text
);

-- Create user_groups table (system roles)
create table if not exists user_groups (
  id serial primary key,
  name text not null unique,
  description text,
  permissions jsonb default '[]'::jsonb,
  color text default '#3b82f6',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default system groups
insert into user_groups (id, name, description, permissions, color) values 
(1, 'Administrator', 'Full system access', '["users:read", "users:create", "users:update", "users:delete", "vans:read", "vans:create", "vans:update", "vans:delete", "trips:read", "trips:create", "trips:update", "trips:delete", "companies:read", "companies:create", "companies:update", "companies:delete", "groups:read", "groups:manage", "dashboard:read", "settings:read", "settings:update"]'::jsonb, '#dc2626'),
(2, 'Supervisor', 'Supervisory access', '["users:read", "users:update", "vans:read", "vans:update", "trips:read", "trips:create", "trips:update", "companies:read", "groups:read", "dashboard:read"]'::jsonb, '#ea580c'),
(3, 'Employee', 'Basic employee access', '["dashboard:read", "trips:read", "trips:create", "companies:read", "vans:read"]'::jsonb, '#3b82f6')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  permissions = excluded.permissions,
  color = excluded.color;

-- Companies table
create table if not exists companies (
  id serial primary key,
  name text not null,
  address text,
  phone text,
  email text,
  contact_person text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Company branches table
create table if not exists company_branches (
  id serial primary key,
  company_id integer references companies(id) on delete cascade,
  name text not null,
  address text,
  phone text,
  manager_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Vans table
create table if not exists vans (
  id serial primary key,
  license_plate text not null unique,
  model text not null,
  year integer,
  capacity integer,
  current_km integer default 0,
  last_maintenance_km integer default 0,
  status text default 'Available',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trips table
create table if not exists trips (
  id serial primary key,
  van_id integer references vans(id) on delete restrict,
  driver_id integer references users(id) on delete restrict,
  company_id integer references companies(id) on delete restrict,
  branch_id integer references company_branches(id) on delete restrict,
  destination text not null,
  purpose text,
  start_time timestamp with time zone default timezone('utc'::text, now()) not null,
  end_time timestamp with time zone,
  start_km integer not null,
  end_km integer,
  status text default 'Active',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mission roles table
create table if not exists mission_roles (
  id serial primary key,
  name text not null unique,
  description text,
  permissions jsonb default '[]'::jsonb,
  color text default '#6b7280',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default mission roles
insert into mission_roles (name, description, permissions, color) values 
('Driver', 'Vehicle operator', '["trips:create", "trips:update", "vans:read"]'::jsonb, '#10b981'),
('Assistant', 'Mission assistant', '["trips:read", "companies:read"]'::jsonb, '#8b5cf6'),
('Supervisor', 'Mission supervisor', '["trips:read", "trips:update", "users:read"]'::jsonb, '#f59e0b')
on conflict (name) do update set
  description = excluded.description,
  permissions = excluded.permissions,
  color = excluded.color;

-- RLS Policies
alter table users enable row level security;
alter table companies enable row level security;
alter table company_branches enable row level security;
alter table vans enable row level security;
alter table trips enable row level security;
alter table user_groups enable row level security;
alter table mission_roles enable row level security;

-- Allow all operations for authenticated users (simplified for development)
create policy "Allow all for authenticated users" on users for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated users" on companies for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated users" on company_branches for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated users" on vans for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated users" on trips for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated users" on user_groups for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated users" on mission_roles for all using (auth.role() = 'authenticated');
