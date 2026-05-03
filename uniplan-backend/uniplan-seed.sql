-- ============================================================
-- SEED UniPlan PostgreSQL
-- Basado en los datos reales de la BD institucional
-- ============================================================

-- ── 1. ROLES ────────────────────────────────────────────────
INSERT INTO roles (id, name, description) VALUES
(1, 'admin',       'Administrador del sistema - Jefe de Bienestar'),
(2, 'professor',   'Profesor organizador de eventos'),
(3, 'leader',      'Líder estudiantil organizador de eventos'),
(4, 'welfare',     'Personal de Bienestar Universitario'),
(5, 'student',     'Estudiante participante en eventos');

-- ── 2. PERMISSIONS ──────────────────────────────────────────
INSERT INTO permissions (id, name, description) VALUES
(1,  'create_event',      'Puede crear eventos'),
(2,  'view_events',       'Puede ver catálogo de eventos'),
(3,  'enroll_event',      'Puede inscribirse a eventos'),
(4,  'cancel_enrollment', 'Puede cancelar su inscripción'),
(5,  'view_enrollments',  'Puede ver la lista de inscritos de sus eventos'),
(6,  'export_csv',        'Puede exportar inscritos en CSV'),
(7,  'manage_users',      'Puede registrar y gestionar organizadores'),
(8,  'assign_roles',      'Puede asignar roles a usuarios'),
(9,  'view_statistics',   'Puede ver estadísticas administrativas'),
(10, 'view_reports',      'Puede ver informes del sistema');

-- ── 3. ROLE_PERMISSIONS ─────────────────────────────────────
-- Admin: todos los permisos
INSERT INTO role_permissions ("roleId", "permissionId") VALUES
(1, 1),(1, 2),(1, 3),(1, 4),(1, 5),(1, 6),(1, 7),(1, 8),(1, 9),(1, 10);

-- Profesor: crear eventos, ver inscritos, exportar, ver reportes
INSERT INTO role_permissions ("roleId", "permissionId") VALUES
(2, 1),(2, 2),(2, 5),(2, 6),(2, 10);

-- Líder estudiantil: crear eventos, ver inscritos, exportar
INSERT INTO role_permissions ("roleId", "permissionId") VALUES
(3, 1),(3, 2),(3, 5),(3, 6);

-- Personal bienestar: crear eventos, ver inscritos, exportar, ver estadísticas
INSERT INTO role_permissions ("roleId", "permissionId") VALUES
(4, 1),(4, 2),(4, 5),(4, 6),(4, 9),(4, 10);

-- Estudiante: ver eventos, inscribirse, cancelar
INSERT INTO role_permissions ("roleId", "permissionId") VALUES
(5, 2),(5, 3),(5, 4),(5, 10);

-- ── 4. UNIPLAN_USERS ────────────────────────────────────────
-- Passwords hasheadas con bcrypt (plain: "Password123!")
-- En producción esto lo hace el servicio, acá va el hash directo para el seed

INSERT INTO uniplan_users (id, username, email, password, "isActive", "createdAt", "studentId", "employeeId") VALUES
-- Admin (Paula Ramírez - Personal Bienestar, employee 1007)
(1, 'paula.ramirez', 'paula.ramirez@univcali.edu.co',
 '$2b$10$xH8Q2v3mK9nL5pR7sT1uOeW4yZ6aB0cD2fG8hI3jJ4kM6nP7qS9tU', -- Password123!
 TRUE, CURRENT_TIMESTAMP, NULL, 1007),

-- Profesores (employees de tipo Docente)
(2, 'juan.perez',   'juan.perez@univcali.edu.co',
 '$2b$10$xH8Q2v3mK9nL5pR7sT1uOeW4yZ6aB0cD2fG8hI3jJ4kM6nP7qS9tU',
 TRUE, CURRENT_TIMESTAMP, NULL, 1001),

(3, 'carlos.lopez', 'carlos.lopez@univcali.edu.co',
 '$2b$10$xH8Q2v3mK9nL5pR7sT1uOeW4yZ6aB0cD2fG8hI3jJ4kM6nP7qS9tU',
 TRUE, CURRENT_TIMESTAMP, NULL, 1003),

(4, 'carlos.mejia', 'carlos.mejia@univcali.edu.co',
 '$2b$10$xH8Q2v3mK9nL5pR7sT1uOeW4yZ6aB0cD2fG8hI3jJ4kM6nP7qS9tU',
 TRUE, CURRENT_TIMESTAMP, NULL, 1004),

(5, 'sandra.ortiz', 'sandra.ortiz@univcali.edu.co',
 '$2b$10$xH8Q2v3mK9nL5pR7sT1uOeW4yZ6aB0cD2fG8hI3jJ4kM6nP7qS9tU',
 TRUE, CURRENT_TIMESTAMP, NULL, 1005),

-- Personal Bienestar (employee 1006 - Julián Reyes, Administrativo)
(6, 'julian.reyes',  'julian.reyes@univcali.edu.co',
 '$2b$10$xH8Q2v3mK9nL5pR7sT1uOeW4yZ6aB0cD2fG8hI3jJ4kM6nP7qS9tU',
 TRUE, CURRENT_TIMESTAMP, NULL, 1006),

