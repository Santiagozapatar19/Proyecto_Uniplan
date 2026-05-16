import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileLeader } from './entities/profile-leader.entity';
import { ProfileLeaderController } from './profile-leader.controller';
import { ProfileLeaderService } from './profile-leader.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileLeader], 'uniplan')],
  controllers: [ProfileLeaderController],
  providers: [ProfileLeaderService],
  exports: [ProfileLeaderService],
})
export class ProfileLeaderModule {}
