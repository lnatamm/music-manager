import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { MusicResolver } from './resolvers/music.resolver';
import { PlaylistResolver } from './resolvers/playlist.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { MusicController } from './controllers/music.controller';
import { PlaylistController } from './controllers/playlist.controller';
import { UserController } from './controllers/user.controller';
import { UserGrpcController } from './grpc/user.grpc.controller';
import { MusicGrpcController } from './grpc/music.grpc.controller';
import { PlaylistGrpcController } from './grpc/playlist.grpc.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    SupabaseModule,
  ],
  controllers: [
    AppController,
    MusicController,
    PlaylistController,
    UserController,
    UserGrpcController,
    MusicGrpcController,
    PlaylistGrpcController,
  ],
  providers: [AppService, MusicResolver, PlaylistResolver, UserResolver],
})
export class AppModule {}
