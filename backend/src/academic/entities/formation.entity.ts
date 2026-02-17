import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Establishment } from './establishment.entity';
import { Session } from './session.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Formation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    tuitionFees: number;

    @Column({ nullable: true })
    duration: string;

    @Column({ default: false })
    isPublished: boolean;

    @Column({ nullable: true })
    establishmentId: string;

    @Exclude()
    @ManyToOne(() => Establishment, (establishment) => establishment.formations)
    establishment: Establishment;

    @OneToMany(() => Session, (session) => session.formation)
    sessions: Session[];
}
