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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const registration_entity_1 = require("./entities/registration.entity");
const dossier_entity_1 = require("./entities/dossier.entity");
const user_entity_1 = require("../users/entities/user.entity");
const session_entity_1 = require("../academic/entities/session.entity");
const mail_service_1 = require("../mail/mail.service");
const user_role_enum_1 = require("../users/enums/user-role.enum");
let RegistrationService = class RegistrationService {
    registrationRepository;
    dossierRepository;
    userRepository;
    sessionRepository;
    mailService;
    constructor(registrationRepository, dossierRepository, userRepository, sessionRepository, mailService) {
        this.registrationRepository = registrationRepository;
        this.dossierRepository = dossierRepository;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.mailService = mailService;
    }
    async create(createRegistrationDto) {
        const { candidateId, sessionId } = createRegistrationDto;
        const candidate = await this.userRepository.findOneBy({ id: candidateId });
        if (!candidate) {
            throw new common_1.NotFoundException(`Candidat avec l'ID ${candidateId} introuvable`);
        }
        const session = await this.sessionRepository.findOneBy({ id: sessionId });
        if (!session) {
            throw new common_1.NotFoundException(`Session avec l'ID ${sessionId} introuvable`);
        }
        if (!session.isOpen) {
            throw new common_1.BadRequestException('La session est fermée aux inscriptions');
        }
        const existing = await this.registrationRepository.findOne({
            where: { candidate: { id: candidateId }, session: { id: sessionId } }
        });
        if (existing) {
            throw new common_1.BadRequestException('Le candidat est déjà inscrit à cette session');
        }
        const dossier = this.dossierRepository.create({
            isComplete: false,
            documents: {},
        });
        const registration = this.registrationRepository.create({
            candidate,
            session,
            dossier,
            status: registration_entity_1.RegistrationStatus.PENDING,
        });
        return this.registrationRepository.save(registration);
    }
    findAll() {
        return this.registrationRepository.find({
            relations: ['candidate', 'session', 'session.formation', 'dossier']
        });
    }
    findByCandidate(candidateId) {
        return this.registrationRepository.findOne({
            where: { candidate: { id: candidateId } },
            relations: ['candidate', 'session', 'dossier']
        });
    }
    async findOne(id) {
        const reg = await this.registrationRepository.findOne({
            where: { id },
            relations: ['candidate', 'session', 'dossier']
        });
        if (!reg)
            throw new common_1.NotFoundException(`Inscription ${id} introuvable`);
        return reg;
    }
    async update(id, updateRegistrationDto) {
        const registration = await this.findOne(id);
        if (updateRegistrationDto.status) {
            registration.status = updateRegistrationDto.status;
        }
        return this.registrationRepository.save(registration);
    }
    async sendEmail(id, type) {
        const registration = await this.findOne(id);
        if (type === 'confirmation') {
            await this.mailService.sendRegistrationConfirmation(registration.candidate);
        }
        else if (type === 'validation') {
            if (registration.status !== registration_entity_1.RegistrationStatus.VALIDATED) {
                throw new common_1.BadRequestException("Ne peut envoyer l'email de validation que si l'inscription est validée.");
            }
            await this.mailService.sendAccountValidation(registration.candidate);
        }
        return { sent: true, type };
    }
    async sendBulkEmail(ids, type) {
        const results = [];
        for (const id of ids) {
            try {
                await this.sendEmail(id, type);
                results.push({ id, status: 'sent' });
            }
            catch (error) {
                results.push({ id, status: 'failed', error: error.message });
            }
        }
        return results;
    }
    async remove(id) {
        const registration = await this.findOne(id);
        const candidateId = registration.candidate.id;
        const candidateRole = registration.candidate.role;
        await this.registrationRepository.remove(registration);
        if (candidateRole === user_role_enum_1.UserRole.CANDIDATE) {
            await this.userRepository.delete(candidateId);
        }
        return { deleted: true, candidateDeleted: candidateRole === user_role_enum_1.UserRole.CANDIDATE };
    }
};
exports.RegistrationService = RegistrationService;
exports.RegistrationService = RegistrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(registration_entity_1.Registration)),
    __param(1, (0, typeorm_1.InjectRepository)(dossier_entity_1.Dossier)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        mail_service_1.MailService])
], RegistrationService);
//# sourceMappingURL=registration.service.js.map