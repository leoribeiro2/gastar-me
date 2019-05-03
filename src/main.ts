import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger
  const options = new DocumentBuilder()
    .setTitle('Gastar-Me API')
    .setDescription('Wallet`s to organize credit cards')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Admin')
    .addTag('Cards')
    .addTag('Transactions')
    .addTag('Users')
    .addTag('Wallets')
    .setBasePath('v1/api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  // use global validators
  app.useGlobalPipes(new ValidationPipe());

  // set base path
  app.setGlobalPrefix('v1/api');

  await app.listen(3000);
}
bootstrap();
