import { AcademicService } from './academic.service';
import { CreateFormationDto } from './dto/create-formation.dto';
import { UpdateFormationDto } from './dto/update-formation.dto';
export declare class FormationsController {
    private readonly academicService;
    constructor(academicService: AcademicService);
    create(createFormationDto: CreateFormationDto): Promise<import("./entities/formation.entity").Formation>;
    findAll(): Promise<import("./entities/formation.entity").Formation[]>;
    update(id: string, updateFormationDto: UpdateFormationDto): Promise<import("./entities/formation.entity").Formation>;
    remove(id: string): Promise<import("./entities/formation.entity").Formation>;
}
