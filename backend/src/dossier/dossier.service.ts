import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dossier } from '../registration/entities/dossier.entity';

@Injectable()
export class DossierService {
    constructor(
        @InjectRepository(Dossier)
        private dossierRepository: Repository<Dossier>,
    ) { }

    async updateDocuments(id: string, fileKey: string, filePath: string) {
        const dossier = await this.dossierRepository.findOneBy({ id });
        if (!dossier) {
            throw new NotFoundException(`Dossier with ID ${id} not found`);
        }

        // Ensure documents object exists
        if (!dossier.documents) {
            dossier.documents = {};
        }

        dossier.documents[fileKey] = filePath;

        // Check if dossier is complete (simple check: requires cv, diploma, id)
        const required = ['cv', 'diploma', 'idCard'];
        const uploaded = Object.keys(dossier.documents);
        dossier.isComplete = required.every(req => uploaded.includes(req));

        return this.dossierRepository.save(dossier);
    }
}
