import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Session } from '../../academic/entities/session.entity';
import { Dossier } from './dossier.entity';

export enum RegistrationStatus {
    PENDING = 'PENDING',
    VALIDATED = 'VALIDATED',
    REJECTED = 'REJECTED',
}

@Entity()
export class Registration {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: RegistrationStatus,
        default: RegistrationStatus.PENDING,
    })
    status: RegistrationStatus;

    @Column({ nullable: true })
    adminComment: string;

    @CreateDateColumn()
    registrationDate: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' }) // eager=true to load Candidate details
    candidate: User;

    @ManyToOne(() => Session, { eager: true })
    session: Session;

    @OneToOne(() => Dossier, (dossier) => dossier.registration, { cascade: true })
    dossier: Dossier;
}
