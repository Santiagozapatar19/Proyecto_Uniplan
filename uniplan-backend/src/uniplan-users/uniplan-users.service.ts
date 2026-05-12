import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UniplanUserMongo } from './schemas/uniplan-user.schema';

@Injectable()
export class UniplanUsersService {
  constructor(
    @InjectModel(UniplanUserMongo.name)
    private readonly userMongoModel: Model<UniplanUserMongo>,
  ) {}

  // Crear espejo del usuario en MongoDB al momento del registro
  // Debe llamarse desde UserService después de guardar en PostgreSQL
  async createMirror(data: {
    userId: number;
    fullName: string;
    email: string;
    type: string;
  }): Promise<UniplanUserMongo> {
    const existing = await this.userMongoModel.findOne({ userId: data.userId });
    if (existing) return existing;

    return this.userMongoModel.create({
      userId: data.userId,
      fullName: data.fullName,
      email: data.email,
      type: data.type,
      eventHistory: [],
    });
  }

  // Obtener historial de participación por userId de PostgreSQL
  async getHistory(userId: number) {
    const userMongo = await this.userMongoModel
      .findOne({ userId })
      .select('eventHistory')
      .exec();
    return userMongo?.eventHistory ?? [];
  }
}