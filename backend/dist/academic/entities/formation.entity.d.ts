import { Establishment } from './establishment.entity';
import { Session } from './session.entity';
export declare class Formation {
    id: string;
    title: string;
    description: string;
    tuitionFees: number;
    duration: string;
    isPublished: boolean;
    establishment: Establishment;
    sessions: Session[];
}
