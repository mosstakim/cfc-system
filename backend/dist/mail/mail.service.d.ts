import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
export declare class MailService {
    private configService;
    private transporter;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private createTransporter;
    sendRegistrationConfirmation(user: User): Promise<void>;
    sendAccountValidation(user: User): Promise<void>;
}
