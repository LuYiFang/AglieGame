import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { PermissionModule } from './permission/permission.module';
import { ProjectModule } from './project/project.module';
import { WorkItemModule } from './work-item/work-item.module';
import { ProjectSettingsModule } from './project-settings/project-settings.module';
import { CommonModule } from './common/common.module';
import { QueueModule } from './queue/queue.module';
import { AbilityModule } from './user/ability/ability.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        process.env.NODE_ENV ? `.env.${process.env.NODE_ENV.trim()}` : '.env',
      ],
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
    EventModule,
    PermissionModule,
    ProjectModule,
    WorkItemModule,
    ProjectSettingsModule,
    CommonModule,
    QueueModule,
    AbilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
