import { UserRole } from '../enums/user-role.enum';
import { Establishment } from '../../academic/entities/establishment.entity';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    establishment: Establishment;
}
