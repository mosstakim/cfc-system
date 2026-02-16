
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Session } from '../academic/entities/session.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Session])],
    providers: [TasksService],
})
export class TasksModule { }
