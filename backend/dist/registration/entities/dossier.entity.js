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
exports.Dossier = void 0;
const typeorm_1 = require("typeorm");
const registration_entity_1 = require("./registration.entity");
const class_transformer_1 = require("class-transformer");
let Dossier = class Dossier {
    id;
    documents;
    isComplete;
    registration;
};
exports.Dossier = Dossier;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Dossier.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Dossier.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Dossier.prototype, "isComplete", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.OneToOne)(() => registration_entity_1.Registration, (registration) => registration.dossier, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", registration_entity_1.Registration)
], Dossier.prototype, "registration", void 0);
exports.Dossier = Dossier = __decorate([
    (0, typeorm_1.Entity)()
], Dossier);
//# sourceMappingURL=dossier.entity.js.map