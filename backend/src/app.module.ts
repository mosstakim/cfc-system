import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AcademicModule } from './academic/academic.module';
import { RegistrationModule } from './registration/registration.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeederService } from './database/seeder.service';
import { User } from './users/entities/user.entity';
import { Establishment } from './academic/entities/establishment.entity';
import { Formation } from './academic/entities/formation.entity';
import { Session } from './academic/entities/session.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { ReportingModule } from './reporting/reporting.module';

import { DossierModule } from './dossier/dossier.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'db',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'cfc_user',
      password: process.env.DATABASE_PASSWORD || 'cfc_password',
      database: process.env.DATABASE_NAME || 'cfc_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Establishment, Formation, Session]),
    UsersModule,
    AcademicModule,
    // AcademicModule, // Remove duplicate
    RegistrationModule,
    AuthModule,
    DossierModule,
    TasksModule,
    ReportingModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule { }
