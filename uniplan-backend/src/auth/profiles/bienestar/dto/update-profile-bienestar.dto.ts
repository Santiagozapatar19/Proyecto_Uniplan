import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileBienestarDto } from './create-profile-bienestar.dto';

export class UpdateProfileBienestarDto extends PartialType(CreateProfileBienestarDto) {}