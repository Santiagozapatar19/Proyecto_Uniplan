// ============================================================
// SEED MongoDB UniPlan
// Ejecutar con: mongosh uniplan_mongo mongo-seed.js
// O desde Docker: docker exec -i uniplan_mongo mongosh uniplan_mongo < mongo-seed.js
// ============================================================

// ── Limpiar colecciones antes de insertar ───────────────────
db.events.deleteMany({});
db.uniplan_users.deleteMany({});

// ── 1. uniplan_users ────────────────────────────────────────
// Espejo de los usuarios de PostgreSQL para historial de participación
// usuario_id coincide con uniplan_users.id de PostgreSQL

db.uniplan_users.insertMany([
  // Admin
  {
    userId: 1, fullName: 'Paula Ramírez',
    email: 'paula.ramirez@univcali.edu.co',
    type: 'admin', eventHistory: []
  },
  // Profesores
  {
    userId: 2, fullName: 'Juan Pérez',
    email: 'juan.perez@univcali.edu.co',
    type: 'professor', eventHistory: []
  },
  {
    userId: 3, fullName: 'Carlos López',
    email: 'carlos.lopez@univcali.edu.co',
    type: 'professor', eventHistory: []
  },
  {
    userId: 4, fullName: 'Carlos Mejía',
    email: 'carlos.mejia@univcali.edu.co',
    type: 'professor', eventHistory: []
  },
  {
    userId: 5, fullName: 'Sandra Ortiz',
    email: 'sandra.ortiz@univcali.edu.co',
    type: 'professor', eventHistory: []
  },
  // Bienestar
  {
    userId: 6, fullName: 'Julián Reyes',
    email: 'julian.reyes@univcali.edu.co',
    type: 'welfare', eventHistory: []
  },
  // Estudiantes
  {
    userId: 7, fullName: 'Laura Hernández',
    email: 'laura.hernandez@univcali.edu.co',
    type: 'student', eventHistory: []
  },
  {
    userId: 8, fullName: 'Pedro Martínez',
    email: 'pedro.martinez@univcali.edu.co',
    type: 'student', eventHistory: []
  },
  {
    userId: 9, fullName: 'Ana Suárez',
    email: 'ana.suarez@univcali.edu.co',
    type: 'student', eventHistory: []
  },
  {
    userId: 10, fullName: 'Luis Ramírez',
    email: 'luis.ramirez@univcali.edu.co',
    type: 'student', eventHistory: []
  },
  {
    userId: 11, fullName: 'Sofía García',
    email: 'sofia.garcia@univcali.edu.co',
    type: 'student', eventHistory: []
  },
]);

// ── 2. events ────────────────────────────────────────────────

// Evento 1: Taller (juan.perez lo organiza)
// prerequisiteCourse = 'S103' que es 'Programación' en la BD institucional
// Laura (2001) y Pedro (2002) están matriculados en G103 que tiene S103
const tallerResult = db.events.insertOne({
  code: 'EVT-2025-001',
  title: 'Taller de Estructuras de Datos',
  description: 'Taller práctico sobre listas, pilas y colas en Python',
  type: 'workshop',
  status: 'upcoming',
  startDate: new Date('2025-06-10T08:00:00Z'),
  endDate:   new Date('2025-06-10T12:00:00Z'),
  location: 'Sala 204 - Edificio A',
  maxCapacity: 20,
  availableSpots: 18,
  organizer: {
    userId: 2,
    fullName: 'Juan Pérez',
    email: 'juan.perez@univcali.edu.co',
    role: 'professor'
  },
  details: {
    requiredMaterials: ['Computador', 'Python 3 instalado'],
    prerequisiteCourse: 'S103',   // Programación — se valida en la BD institucional
    minimumSemester: 2
  },
  enrollments: [
    {
      studentId: 7,
      fullName: 'Laura Hernández',
      studentCode: '2001',
      email: 'laura.hernandez@univcali.edu.co',
      enrollmentDate: new Date('2025-05-20T10:00:00Z'),
      status: 'active'
    },
    {
      studentId: 8,
      fullName: 'Pedro Martínez',
      studentCode: '2002',
      email: 'pedro.martinez@univcali.edu.co',
      enrollmentDate: new Date('2025-05-21T11:00:00Z'),
      status: 'cancelled'   // canceló — para probar ese flujo
    }
  ]
});

