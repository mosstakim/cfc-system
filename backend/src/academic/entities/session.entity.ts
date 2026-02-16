import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Formation } from './formation.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Session {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string; // e.g. "Session 2026/2027"

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date' })
    endDate: Date;

    @Column({ default: true })
    isOpen: boolean;

    @Exclude()
    @ManyToOne(() => Formation, (formation) => formation.sessions)
    formation: Formation;
}
