import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Employee } from './entities/employee.entity';
import { FacultyEntity } from './entities/faculty.entity';
import { Enrollment } from './entities/enrollment.entity';
import { InstitutionalService } from './institutional.service';

@Module({
  imports: [
    // SOLO lectura — conexión 'institutional', NUNCA synchronize
    TypeOrmModule.forFeature(
      [Student, Employee, FacultyEntity, Enrollment],
      'institutional',
    ),
  ],
  providers: [InstitutionalService],
  exports: [InstitutionalService, TypeOrmModule], // TypeOrmModule exportado para que UserModule pueda usar sus repos
})
export class InstitutionalModule {}