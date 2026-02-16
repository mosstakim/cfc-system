import { Formation } from './formation.entity';
import { User } from '../../users/entities/user.entity';
export declare class Establishment {
    id: string;
    name: string;
    address: string;
    website: string;
    formations: Formation[];
    admins: User[];
}
