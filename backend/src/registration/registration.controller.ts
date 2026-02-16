import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('registration')
@UseGuards(JwtAuthGuard)
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) { }

  @Post()
  create(@Body() createRegistrationDto: CreateRegistrationDto) {
    return this.registrationService.create(createRegistrationDto);
  }

  @Get()
  findAll() {
    return this.registrationService.findAll();
  }

  @Get('me')
  findMyRegistration(@Request() req) {
    return this.registrationService.findByCandidate(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registrationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistrationDto: UpdateRegistrationDto) {
    return this.registrationService.update(id, updateRegistrationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.registrationService.remove(id);
  }

  @Post(':id/email')
  @UseGuards(JwtAuthGuard) // Could restrict to ADMIN/COORDINATOR if RolesGuard was used globally or here
  sendEmail(@Param('id') id: string, @Body('type') type: 'confirmation' | 'validation') {
    return this.registrationService.sendEmail(id, type);
  }

  @Post('bulk-email')
  @UseGuards(JwtAuthGuard)
  sendBulkEmail(@Body() body: { ids: string[], type: 'confirmation' | 'validation' }) {
    return this.registrationService.sendBulkEmail(body.ids, body.type);
  }
}
