import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
export declare class RegistrationController {
    private readonly registrationService;
    constructor(registrationService: RegistrationService);
    create(createRegistrationDto: CreateRegistrationDto): Promise<import("./entities/registration.entity").Registration>;
    findAll(): Promise<import("./entities/registration.entity").Registration[]>;
    findMyRegistration(req: any): Promise<import("./entities/registration.entity").Registration | null>;
    findOne(id: string): Promise<import("./entities/registration.entity").Registration>;
    update(id: string, updateRegistrationDto: UpdateRegistrationDto): Promise<import("./entities/registration.entity").Registration>;
    remove(id: string): Promise<{
        deleted: boolean;
        candidateDeleted: boolean;
    }>;
    sendEmail(id: string, type: 'confirmation' | 'validation'): Promise<{
        sent: boolean;
        type: "confirmation" | "validation";
    }>;
    sendBulkEmail(body: {
        ids: string[];
        type: 'confirmation' | 'validation';
    }): Promise<any[]>;
}
