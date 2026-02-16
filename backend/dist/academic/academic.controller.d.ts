import { AcademicService } from './academic.service';
import { CreateAcademicDto } from './dto/create-academic.dto';
import { UpdateAcademicDto } from './dto/update-academic.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
export declare class AcademicController {
    private readonly academicService;
    constructor(academicService: AcademicService);
    create(createAcademicDto: CreateAcademicDto): string;
    findAll(): Promise<{
        establishments: import("./entities/establishment.entity").Establishment[];
        formations: import("./entities/formation.entity").Formation[];
        sessions: import("./entities/session.entity").Session[];
    }>;
    findAllSessions(): Promise<import("./entities/session.entity").Session[]>;
    updateSession(id: string, updateSessionDto: UpdateSessionDto): Promise<import("./entities/session.entity").Session>;
    findOne(id: string): string;
    update(id: string, updateAcademicDto: UpdateAcademicDto): string;
    remove(id: string): string;
}
