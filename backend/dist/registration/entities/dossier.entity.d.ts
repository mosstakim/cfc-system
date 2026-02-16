import { Registration } from './registration.entity';
export declare class Dossier {
    id: string;
    documents: Record<string, string>;
    isComplete: boolean;
    registration: Registration;
}
