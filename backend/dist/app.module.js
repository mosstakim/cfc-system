"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const academic_module_1 = require("./academic/academic.module");
const registration_module_1 = require("./registration/registration.module");
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const seeder_service_1 = require("./database/seeder.service");
const user_entity_1 = require("./users/entities/user.entity");
const establishment_entity_1 = require("./academic/entities/establishment.entity");
const formation_entity_1 = require("./academic/entities/formation.entity");
const session_entity_1 = require("./academic/entities/session.entity");
const registration_entity_1 = require("./registration/entities/registration.entity");
const dossier_entity_1 = require("./registration/entities/dossier.entity");
const schedule_1 = require("@nestjs/schedule");
const tasks_module_1 = require("./tasks/tasks.module");
const reporting_module_1 = require("./reporting/reporting.module");
const dossier_module_1 = require("./dossier/dossier.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DATABASE_HOST || 'db',
                port: parseInt(process.env.DATABASE_PORT || '5432', 10),
                username: process.env.DATABASE_USER || 'cfc_user',
                password: process.env.DATABASE_PASSWORD || 'cfc_password',
                database: process.env.DATABASE_NAME || 'cfc_db',
                autoLoadEntities: true,
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, establishment_entity_1.Establishment, formation_entity_1.Formation, session_entity_1.Session, registration_entity_1.Registration, dossier_entity_1.Dossier]),
            users_module_1.UsersModule,
            academic_module_1.AcademicModule,
            registration_module_1.RegistrationModule,
            auth_module_1.AuthModule,
            dossier_module_1.DossierModule,
            tasks_module_1.TasksModule,
            reporting_module_1.ReportingModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, seeder_service_1.SeederService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map