import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventGateway } from './websockets/event.gateway';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env'],
      isGlobal: true,
    }),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        scheme: configService.get<string>('NEO4J_SCHEME'),
        host: configService.get<string>('NEO4J_HOST'),
        port: configService.get<number>('NEO4J_PORT'),
        username: configService.get<string>('NEO4J_USERNAME'),
        password: configService.get<string>('NEO4J_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventGateway],
})
export class AppModule {}
