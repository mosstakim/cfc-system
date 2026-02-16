import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { CreateFormationDto } from './dto/create-formation.dto';
import { UpdateFormationDto } from './dto/update-formation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('academic/formations')
export class FormationsController {
    constructor(private readonly academicService: AcademicService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    create(@Body() createFormationDto: CreateFormationDto) {
        return this.academicService.createFormation(createFormationDto);
    }

    @Get()
    findAll() {
        // This can be public or protected depending on requirements.
        // Assuming public access is needed for the catalog.
        return this.academicService.findAll().then(res => res.formations);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    update(@Param('id') id: string, @Body() updateFormationDto: UpdateFormationDto) {
        return this.academicService.updateFormation(id, updateFormationDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    remove(@Param('id') id: string) {
        return this.academicService.removeFormation(id);
    }
}
