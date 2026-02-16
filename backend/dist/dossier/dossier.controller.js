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
exports.DossierController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const dossier_service_1 = require("./dossier.service");
let DossierController = class DossierController {
    dossierService;
    constructor(dossierService) {
        this.dossierService = dossierService;
    }
    async uploadFile(id, file, type) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        if (!type) {
            throw new common_1.BadRequestException('Document type is required (cv, diploma, idCard)');
        }
        const allowedTypes = ['cv', 'diploma', 'idCard'];
        if (!allowedTypes.includes(type)) {
            throw new common_1.BadRequestException('Invalid document type');
        }
        return this.dossierService.updateDocuments(id, type, file.filename);
    }
};
exports.DossierController = DossierController;
__decorate([
    (0, common_1.Post)(':id/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], DossierController.prototype, "uploadFile", null);
exports.DossierController = DossierController = __decorate([
    (0, common_1.Controller)('dossier'),
    __metadata("design:paramtypes", [dossier_service_1.DossierService])
], DossierController);
//# sourceMappingURL=dossier.controller.js.map