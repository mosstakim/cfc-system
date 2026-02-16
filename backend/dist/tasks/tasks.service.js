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
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_entity_1 = require("../academic/entities/session.entity");
let TasksService = TasksService_1 = class TasksService {
    sessionRepository;
    logger = new common_1.Logger(TasksService_1.name);
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    async handleCron() {
        this.logger.debug('Running daily session check...');
        const today = new Date();
        const openSessions = await this.sessionRepository.find({
            where: {
                isOpen: true,
                startDate: (0, typeorm_2.LessThan)(today),
            },
        });
        if (openSessions.length > 0) {
            this.logger.debug(`Found ${openSessions.length} sessions to close.`);
            for (const session of openSessions) {
                session.isOpen = false;
                await this.sessionRepository.save(session);
                this.logger.debug(`Closed session: ${session.name} (ID: ${session.id})`);
            }
        }
        else {
            this.logger.debug('No sessions to close.');
        }
    }
};
exports.TasksService = TasksService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "handleCron", null);
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map