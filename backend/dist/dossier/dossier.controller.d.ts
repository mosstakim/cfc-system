import { DossierService } from './dossier.service';
export declare class DossierController {
    private readonly dossierService;
    constructor(dossierService: DossierService);
    uploadFile(id: string, file: any, type: string): Promise<import("../registration/entities/dossier.entity").Dossier>;
}
