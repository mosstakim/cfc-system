import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Establishment } from '../academic/entities/establishment.entity';
import { Formation } from '../academic/entities/formation.entity';
import { Session } from '../academic/entities/session.entity';
export declare class SeederService implements OnApplicationBootstrap {
    private userRepository;
    private establishmentRepository;
    private formationRepository;
    private sessionRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>, establishmentRepository: Repository<Establishment>, formationRepository: Repository<Formation>, sessionRepository: Repository<Session>);
    onApplicationBootstrap(): Promise<void>;
    private seedUsers;
    private seedAcademicData;
    private createEstablishmentWithFormations;
}
