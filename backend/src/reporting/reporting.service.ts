import { Injectable } from '@nestjs/common';
import { RegistrationService } from '../registration/registration.service';

@Injectable()
export class ReportingService {
    constructor(private readonly registrationService: RegistrationService) { }

    async exportRegistrationsToCsv(): Promise<string> {
        const registrations = await this.registrationService.findAll();

        const headers = [
            'ID',
            'Date',
            'Statut',
            'Nom',
            'Prenom',
            'Email',
            'Formation',
            'Session',
            'Date_Debut',
            'Date_Fin',
            'Dossier_Complet',
            'Docs_Fournis'
        ];

        const csvRows = [headers.join(',')];

        for (const reg of registrations) {
            // Helper to format date safely
            const formatDate = (date: Date | string | undefined) => {
                if (!date) return '';
                const d = new Date(date);
                return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
            };

            const data = [
                reg.id,
                formatDate(reg.registrationDate),
                reg.status,
                reg.candidate?.lastName || '',
                reg.candidate?.firstName || '',
                reg.candidate?.email || '',
                reg.session?.formation?.title || 'N/A',
                reg.session?.name || '',
                formatDate(reg.session?.startDate),
                formatDate(reg.session?.endDate),
                reg.dossier?.isComplete ? 'Oui' : 'Non',
                reg.dossier?.documents ? Object.keys(reg.dossier.documents).join(', ') : ''
            ];

            // Helper to escape CSV fields
            const escapedData = data.map(field => {
                const stringField = String(field);
                if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                    return `"${stringField.replace(/"/g, '""')}"`;
                }
                return stringField;
            });

            csvRows.push(escapedData.join(','));
        }

        return csvRows.join('\n');
    }
}
