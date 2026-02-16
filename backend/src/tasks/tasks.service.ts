
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Session } from '../academic/entities/session.entity';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectRepository(Session)
        private sessionRepository: Repository<Session>,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        this.logger.debug('Running daily session check...');

        const today = new Date();
        // Find sessions that started before today and are still open
        const openSessions = await this.sessionRepository.find({
            where: {
                isOpen: true,
                startDate: LessThan(today),
            },
        });

        if (openSessions.length > 0) {
            this.logger.debug(`Found ${openSessions.length} sessions to close.`);
            for (const session of openSessions) {
                session.isOpen = false;
                await this.sessionRepository.save(session);
                this.logger.debug(`Closed session: ${session.name} (ID: ${session.id})`);
            }
        } else {
            this.logger.debug('No sessions to close.');
        }
    }
}