// Evento 2: Charla (paula.ramirez lo organiza)
const charlaResult = db.events.insertOne({
  code: 'EVT-2025-002',
  title: 'Charla: Salud Mental en la Universidad',
  description: 'Conversatorio sobre manejo del estrés académico',
  type: 'talk',
  status: 'upcoming',
  startDate: new Date('2025-06-15T14:00:00Z'),
  endDate:   new Date('2025-06-15T16:00:00Z'),
  location: 'Auditorio Principal',
  maxCapacity: 100,
  availableSpots: 97,
  organizer: {
    userId: 1,
    fullName: 'Paula Ramírez',
    email: 'paula.ramirez@univcali.edu.co',
    role: 'admin'
  },
  details: {
    speaker: {
      fullName: 'Dra. Marcela Torres',
      profile: 'Psicóloga clínica con 15 años de experiencia',
      affiliation: 'Clínica Valle de Salud'
    },
    links: ['https://meet.google.com/uniplan-charla'],
    extendedDescription: 'Espacio abierto para hablar sobre ansiedad, manejo del tiempo y recursos universitarios disponibles.'
  },
  enrollments: [
    {
      studentId: 9,
      fullName: 'Ana Suárez',
      studentCode: '2003',
      email: 'ana.suarez@univcali.edu.co',
      enrollmentDate: new Date('2025-05-22T09:00:00Z'),
      status: 'active'
    },
    {
      studentId: 10,
      fullName: 'Luis Ramírez',
      studentCode: '2004',
      email: 'luis.ramirez@univcali.edu.co',
      enrollmentDate: new Date('2025-05-22T10:30:00Z'),
      status: 'active'
    },
    {
      studentId: 11,
      fullName: 'Sofía García',
      studentCode: '2005',
      email: 'sofia.garcia@univcali.edu.co',
      enrollmentDate: new Date('2025-05-23T08:00:00Z'),
      status: 'active'
    }
  ]
});

// Evento 3: Torneo (julian.reyes lo organiza)
const torneoResult = db.events.insertOne({
  code: 'EVT-2025-003',
  title: 'Torneo Interfacultades de Fútbol',
  description: 'Torneo semestral entre facultades',
  type: 'tournament',
  status: 'upcoming',
  startDate: new Date('2025-06-20T07:00:00Z'),
  endDate:   new Date('2025-06-20T18:00:00Z'),
  location: 'Cancha Sintética Campus Cali',
  maxCapacity: 44,
  availableSpots: 43,
  organizer: {
    userId: 6,
    fullName: 'Julián Reyes',
    email: 'julian.reyes@univcali.edu.co',
    role: 'welfare'
  },
  details: {
    sport: 'Fútbol',
    rules: 'Reglamento FIFA adaptado, partidos de 15 minutos cada tiempo',
    bracketFormat: 'group_stage',
    numTeams: 4,
    playersPerTeam: 11
  },
  enrollments: [
    {
      studentId: 7,
      fullName: 'Laura Hernández',
      studentCode: '2001',
      email: 'laura.hernandez@univcali.edu.co',
      enrollmentDate: new Date('2025-05-25T14:00:00Z'),
      status: 'active'
    }
  ]
});

// Evento 4: Voluntariado (carlos.mejia lo organiza)
const voluntariadoResult = db.events.insertOne({
  code: 'EVT-2025-004',
  title: 'Jornada de Reforestación Campus Cali',
  description: 'Siembra de árboles nativos en zonas verdes del campus',
  type: 'volunteering',
  status: 'upcoming',
  startDate: new Date('2025-07-05T06:30:00Z'),
  endDate:   new Date('2025-07-05T13:00:00Z'),
  location: 'Zonas verdes Campus Cali',
  maxCapacity: 30,
  availableSpots: 28,
  organizer: {
    userId: 4,
    fullName: 'Carlos Mejía',
    email: 'carlos.mejia@univcali.edu.co',
    role: 'professor'
  },
  details: {
    cause: 'Sostenibilidad ambiental del campus',
    requiredHours: 6,
    activities: ['Siembra de árboles', 'Limpieza de zonas verdes', 'Charla ambiental'],
    meetingPoints: ['Portería principal Campus Cali'],
    responsibleStaff: ['Carlos Mejía', 'Grupo Ecología Icesi']
  },
  enrollments: [
    {
      studentId: 8,
      fullName: 'Pedro Martínez',
      studentCode: '2002',
      email: 'pedro.martinez@univcali.edu.co',
      enrollmentDate: new Date('2025-06-01T10:00:00Z'),
      status: 'active'
    },
    {
      studentId: 11,
      fullName: 'Sofía García',
      studentCode: '2005',
      email: 'sofia.garcia@univcali.edu.co',
      enrollmentDate: new Date('2025-06-02T11:00:00Z'),
      status: 'active'
    }
  ]
});

