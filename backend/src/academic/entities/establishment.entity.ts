import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Formation } from './formation.entity';
import { Exclude } from 'class-transformer';
import { User } from '../../users/entities/user.entity';

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

    @Exclude()
    @OneToMany(() => User, (user) => user.establishment)
    admins: User[];
}
