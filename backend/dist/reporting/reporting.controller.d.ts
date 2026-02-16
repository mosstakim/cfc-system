import { ReportingService } from './reporting.service';
import type { Response } from 'express';
export declare class ReportingController {
    private readonly reportingService;
    constructor(reportingService: ReportingService);
    exportRegistrations(res: Response): Promise<void>;
}
