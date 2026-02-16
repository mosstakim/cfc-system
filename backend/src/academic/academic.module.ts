import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicService } from './academic.service';
import { AcademicController } from './academic.controller';
import { FormationsController } from './formations.controller';
import { Establishment } from './entities/establishment.entity';
import { Formation } from './entities/formation.entity';
import { Session } from './entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Establishment, Formation, Session])],
  controllers: [AcademicController, FormationsController],
  providers: [AcademicService],
})
export class AcademicModule { }
