import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config'
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

const logger = new Logger("ProductService")

async function bootstrap() {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.NATS,
        options:{
          servers: envs.nats_servers
        }
      },
    );
    app.useGlobalPipes(
      new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      })
     );
    await app.listen();
    Logger.log(`Product Microservice running port: ${envs.port}`)
    
  } catch (error) {
    console.error(error);
  }

}
bootstrap();
