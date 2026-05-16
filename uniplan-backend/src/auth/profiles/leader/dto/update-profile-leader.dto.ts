import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileLeaderDto } from './create-profile-leader.dto';

export class UpdateProfileLeaderDto extends PartialType(CreateProfileLeaderDto) {}