import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('reporting')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportingController {
    constructor(private readonly reportingService: ReportingService) { }

    @Get('registrations/export')
    @Roles(UserRole.SUPER_ADMIN, UserRole.COORDINATOR)
    async exportRegistrations(@Res() res: Response) {
        const csv = await this.reportingService.exportRegistrationsToCsv();

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename="registrations.csv"');
        res.send(csv);
    }
}
