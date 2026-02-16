import { Repository } from 'typeorm';
import { CreateAcademicDto } from './dto/create-academic.dto';
import { UpdateAcademicDto } from './dto/update-academic.dto';
import { Establishment } from './entities/establishment.entity';
import { Formation } from './entities/formation.entity';
import { Session } from './entities/session.entity';
import { UpdateSessionDto } from './dto/update-session.dto';
import { CreateFormationDto } from './dto/create-formation.dto';
import { UpdateFormationDto } from './dto/update-formation.dto';
export declare class AcademicService {
    private establishmentRepository;
    private formationRepository;
    private sessionRepository;
    constructor(establishmentRepository: Repository<Establishment>, formationRepository: Repository<Formation>, sessionRepository: Repository<Session>);
    findAllSessions(): Promise<Session[]>;
    create(createAcademicDto: CreateAcademicDto): string;
    findAll(): Promise<{
        establishments: Establishment[];
        formations: Formation[];
        sessions: Session[];
    }>;
    findOne(id: number): string;
    update(id: number, updateAcademicDto: UpdateAcademicDto): string;
    updateSession(id: string, updateSessionDto: UpdateSessionDto): Promise<Session>;
    createFormation(createFormationDto: CreateFormationDto): Promise<Formation>;
    updateFormation(id: string, updateFormationDto: UpdateFormationDto): Promise<Formation>;
    removeFormation(id: string): Promise<Formation>;
    remove(id: number): string;
}
