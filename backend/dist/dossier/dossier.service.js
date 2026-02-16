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
exports.DossierService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dossier_entity_1 = require("../registration/entities/dossier.entity");
let DossierService = class DossierService {
    dossierRepository;
    constructor(dossierRepository) {
        this.dossierRepository = dossierRepository;
    }
    async updateDocuments(id, fileKey, filePath) {
        const dossier = await this.dossierRepository.findOneBy({ id });
        if (!dossier) {
            throw new common_1.NotFoundException(`Dossier with ID ${id} not found`);
        }
        if (!dossier.documents) {
            dossier.documents = {};
        }
        dossier.documents[fileKey] = filePath;
        const required = ['cv', 'diploma', 'idCard'];
        const uploaded = Object.keys(dossier.documents);
        dossier.isComplete = required.every(req => uploaded.includes(req));
        return this.dossierRepository.save(dossier);
    }
};
exports.DossierService = DossierService;
exports.DossierService = DossierService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dossier_entity_1.Dossier)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DossierService);
//# sourceMappingURL=dossier.service.js.map