import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileBienestar } from './entities/profile-bienestar.entity';
import { ProfileBienestarController } from './profile-bienestar.controller';
import { ProfileBienestarService } from './profile-bienestar.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileBienestar], 'uniplan')],
  controllers: [ProfileBienestarController],
  providers: [ProfileBienestarService],
  exports: [ProfileBienestarService],
})
export class ProfileBienestarModule {}
