import { Repository } from 'typeorm';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { Registration } from './entities/registration.entity';
import { Dossier } from './entities/dossier.entity';
import { User } from '../users/entities/user.entity';
import { Session } from '../academic/entities/session.entity';
import { MailService } from '../mail/mail.service';
export declare class RegistrationService {
    private registrationRepository;
    private dossierRepository;
    private userRepository;
    private sessionRepository;
    private mailService;
    constructor(registrationRepository: Repository<Registration>, dossierRepository: Repository<Dossier>, userRepository: Repository<User>, sessionRepository: Repository<Session>, mailService: MailService);
    create(createRegistrationDto: CreateRegistrationDto): Promise<Registration>;
    findAll(): Promise<Registration[]>;
    findByCandidate(candidateId: string): Promise<Registration | null>;
    findOne(id: string): Promise<Registration>;
    update(id: string, updateRegistrationDto: UpdateRegistrationDto): Promise<Registration>;
    sendEmail(id: string, type: 'confirmation' | 'validation'): Promise<{
        sent: boolean;
        type: "confirmation" | "validation";
    }>;
    sendBulkEmail(ids: string[], type: 'confirmation' | 'validation'): Promise<any[]>;
    remove(id: string): Promise<{
        deleted: boolean;
        candidateDeleted: boolean;
    }>;
}
