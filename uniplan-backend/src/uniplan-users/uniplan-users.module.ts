import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UniplanUserMongo, UniplanUserMongoSchema } from './schemas/uniplan-user.schema';
import { UniplanUsersService } from './uniplan-users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UniplanUserMongo.name, schema: UniplanUserMongoSchema },
    ]),
  ],
  providers: [UniplanUsersService],
  exports: [UniplanUsersService, MongooseModule],
})
export class UniplanUsersModule {}