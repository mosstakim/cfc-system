import { Repository } from 'typeorm';
import { Dossier } from '../registration/entities/dossier.entity';
export declare class DossierService {
    private dossierRepository;
    constructor(dossierRepository: Repository<Dossier>);
    updateDocuments(id: string, fileKey: string, filePath: string): Promise<Dossier>;
}
