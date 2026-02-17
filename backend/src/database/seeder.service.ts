import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { Establishment } from '../academic/entities/establishment.entity';
import { Formation } from '../academic/entities/formation.entity';
import { Session } from '../academic/entities/session.entity';
import { Registration } from '../registration/entities/registration.entity';
import { Dossier } from '../registration/entities/dossier.entity';
import { RegistrationStatus } from '../registration/entities/registration.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SeederService.name);

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Establishment) private establishmentRepository: Repository<Establishment>,
        @InjectRepository(Formation) private formationRepository: Repository<Formation>,
        @InjectRepository(Session) private sessionRepository: Repository<Session>,
        @InjectRepository(Registration) private registrationRepository: Repository<Registration>,
        @InjectRepository(Dossier) private dossierRepository: Repository<Dossier>,
    ) {
        this.logger.log('SeederService initialized');
    }

    async onApplicationBootstrap() {
        this.logger.log('Initializing database seeding...');
        await this.seedAcademicData(); // Run first to create establishments
        await this.seedUsers(); // Run second to assign users to establishments
        this.logger.log('Database seeding completed.');
    }

    private async seedUsers() {
        // 1. Super Admin
        const adminEmail = 'admin@cfc.usms.ac.ma';
        if (!await this.userRepository.findOneBy({ email: adminEmail })) {
            this.logger.log('Creating super admin user...');
            const passwordHash = await bcrypt.hash('admin123', 10);
            const admin = this.userRepository.create({
                email: adminEmail,
                passwordHash,
                firstName: 'Super',
                lastName: 'Admin',
                role: UserRole.SUPER_ADMIN,
                isActive: true,
            });
            await this.userRepository.save(admin);
        }

        // 2. Admin Etablissement (FST)
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
                role: UserRole.ADMIN_ETABLISSEMENT,
                isActive: true,
            });
            await this.userRepository.save(etabAdmin);
        }

        // 3. Coordinator (MST)
        const coordinatorEmail = 'coord.mst@cfc.usms.ac.ma';
        if (!await this.userRepository.findOneBy({ email: coordinatorEmail })) {
            this.logger.log('Creating coordinator user...');
            const passwordHash = await bcrypt.hash('coord123', 10);
            const coordinator = this.userRepository.create({
                email: coordinatorEmail,
                passwordHash,
                firstName: 'Coordinateur',
                lastName: 'MST',
                role: UserRole.COORDINATOR,
                isActive: true,
            });
            await this.userRepository.save(coordinator);
        }

        // 4. Candidates (Test Accounts)
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
                    role: UserRole.CANDIDATE,
                    isActive: true,
                });
                await this.userRepository.save(student);
            }
        }

        // 5. Create Test Registration for 'etudiant@test.com'
        const testStudent = await this.userRepository.findOneBy({ email: 'etudiant@test.com' });
        if (testStudent) {
            const existingReg = await this.registrationRepository.findOneBy({ candidate: { id: testStudent.id } });
            if (!existingReg) {
                // Find a session (e.g., from FST - ITGA)
                const formation = await this.formationRepository.findOneBy({ title: 'Master Ingénierie Topographique et Géomatique Appliquée (ITGA)' });
                if (formation) {
                    const session = await this.sessionRepository.findOne({ where: { formation: { id: formation.id } } });
                    if (session) {
                        this.logger.log('Creating test registration for etudiant@test.com...');
                        const registration = this.registrationRepository.create({
                            candidate: testStudent,
                            session: session,
                            status: RegistrationStatus.PENDING,
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

    private async seedAcademicData() {
        this.logger.log('Seeding comprehensive USMS academic data...');

        // 1. FST Béni Mellal (Sciences & Techniques)
        await this.createEstablishmentWithFormations(
            'FST Béni Mellal',
            'Campus Mghila, BP 523, Béni Mellal',
            'https://fstbm.ac.ma',
            [
                { title: 'Master Ingénierie Topographique et Géomatique Appliquée (ITGA)', description: 'Formation spécialisée en sciences géomatiques et topographie.' },
                { title: 'Licence Systèmes d\'Information d\'Entreprise (SIE)', description: 'Formation en développement et gestion des systèmes d\'information.' },
                { title: 'Licence Conduite des Travaux en BTP', description: 'Formation pour les chefs de chantier et conducteurs de travaux.' },
                { title: 'Master Géosciences et Ressources Naturelles', description: 'Gestion et valorisation des ressources minières et hydriques.' },
                { title: 'Licence Analyses Biologiques et Qualité', description: 'Contrôle qualité dans les industries agroalimentaires et pharmaceutiques.' }
            ]
        );

        // 2. ENCG Béni Mellal (Commerce & Gestion)
        await this.createEstablishmentWithFormations(
            'ENCG Béni Mellal',
            'Campus Mghila, BP 591, Béni Mellal',
            'https://encgbm.ac.ma',
            [
                { title: 'Licence Management des Organisations et Entrepreneuriat (MOE)', description: 'Formation pour les futurs managers et entrepreneurs.' },
                { title: 'Licence Comptabilité, Finance et Audit (CFA)', description: 'Formation approfondie en finance d\'entreprise et audit.' },
                { title: 'Master Ingénierie Financière et Fiscale (IFF)', description: 'Expertise en ingénierie financière et fiscalité.' },
                { title: 'Master Marketing Digital et E-Business', description: 'Stratégies marketing à l\'ère du numérique.' },
                { title: 'Licence Gestion des Ressources Humaines', description: 'Administration et développement du capital humain.' }
            ]
        );

        // 3. EST Béni Mellal (Technologie)
        await this.createEstablishmentWithFormations(
            'EST Béni Mellal',
            'Campus Mghila, BP 591, Béni Mellal',
            'https://estbm.ac.ma',
            [
                { title: 'Licence Génie Civil', description: 'Formation technique en construction et génie civil.' },
                { title: 'Licence Génie Mécatronique et Industrie 4.0', description: 'Formation en robotique, électronique et systèmes industriels.' },
                { title: 'Licence Maintenance des Systèmes Energétiques', description: 'Maintenance et efficacité énergétique.' },
                { title: 'Licence Agro-industrie', description: 'Technologies de transformation et valorisation des produits agricoles.' }
            ]
        );

        // 4. FLSH Béni Mellal (Lettres & Sciences Humaines)
        await this.createEstablishmentWithFormations(
            'FLSH Béni Mellal',
            'Route de Marrakech, BP 524, Béni Mellal',
            'https://flshbm.ac.ma',
            [
                { title: 'Licence Education et Enseignement', description: 'Formation aux métiers de l\'éducation et de la formation.' },
                { title: 'Master Géographie et Aménagement', description: 'Aménagement du territoire et gestion de l\'espace.' },
                { title: 'Licence Langues Etrangères Appliquées', description: 'Maîtrise des langues pour le commerce et la communication internationale.' }
            ]
        );

        // 5. FP Béni Mellal (Polydisciplinaire)
        await this.createEstablishmentWithFormations(
            'FP Béni Mellal',
            'Campus Mghila, BP 592, Béni Mellal',
            'https://fp.usms.ac.ma',
            [
                { title: 'Licence Economie et Gestion', description: 'Fondamentaux de l\'économie et de la gestion d\'entreprise.' },
                { title: 'Licence Droit Privé en Français', description: 'Formation juridique pour les carrières dans le droit des affaires.' }
            ]
        );

        this.logger.log('Academic data seeding completed with comprehensive USMS data.');
    }

    private async createEstablishmentWithFormations(name: string, address: string, website: string, formations: { title: string, description: string }[]) {
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
                // Determine fees suitable for Moroccan context (in MAD)
                // Range generally between 20,000 MAD and 45,000 MAD for Continuing Education
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

            // Create a default session for 2026/2027
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
                    isOpen: true, // Open by default for demo
                    formation: formation
                });
                await this.sessionRepository.save(session);
            }


        }
    }
}
