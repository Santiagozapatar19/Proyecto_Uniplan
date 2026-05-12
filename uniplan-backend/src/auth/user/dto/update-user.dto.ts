import { PartialType } from '@nestjs/mapped-types';
import { RegisterStudentDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(RegisterStudentDto) {}