import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Formation } from './formation.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Establishment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    website: string;

    @Exclude()
    @OneToMany(() => Formation, (formation) => formation.establishment)
    formations: Formation[];
}
