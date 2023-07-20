import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const apiPrefix = 'api/1';
  const apiPort = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(apiPrefix);

  const config = new DocumentBuilder()
    .setTitle('Rest Template')
    .setDescription('Rest template using NestJS and Prisma.')
    .setVersion('1.0-alpha')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(apiPort);

  Logger.log(
    `🚀 Application is running on: http://localhost:${apiPort}/${apiPrefix}`
  );
}

bootstrap();
