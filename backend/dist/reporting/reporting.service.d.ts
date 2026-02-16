import { RegistrationService } from '../registration/registration.service';
export declare class ReportingService {
    private readonly registrationService;
    constructor(registrationService: RegistrationService);
    exportRegistrationsToCsv(): Promise<string>;
}
