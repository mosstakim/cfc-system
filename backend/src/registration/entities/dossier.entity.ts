import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Registration } from './registration.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Dossier {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // JSON column to store list of documents (e.g. { "cv": "path/to/cv.pdf", "diploma": "..." })
    @Column({ type: 'json', nullable: true })
    documents: Record<string, string>;

    @Column({ default: false })
    isComplete: boolean;

    @Exclude()
    @OneToOne(() => Registration, (registration) => registration.dossier, { onDelete: 'CASCADE' })
    @JoinColumn()
    registration: Registration;
}
