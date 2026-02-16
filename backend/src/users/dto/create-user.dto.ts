import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
}
