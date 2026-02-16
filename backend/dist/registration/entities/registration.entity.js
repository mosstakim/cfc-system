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
exports.Registration = exports.RegistrationStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const session_entity_1 = require("../../academic/entities/session.entity");
const dossier_entity_1 = require("./dossier.entity");
var RegistrationStatus;
(function (RegistrationStatus) {
    RegistrationStatus["PENDING"] = "PENDING";
    RegistrationStatus["VALIDATED"] = "VALIDATED";
    RegistrationStatus["REJECTED"] = "REJECTED";
})(RegistrationStatus || (exports.RegistrationStatus = RegistrationStatus = {}));
let Registration = class Registration {
    id;
    status;
    adminComment;
    registrationDate;
    updatedAt;
    candidate;
    session;
    dossier;
};
exports.Registration = Registration;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Registration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RegistrationStatus,
        default: RegistrationStatus.PENDING,
    }),
    __metadata("design:type", String)
], Registration.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Registration.prototype, "adminComment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Registration.prototype, "registrationDate", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Registration.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Registration.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => session_entity_1.Session, { eager: true }),
    __metadata("design:type", session_entity_1.Session)
], Registration.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => dossier_entity_1.Dossier, (dossier) => dossier.registration, { cascade: true }),
    __metadata("design:type", dossier_entity_1.Dossier)
], Registration.prototype, "dossier", void 0);
exports.Registration = Registration = __decorate([
    (0, typeorm_1.Entity)()
], Registration);
//# sourceMappingURL=registration.entity.js.map