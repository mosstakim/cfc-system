"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SeederService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const bcrypt = __importStar(require("bcrypt"));
const establishment_entity_1 = require("../academic/entities/establishment.entity");
const formation_entity_1 = require("../academic/entities/formation.entity");
const session_entity_1 = require("../academic/entities/session.entity");
const registration_entity_1 = require("../registration/entities/registration.entity");
const dossier_entity_1 = require("../registration/entities/dossier.entity");
const registration_entity_2 = require("../registration/entities/registration.entity");
let SeederService = SeederService_1 = class SeederService {
    userRepository;
    establishmentRepository;
    formationRepository;
    sessionRepository;
    registrationRepository;
    dossierRepository;
    logger = new common_1.Logger(SeederService_1.name);
    constructor(userRepository, establishmentRepository, formationRepository, sessionRepository, registrationRepository, dossierRepository) {
        this.userRepository = userRepository;
        this.establishmentRepository = establishmentRepository;
        this.formationRepository = formationRepository;
        this.sessionRepository = sessionRepository;
        this.registrationRepository = registrationRepository;
        this.dossierRepository = dossierRepository;
        this.logger.log('SeederService initialized');
    }
    async onApplicationBootstrap() {
        this.logger.log('Initializing database seeding...');
        await this.seedAcademicData();
        await this.seedUsers();
        this.logger.log('Database seeding completed.');
    }
    async seedUsers() {
        const adminEmail = 'admin@cfc.usms.ac.ma';
        if (!await this.userRepository.findOneBy({ email: adminEmail })) {
            this.logger.log('Creating super admin user...');
            const passwordHash = await bcrypt.hash('admin123', 10);
            const admin = this.userRepository.create({
                email: adminEmail,
                passwordHash,
                firstName: 'Super',
                lastName: 'Admin',
                role: user_role_enum_1.UserRole.SUPER_ADMIN,
                isActive: true,
            });
            await this.userRepository.save(admin);
        }
        const etabAdminEmail = 'fst.admin@cfc.usms.ac.ma';
        if (!await this.userRepository.findOneBy({ email: etabAdminEmail })) {
            const fst = await this.establishmentRepository.findOneBy({ name: 'FST Béni Mellal' });
            this.logger.log('Creating establishment admin user...');
            const passwordHash = await bcrypt.hash('fst123', 10);
            const etabAdmin = this.userRepository.create({
                email: etabAdminEmail,
                passwordHash,
                firstName: 'Admin',
                lastName: 'FST',
                role: user_role_enum_1.UserRole.ADMIN_ETABLISSEMENT,
                establishment: fst || undefined,
                isActive: true,
            });
            await this.userRepository.save(etabAdmin);
        }
        const coordinatorEmail = 'coord.mst@cfc.usms.ac.ma';
        if (!await this.userRepository.findOneBy({ email: coordinatorEmail })) {
            this.logger.log('Creating coordinator user...');
            const passwordHash = await bcrypt.hash('coord123', 10);
            const coordinator = this.userRepository.create({
                email: coordinatorEmail,
                passwordHash,
                firstName: 'Coordinateur',
                lastName: 'MST',
                role: user_role_enum_1.UserRole.COORDINATOR,
                isActive: true,
            });
            await this.userRepository.save(coordinator);
        }
        const candidates = [
            { email: 'etudiant@test.com', first: 'Etudiant', last: 'Test' },
            { email: 'candidate1@test.com', first: 'Sara', last: 'Benali' },
            { email: 'candidate2@test.com', first: 'Omar', last: 'Idrissi' }
        ];
        for (const c of candidates) {
            if (!await this.userRepository.findOneBy({ email: c.email })) {
                this.logger.log(`Creating candidate user ${c.email}...`);
                const passwordHash = await bcrypt.hash('student123', 10);
                const student = this.userRepository.create({
                    email: c.email,
                    passwordHash,
                    firstName: c.first,
                    lastName: c.last,
                    role: user_role_enum_1.UserRole.CANDIDATE,
                    isActive: true,
                });
                await this.userRepository.save(student);
            }
        }
        const testStudent = await this.userRepository.findOneBy({ email: 'etudiant@test.com' });
        if (testStudent) {
            const existingReg = await this.registrationRepository.findOneBy({ candidate: { id: testStudent.id } });
            if (!existingReg) {
                const formation = await this.formationRepository.findOneBy({ title: 'Master Ingénierie Topographique et Géomatique Appliquée (ITGA)' });
                if (formation) {
                    const session = await this.sessionRepository.findOne({ where: { formation: { id: formation.id } } });
                    if (session) {
                        this.logger.log('Creating test registration for etudiant@test.com...');
                        const registration = this.registrationRepository.create({
                            candidate: testStudent,
                            session: session,
                            status: registration_entity_2.RegistrationStatus.PENDING,
                            registrationDate: new Date()
                        });
                        const savedReg = await this.registrationRepository.save(registration);
                        const dossier = this.dossierRepository.create({
                            registration: savedReg,
                            isComplete: false,
                            documents: {}
                        });
                        await this.dossierRepository.save(dossier);
                    }
                }
            }
        }
    }
    async seedAcademicData() {
        this.logger.log('Seeding comprehensive USMS academic data...');
        await this.createEstablishmentWithFormations('FST Béni Mellal', 'Campus Mghila, BP 523, Béni Mellal', 'https://fstbm.ac.ma', [
            { title: 'Master Ingénierie Topographique et Géomatique Appliquée (ITGA)', description: 'Formation spécialisée en sciences géomatiques et topographie.' },
            { title: 'Licence Systèmes d\'Information d\'Entreprise (SIE)', description: 'Formation en développement et gestion des systèmes d\'information.' },
            { title: 'Licence Conduite des Travaux en BTP', description: 'Formation pour les chefs de chantier et conducteurs de travaux.' },
            { title: 'Master Géosciences et Ressources Naturelles', description: 'Gestion et valorisation des ressources minières et hydriques.' },
            { title: 'Licence Analyses Biologiques et Qualité', description: 'Contrôle qualité dans les industries agroalimentaires et pharmaceutiques.' }
        ]);
        await this.createEstablishmentWithFormations('ENCG Béni Mellal', 'Campus Mghila, BP 591, Béni Mellal', 'https://encgbm.ac.ma', [
            { title: 'Licence Management des Organisations et Entrepreneuriat (MOE)', description: 'Formation pour les futurs managers et entrepreneurs.' },
            { title: 'Licence Comptabilité, Finance et Audit (CFA)', description: 'Formation approfondie en finance d\'entreprise et audit.' },
            { title: 'Master Ingénierie Financière et Fiscale (IFF)', description: 'Expertise en ingénierie financière et fiscalité.' },
            { title: 'Master Marketing Digital et E-Business', description: 'Stratégies marketing à l\'ère du numérique.' },
            { title: 'Licence Gestion des Ressources Humaines', description: 'Administration et développement du capital humain.' }
        ]);
        await this.createEstablishmentWithFormations('EST Béni Mellal', 'Campus Mghila, BP 591, Béni Mellal', 'https://estbm.ac.ma', [
            { title: 'Licence Génie Civil', description: 'Formation technique en construction et génie civil.' },
            { title: 'Licence Génie Mécatronique et Industrie 4.0', description: 'Formation en robotique, électronique et systèmes industriels.' },
            { title: 'Licence Maintenance des Systèmes Energétiques', description: 'Maintenance et efficacité énergétique.' },
            { title: 'Licence Agro-industrie', description: 'Technologies de transformation et valorisation des produits agricoles.' }
        ]);
        await this.createEstablishmentWithFormations('FLSH Béni Mellal', 'Route de Marrakech, BP 524, Béni Mellal', 'https://flshbm.ac.ma', [
            { title: 'Licence Education et Enseignement', description: 'Formation aux métiers de l\'éducation et de la formation.' },
            { title: 'Master Géographie et Aménagement', description: 'Aménagement du territoire et gestion de l\'espace.' },
            { title: 'Licence Langues Etrangères Appliquées', description: 'Maîtrise des langues pour le commerce et la communication internationale.' }
        ]);
        await this.createEstablishmentWithFormations('FP Béni Mellal', 'Campus Mghila, BP 592, Béni Mellal', 'https://fp.usms.ac.ma', [
            { title: 'Licence Economie et Gestion', description: 'Fondamentaux de l\'économie et de la gestion d\'entreprise.' },
            { title: 'Licence Droit Privé en Français', description: 'Formation juridique pour les carrières dans le droit des affaires.' }
        ]);
        this.logger.log('Academic data seeding completed with comprehensive USMS data.');
    }
    async createEstablishmentWithFormations(name, address, website, formations) {
        let establishment = await this.establishmentRepository.findOneBy({ name });
        if (!establishment) {
            this.logger.log(`Creating establishment: ${name}`);
            establishment = this.establishmentRepository.create({ name, address, website });
            establishment = await this.establishmentRepository.save(establishment);
        }
        for (const fmt of formations) {
            let formation = await this.formationRepository.findOne({
                where: { title: fmt.title, establishment: { id: establishment.id } }
            });
            if (!formation) {
                const fees = Math.floor(Math.random() * (45000 - 20000 + 1) + 20000);
                formation = this.formationRepository.create({
                    title: fmt.title,
                    description: fmt.description,
                    tuitionFees: fees,
                    isPublished: true,
                    establishment: establishment
                });
                await this.formationRepository.save(formation);
            }
            const sessionName = 'Promotion 2026/2027';
            const sessionExists = await this.sessionRepository.findOne({
                where: { name: sessionName, formation: { id: formation.id } }
            });
            if (!sessionExists) {
                const startDate = new Date('2026-09-15');
                const endDate = new Date('2027-06-30');
                const session = this.sessionRepository.create({
                    name: sessionName,
                    startDate,
                    endDate,
                    isOpen: true,
                    formation: formation
                });
                await this.sessionRepository.save(session);
            }
        }
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = SeederService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(establishment_entity_1.Establishment)),
    __param(2, (0, typeorm_1.InjectRepository)(formation_entity_1.Formation)),
    __param(3, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __param(4, (0, typeorm_1.InjectRepository)(registration_entity_1.Registration)),
    __param(5, (0, typeorm_1.InjectRepository)(dossier_entity_1.Dossier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeederService);
//# sourceMappingURL=seeder.service.js.map