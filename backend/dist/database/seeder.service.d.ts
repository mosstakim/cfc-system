import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Establishment } from '../academic/entities/establishment.entity';
import { Formation } from '../academic/entities/formation.entity';
import { Session } from '../academic/entities/session.entity';
import { Registration } from '../registration/entities/registration.entity';
import { Dossier } from '../registration/entities/dossier.entity';
export declare class SeederService implements OnApplicationBootstrap {
    private userRepository;
    private establishmentRepository;
    private formationRepository;
    private sessionRepository;
    private registrationRepository;
    private dossierRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>, establishmentRepository: Repository<Establishment>, formationRepository: Repository<Formation>, sessionRepository: Repository<Session>, registrationRepository: Repository<Registration>, dossierRepository: Repository<Dossier>);
    onApplicationBootstrap(): Promise<void>;
    private seedUsers;
    private seedAcademicData;
    private createEstablishmentWithFormations;
}
