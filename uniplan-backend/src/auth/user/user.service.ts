import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { UserRole } from 'src/auth/user-role/entities/user-role.entity';
import { Role } from 'src/auth/role/entities/role.entity';
import { ProfileProfessor } from 'src/auth/profiles/professor/entities/profile-professor.entity';
import { ProfileLeader } from 'src/auth/profiles/leader/entities/profile-leader.entity';
import { ProfileBienestar } from 'src/auth/profiles/bienestar/entities/profile-bienestar.entity';
import { Student } from 'src/institutional/entities/student.entity';
import { Employee } from 'src/institutional/entities/employee.entity';
import { RegisterStudentDto, RegisterOrganizerDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    // ── Repos UniPlan (PostgreSQL 'uniplan') ──────────────────
    @InjectRepository(UniplanUser, 'uniplan')
    private readonly userRepo: Repository<UniplanUser>,

    @InjectRepository(UserRole, 'uniplan')
    private readonly userRoleRepo: Repository<UserRole>,

    @InjectRepository(Role, 'uniplan')
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(ProfileProfessor, 'uniplan')
    private readonly profProfRepo: Repository<ProfileProfessor>,

    @InjectRepository(ProfileLeader, 'uniplan')
    private readonly profLeaderRepo: Repository<ProfileLeader>,

    @InjectRepository(ProfileBienestar, 'uniplan')
    private readonly profBienestarRepo: Repository<ProfileBienestar>,

    // ── Repos Institucional (PostgreSQL 'institutional') ──────
    @InjectRepository(Student, 'institutional')
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(Employee, 'institutional')
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  // ── RF01: Registro de estudiante ─────────────────────────────
  async registerStudent(dto: RegisterStudentDto): Promise<Omit<UniplanUser, 'password'>> {
    // 1. Validar que el estudiante existe en la BD institucional
    const instStudent = await this.studentRepo.findOne({
      where: { id: dto.studentId },
    });
    if (!instStudent) {
      throw new NotFoundException(
        `El estudiante con ID ${dto.studentId} no existe en la base institucional`,
      );
    }

    // 2. Validar que el correo coincide con el institucional
    if (instStudent.email !== dto.email) {
      throw new BadRequestException(
        'El correo no coincide con el registrado en la base institucional',
      );
    }

    // 3. Validar que no esté ya registrado en UniPlan
    const existing = await this.userRepo.findOne({
      where: [{ username: dto.username }, { studentId: dto.studentId }],
    });
    if (existing) {
      throw new ConflictException('El usuario o estudiante ya está registrado en UniPlan');
    }

    // 4. Hashear contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 5. Crear usuario y asignar rol 'student' en una sola transacción
    const studentRole = await this.roleRepo.findOne({ where: { name: 'student' } });
    if (!studentRole) throw new NotFoundException('Rol student no encontrado');

    const newUser = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      isActive: true,
      studentId: dto.studentId,
      employeeId: null,
    });

    const savedUser = await this.userRepo.save(newUser);

    const userRole = this.userRoleRepo.create({
      userId: savedUser.id,
      roleId: studentRole.id,
      assignedBy: null,
    });
    await this.userRoleRepo.save(userRole);

    const { password, ...safeUser } = savedUser;
    return safeUser;
  }

  // ── RF03: Registro de organizador (solo admin) ────────────────
  async registerOrganizer(
    dto: RegisterOrganizerDto,
    adminId: number,
  ): Promise<Omit<UniplanUser, 'password'>> {
    // 1. Validar que el empleado existe en la BD institucional
    const instEmployee = await this.employeeRepo.findOne({
      where: { id: dto.employeeId },
    });
    if (!instEmployee) {
      throw new NotFoundException(
        `El empleado con ID ${dto.employeeId} no existe en la base institucional`,
      );
    }

    // 2. Validar que el correo coincide
    if (instEmployee.email !== dto.email) {
      throw new BadRequestException(
        'El correo no coincide con el registrado en la base institucional',
      );
    }

    // 3. Validar que no esté ya registrado
    const existing = await this.userRepo.findOne({
      where: [{ username: dto.username }, { employeeId: dto.employeeId }],
    });
    if (existing) {
      throw new ConflictException('El usuario o empleado ya está registrado en UniPlan');
    }

    // 4. Validar que el perfil correspondiente fue enviado
    if (dto.organizerType === 'professor' && !dto.profileProfessor) {
      throw new BadRequestException('Se requiere profileProfessor para tipo professor');
    }
    if (dto.organizerType === 'leader' && !dto.profileLeader) {
      throw new BadRequestException('Se requiere profileLeader para tipo leader');
    }
    if (dto.organizerType === 'welfare' && !dto.profileBienestar) {
      throw new BadRequestException('Se requiere profileBienestar para tipo welfare');
    }

    // 5. Resolver el rol
    const roleNameMap = { professor: 'professor', leader: 'leader', welfare: 'welfare' };
    const role = await this.roleRepo.findOne({
      where: { name: roleNameMap[dto.organizerType] },
    });
    if (!role) throw new NotFoundException(`Rol ${dto.organizerType} no encontrado`);

    // 6. Hashear contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 7. Crear usuario
    const newUser = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      isActive: true,
      studentId: null,
      employeeId: dto.employeeId,
    });
    const savedUser = await this.userRepo.save(newUser);

    // 8. Asignar rol
    const userRole = this.userRoleRepo.create({
      userId: savedUser.id,
      roleId: role.id,
      assignedBy: adminId,
    });
    await this.userRoleRepo.save(userRole);

    // 9. Crear perfil especializado según tipo
    if (dto.organizerType === 'professor' && dto.profileProfessor) {
      await this.profProfRepo.save(
        this.profProfRepo.create({ userId: savedUser.id, ...dto.profileProfessor }),
      );
    } else if (dto.organizerType === 'leader' && dto.profileLeader) {
      await this.profLeaderRepo.save(
        this.profLeaderRepo.create({ userId: savedUser.id, ...dto.profileLeader }),
      );
    } else if (dto.organizerType === 'welfare' && dto.profileBienestar) {
      await this.profBienestarRepo.save(
        this.profBienestarRepo.create({ userId: savedUser.id, ...dto.profileBienestar }),
      );
    }

    const { password, ...safeUser } = savedUser;
    return safeUser;
  }

  // ── Buscar usuario por ID (para el admin) ────────────────────
  async findById(id: number): Promise<Omit<UniplanUser, 'password'>> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: [
        'userRoles',
        'userRoles.role',
        'profileProfessor',
        'profileLeader',
        'profileBienestar',
      ],
    });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // ── Listar todos los usuarios (solo admin) ───────────────────
  async findAll(): Promise<Omit<UniplanUser, 'password'>[]> {
    const users = await this.userRepo.find({
      relations: ['userRoles', 'userRoles.role'],
      order: { id: 'ASC' },
    });
    return users.map(({ password, ...u }) => u);
  }
}