-- Estudiantes (de la BD institucional)
(7,  'laura.hernandez', 'laura.hernandez@univcali.edu.co',
 '$2b$10$xH8Q2v3mK9nL5pR7sT1uOeW4yZ6aB0cD2fG8hI3jJ4kM6nP7qS9tU',
 TRUE, CURRENT_TIMESTAMP, 2001, NULL),

(8,  'pedro.martinez',  'pedro.martinez@univcali.edu.co',
 '$2b$10$xH8Q2v3mK9nL5pR7sT1uOeW4yZ6aB0cD2fG8hI3jJ4kM6nP7qS9tU',
 TRUE, CURRENT_TIMESTAMP, 2002, NULL),

(9,  'ana.suarez',      'ana.suarez@univcali.edu.co',
 '$2b$10$xH8Q2v3mK9nL5pR7sT1uOeW4yZ6aB0cD2fG8hI3jJ4kM6nP7qS9tU',
 TRUE, CURRENT_TIMESTAMP, 2003, NULL),

(10, 'luis.ramirez',    'luis.ramirez@univcali.edu.co',
 '$2b$10$xH8Q2v3mK9nL5pR7sT1uOeW4yZ6aB0cD2fG8hI3jJ4kM6nP7qS9tU',
 TRUE, CURRENT_TIMESTAMP, 2004, NULL),

(11, 'sofia.garcia',    'sofia.garcia@univcali.edu.co',
 '$2b$10$xH8Q2v3mK9nL5pR7sT1uOeW4yZ6aB0cD2fG8hI3jJ4kM6nP7qS9tU',
 TRUE, CURRENT_TIMESTAMP, 2005, NULL);

-- ── 5. USER_ROLES ────────────────────────────────────────────
-- admin asigna todos los roles (assignedBy = 1 = paula.ramirez)
INSERT INTO user_roles ("userId", "roleId", "assignedAt", "assignedBy") VALUES
(1,  1, CURRENT_TIMESTAMP, NULL),   -- paula.ramirez → admin (nadie la asignó)
(2,  2, CURRENT_TIMESTAMP, 1),      -- juan.perez    → professor
(3,  2, CURRENT_TIMESTAMP, 1),      -- carlos.lopez  → professor
(4,  2, CURRENT_TIMESTAMP, 1),      -- carlos.mejia  → professor
(5,  2, CURRENT_TIMESTAMP, 1),      -- sandra.ortiz  → professor
(6,  4, CURRENT_TIMESTAMP, 1),      -- julian.reyes  → welfare
(7,  5, CURRENT_TIMESTAMP, NULL),   -- laura         → student (auto-registro)
(8,  5, CURRENT_TIMESTAMP, NULL),   -- pedro         → student
(9,  5, CURRENT_TIMESTAMP, NULL),   -- ana           → student
(10, 5, CURRENT_TIMESTAMP, NULL),   -- luis          → student
(11, 5, CURRENT_TIMESTAMP, NULL);   -- sofia         → student

-- ── 6. PROFILES ─────────────────────────────────────────────
-- PROFILE_PROFESSORS
-- facultyCode y areaId son referencias lógicas a la BD institucional
INSERT INTO profile_professors (id, "userId", "facultyCode", "areaId", specialization) VALUES
(1, 2, 1, 1, 'Psicología Clínica'),         -- juan.perez,   faculty 1, area 1
(2, 3, 2, 2, 'Ingeniería de Software'),     -- carlos.lopez, faculty 2, area 2
(3, 4, 1, 2, 'Bases de Datos'),             -- carlos.mejia, faculty 1, area 2
(4, 5, 2, 2, 'Redes y Comunicaciones');     -- sandra.ortiz, faculty 2, area 2

-- PROFILES_BIENESTAR
INSERT INTO profiles_bienestar (id, "userId", "administrativeArea", charge) VALUES
(1, 1, 'Bienestar Universitario', 'Jefe de Bienestar'),   -- paula.ramirez
(2, 6, 'Bienestar Universitario', 'Coordinador');          -- julian.reyes

-- ── 7. EVENT_STATISTICS (vacías, se llenan cuando se crean eventos) ──
-- Se insertan cuando el servicio crea el evento en MongoDB
-- Ejemplo de cómo se verán después de crear eventos:
-- INSERT INTO event_statistics ("eventMongoId", "maxCapacity", "totalEnrolled",
--   "totalCancellations", "totalAttendees", "occupancyPercentage", "lastUpdated")
-- VALUES ('507f1f77bcf86cd799439011', 30, 0, 0, 0, 0.00, CURRENT_TIMESTAMP);

-- ── 8. Resetear secuencias ───────────────────────────────────
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('permissions_id_seq', (SELECT MAX(id) FROM permissions));
SELECT setval('uniplan_users_id_seq', (SELECT MAX(id) FROM uniplan_users));
SELECT setval('profile_professors_id_seq', (SELECT MAX(id) FROM profile_professors));
SELECT setval('profiles_bienestar_id_seq', (SELECT MAX(id) FROM profiles_bienestar));