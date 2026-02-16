import { Controller, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DossierService } from './dossier.service';
import { Express } from 'express';

@Controller('dossier')
export class DossierController {
    constructor(private readonly dossierService: DossierService) { }

    @Post(':id/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Param('id') id: string,
        @UploadedFile() file: any,
        @Body('type') type: string
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        if (!type) {
            throw new BadRequestException('Document type is required (cv, diploma, idCard)');
        }

        // Valid types
        const allowedTypes = ['cv', 'diploma', 'idCard'];
        if (!allowedTypes.includes(type)) {
            throw new BadRequestException('Invalid document type');
        }

        return this.dossierService.updateDocuments(id, type, file.filename);
    }
}
