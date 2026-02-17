import { Formation } from './formation.entity';
export declare class Session {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isOpen: boolean;
    formationId: string;
    formation: Formation;
}
