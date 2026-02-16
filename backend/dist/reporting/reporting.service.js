"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingService = void 0;
const common_1 = require("@nestjs/common");
const registration_service_1 = require("../registration/registration.service");
let ReportingService = class ReportingService {
    registrationService;
    constructor(registrationService) {
        this.registrationService = registrationService;
    }
    async exportRegistrationsToCsv() {
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
            const formatDate = (date) => {
                if (!date)
                    return '';
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
};
exports.ReportingService = ReportingService;
exports.ReportingService = ReportingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [registration_service_1.RegistrationService])
], ReportingService);
//# sourceMappingURL=reporting.service.js.map