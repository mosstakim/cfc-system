import { User } from '../../users/entities/user.entity';
import { Session } from '../../academic/entities/session.entity';
import { Dossier } from './dossier.entity';
export declare enum RegistrationStatus {
    PENDING = "PENDING",
    VALIDATED = "VALIDATED",
    REJECTED = "REJECTED"
}
export declare class Registration {
    id: string;
    status: RegistrationStatus;
    adminComment: string;
    registrationDate: Date;
    updatedAt: Date;
    candidate: User;
    session: Session;
    dossier: Dossier;
}
