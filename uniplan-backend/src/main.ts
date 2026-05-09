import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Valida y transforma todos los DTOs automáticamente en cada endpoint
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // elimina campos que no están en el DTO
      forbidNonWhitelisted: true, // lanza error si llegan campos extra
      transform: true,       // convierte tipos automáticamente (string → number, etc.)
    }),
  );

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`UniPlan backend corriendo en: http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();