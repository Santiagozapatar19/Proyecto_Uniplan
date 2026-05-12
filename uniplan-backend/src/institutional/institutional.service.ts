import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Employee } from './entities/employee.entity';
import { Enrollment } from './entities/enrollment.entity';

// Este servicio SOLO consulta la BD institucional — nunca escribe
@Injectable()
export class InstitutionalService {
  constructor(
    @InjectRepository(Student, 'institutional')
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(Employee, 'institutional')
    private readonly employeeRepo: Repository<Employee>,

    @InjectRepository(Enrollment, 'institutional')
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  // Verifica si un estudiante existe y devuelve sus datos
  async findStudent(studentId: number): Promise<Student | null> {
    return this.studentRepo.findOne({ where: { id: studentId } });
  }

  // Verifica si un empleado existe y devuelve sus datos
  async findEmployee(employeeId: number): Promise<Employee | null> {
    return this.employeeRepo.findOne({ where: { id: employeeId } });
  }

  // RF08 Taller: verifica si el estudiante tiene una materia cursada (por NRC/código)
  async studentHasEnrollment(studentId: number, nrc: string): Promise<boolean> {
    const enrollment = await this.enrollmentRepo.findOne({
      where: {
        studentId: String(studentId),
        nrc,
        status: 'active',
      },
    });
    return !!enrollment;
  }

  // RF08 Voluntariado: devuelve el número de matrículas activas del estudiante
  // Se usa como proxy de "horas acumuladas" si no hay campo directo
  async getStudentActiveEnrollments(studentId: number): Promise<number> {
    return this.enrollmentRepo.count({
      where: { studentId: String(studentId), status: 'active' },
    });
  }
}