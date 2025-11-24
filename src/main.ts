import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['user', 'music', 'playlist'],
      protoPath: [
        join(__dirname, '../proto/user.proto'),
        join(__dirname, '../proto/music.proto'),
        join(__dirname, '../proto/playlist.proto'),
      ],
      url: '0.0.0.0:5000',
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  console.log('HTTP server running on http://localhost:3000');
  console.log('gRPC server running on localhost:5000');
}
bootstrap();