// Evento 5: Finalizado (para probar el filtro de estado)
db.events.insertOne({
  code: 'EVT-2025-000',
  title: 'Inducción Semestre 2025-1',
  description: 'Evento de bienvenida para estudiantes nuevos',
  type: 'talk',
  status: 'finished',
  startDate: new Date('2025-01-20T08:00:00Z'),
  endDate:   new Date('2025-01-20T12:00:00Z'),
  location: 'Auditorio Principal',
  maxCapacity: 200,
  availableSpots: 0,
  organizer: {
    userId: 1,
    fullName: 'Paula Ramírez',
    email: 'paula.ramirez@univcali.edu.co',
    role: 'admin'
  },
  details: {
    speaker: {
      fullName: 'Paula Ramírez',
      profile: 'Jefe de Bienestar Universitario',
      affiliation: 'Universidad'
    },
    links: [],
    extendedDescription: 'Evento ya finalizado — sirve para probar el filtro por estado.'
  },
  enrollments: []
});

// ── 3. Actualizar event_history de los usuarios ──────────────
// Laura: taller (activa) + torneo (activa)
db.uniplan_users.updateOne(
  { userId: 7 },
  { $push: { eventHistory: {
    $each: [
      {
        eventId: tallerResult.insertedId,
        eventCode: 'EVT-2025-001',
        title: 'Taller de Estructuras de Datos',
        type: 'workshop',
        startDate: new Date('2025-06-10T08:00:00Z'),
        enrollmentStatus: 'active'
      },
      {
        eventId: torneoResult.insertedId,
        eventCode: 'EVT-2025-003',
        title: 'Torneo Interfacultades de Fútbol',
        type: 'tournament',
        startDate: new Date('2025-06-20T07:00:00Z'),
        enrollmentStatus: 'active'
      }
    ]
  }}}
);

// Pedro: taller (cancelada) + voluntariado (activa)
db.uniplan_users.updateOne(
  { userId: 8 },
  { $push: { eventHistory: {
    $each: [
      {
        eventId: tallerResult.insertedId,
        eventCode: 'EVT-2025-001',
        title: 'Taller de Estructuras de Datos',
        type: 'workshop',
        startDate: new Date('2025-06-10T08:00:00Z'),
        enrollmentStatus: 'cancelled'
      },
      {
        eventId: voluntariadoResult.insertedId,
        eventCode: 'EVT-2025-004',
        title: 'Jornada de Reforestación Campus Cali',
        type: 'volunteering',
        startDate: new Date('2025-07-05T06:30:00Z'),
        enrollmentStatus: 'active'
      }
    ]
  }}}
);

// Ana: charla (activa)
db.uniplan_users.updateOne(
  { userId: 9 },
  { $push: { eventHistory: {
    eventId: charlaResult.insertedId,
    eventCode: 'EVT-2025-002',
    title: 'Charla: Salud Mental en la Universidad',
    type: 'talk',
    startDate: new Date('2025-06-15T14:00:00Z'),
    enrollmentStatus: 'active'
  }}}
);

// Luis: charla (activa)
db.uniplan_users.updateOne(
  { userId: 10 },
  { $push: { eventHistory: {
    eventId: charlaResult.insertedId,
    eventCode: 'EVT-2025-002',
    title: 'Charla: Salud Mental en la Universidad',
    type: 'talk',
    startDate: new Date('2025-06-15T14:00:00Z'),
    enrollmentStatus: 'active'
  }}}
);

// Sofía: charla (activa) + voluntariado (activa)
db.uniplan_users.updateOne(
  { userId: 11 },
  { $push: { eventHistory: {
    $each: [
      {
        eventId: charlaResult.insertedId,
        eventCode: 'EVT-2025-002',
        title: 'Charla: Salud Mental en la Universidad',
        type: 'talk',
        startDate: new Date('2025-06-15T14:00:00Z'),
        enrollmentStatus: 'active'
      },
      {
        eventId: voluntariadoResult.insertedId,
        eventCode: 'EVT-2025-004',
        title: 'Jornada de Reforestación Campus Cali',
        type: 'volunteering',
        startDate: new Date('2025-07-05T06:30:00Z'),
        enrollmentStatus: 'active'
      }
    ]
  }}}
);

print('Seed MongoDB completado');
print('Colección events:        ' + db.events.countDocuments() + ' documentos');
print('Colección uniplan_users: ' + db.uniplan_users.countDocuments() + ' documentos');