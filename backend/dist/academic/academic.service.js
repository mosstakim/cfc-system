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
exports.AcademicService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const establishment_entity_1 = require("./entities/establishment.entity");
const formation_entity_1 = require("./entities/formation.entity");
const session_entity_1 = require("./entities/session.entity");
let AcademicService = class AcademicService {
    establishmentRepository;
    formationRepository;
    sessionRepository;
    constructor(establishmentRepository, formationRepository, sessionRepository) {
        this.establishmentRepository = establishmentRepository;
        this.formationRepository = formationRepository;
        this.sessionRepository = sessionRepository;
    }
    findAllSessions() {
        return this.sessionRepository.find({ relations: ['formation'] });
    }
    create(createAcademicDto) {
        return 'This action adds a new academic';
    }
    async findAll() {
        return {
            establishments: await this.establishmentRepository.find({ relations: ['formations'] }),
            formations: await this.formationRepository.find({ relations: ['sessions'] }),
            sessions: await this.sessionRepository.find(),
        };
    }
    findOne(id) {
        return `This action returns a #${id} academic`;
    }
    update(id, updateAcademicDto) {
        return `This action updates a #${id} academic`;
    }
    async updateSession(id, updateSessionDto) {
        const session = await this.sessionRepository.findOneBy({ id });
        if (!session) {
            throw new Error('Session not found');
        }
        if (updateSessionDto.name)
            session.name = updateSessionDto.name;
        if (updateSessionDto.startDate)
            session.startDate = new Date(updateSessionDto.startDate);
        if (updateSessionDto.endDate)
            session.endDate = new Date(updateSessionDto.endDate);
        if (updateSessionDto.isOpen !== undefined)
            session.isOpen = updateSessionDto.isOpen;
        return this.sessionRepository.save(session);
    }
    async createFormation(createFormationDto) {
        const { establishmentId, ...formationData } = createFormationDto;
        const establishment = await this.establishmentRepository.findOneBy({ id: establishmentId });
        if (!establishment) {
            throw new Error('Establishment not found');
        }
        const formation = this.formationRepository.create({
            ...formationData,
            establishment,
        });
        return this.formationRepository.save(formation);
    }
    async updateFormation(id, updateFormationDto) {
        const formation = await this.formationRepository.findOneBy({ id });
        if (!formation) {
            throw new Error('Formation not found');
        }
        const { establishmentId, ...updateData } = updateFormationDto;
        if (establishmentId) {
            const establishment = await this.establishmentRepository.findOneBy({ id: establishmentId });
            if (!establishment) {
                throw new Error('Establishment not found');
            }
            formation.establishment = establishment;
        }
        Object.assign(formation, updateData);
        return this.formationRepository.save(formation);
    }
    async removeFormation(id) {
        const formation = await this.formationRepository.findOneBy({ id });
        if (!formation) {
            throw new Error('Formation not found');
        }
        return this.formationRepository.remove(formation);
    }
    remove(id) {
        return `This action removes a #${id} academic`;
    }
};
exports.AcademicService = AcademicService;
exports.AcademicService = AcademicService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(establishment_entity_1.Establishment)),
    __param(1, (0, typeorm_1.InjectRepository)(formation_entity_1.Formation)),
    __param(2, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AcademicService);
//# sourceMappingURL=academic.service.js.map