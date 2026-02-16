import { Repository } from 'typeorm';
import { Session } from '../academic/entities/session.entity';
export declare class TasksService {
    private sessionRepository;
    private readonly logger;
    constructor(sessionRepository: Repository<Session>);
    handleCron(): Promise<void>;
}
