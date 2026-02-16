"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const academic_service_1 = require("./academic.service");
const academic_controller_1 = require("./academic.controller");
const formations_controller_1 = require("./formations.controller");
const establishment_entity_1 = require("./entities/establishment.entity");
const formation_entity_1 = require("./entities/formation.entity");
const session_entity_1 = require("./entities/session.entity");
let AcademicModule = class AcademicModule {
};
exports.AcademicModule = AcademicModule;
exports.AcademicModule = AcademicModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([establishment_entity_1.Establishment, formation_entity_1.Formation, session_entity_1.Session])],
        controllers: [academic_controller_1.AcademicController, formations_controller_1.FormationsController],
        providers: [academic_service_1.AcademicService],
    })
], AcademicModule);
//# sourceMappingURL=academic.module.js.map