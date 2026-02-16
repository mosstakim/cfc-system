import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { Registration, RegistrationStatus } from './entities/registration.entity';
import { Dossier } from './entities/dossier.entity';
import { User } from '../users/entities/user.entity';
import { Session } from '../academic/entities/session.entity';
import { MailService } from '../mail/mail.service';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration) private registrationRepository: Repository<Registration>,
    @InjectRepository(Dossier) private dossierRepository: Repository<Dossier>,
    @InjectRepository(User) private userRepository: Repository<User>, // Assuming we can check user existence
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
    private mailService: MailService,
  ) { }

  async create(createRegistrationDto: CreateRegistrationDto) {
    const { candidateId, sessionId } = createRegistrationDto;

    const candidate = await this.userRepository.findOneBy({ id: candidateId });
    if (!candidate) {
      throw new NotFoundException(`Candidat avec l'ID ${candidateId} introuvable`);
    }

    const session = await this.sessionRepository.findOneBy({ id: sessionId });
    if (!session) {
      throw new NotFoundException(`Session avec l'ID ${sessionId} introuvable`);
    }

    if (!session.isOpen) {
      throw new BadRequestException('La session est fermée aux inscriptions');
    }

    // Check existing registration
    const existing = await this.registrationRepository.findOne({
      where: { candidate: { id: candidateId }, session: { id: sessionId } }
    });
    if (existing) {
      throw new BadRequestException('Le candidat est déjà inscrit à cette session');
    }

    // Create Dossier
    const dossier = this.dossierRepository.create({
      isComplete: false,
      documents: {},
    });
    // We can save dossier cascadingly if entity is set up, but safer to save or let cascade handle it.
    // Registration has cascade: true for dossier.

    const registration = this.registrationRepository.create({
      candidate,
      session,
      dossier,
      status: RegistrationStatus.PENDING,
    });

    // const savedRegistration = await this.registrationRepository.save(registration);

    // // Send confirmation email (REMOVED for manual trigger)
    // // await this.mailService.sendRegistrationConfirmation(candidate);

    return this.registrationRepository.save(registration);
  }

  findAll() {
    return this.registrationRepository.find({
      relations: ['candidate', 'session', 'session.formation', 'dossier']
    });
  }

  findByCandidate(candidateId: string) {
    return this.registrationRepository.findOne({
      where: { candidate: { id: candidateId } },
      relations: ['candidate', 'session', 'dossier']
    });
  }

  async findOne(id: string) {
    const reg = await this.registrationRepository.findOne({
      where: { id },
      relations: ['candidate', 'session', 'dossier']
    });
    if (!reg) throw new NotFoundException(`Inscription ${id} introuvable`);
    return reg;
  }

  async update(id: string, updateRegistrationDto: UpdateRegistrationDto) {
    const registration = await this.findOne(id);
    if (updateRegistrationDto.status) {
      registration.status = updateRegistrationDto.status;

      // Email sending is now manual
      // if (registration.status === RegistrationStatus.VALIDATED) {
      //   await this.mailService.sendAccountValidation(registration.candidate);
      // }
    }
    return this.registrationRepository.save(registration);
  }

  async sendEmail(id: string, type: 'confirmation' | 'validation') {
    const registration = await this.findOne(id);
    if (type === 'confirmation') {
      await this.mailService.sendRegistrationConfirmation(registration.candidate);
    } else if (type === 'validation') {
      if (registration.status !== RegistrationStatus.VALIDATED) {
        throw new BadRequestException("Ne peut envoyer l'email de validation que si l'inscription est validée.");
      }
      await this.mailService.sendAccountValidation(registration.candidate);
    }
    return { sent: true, type };
  }

  async sendBulkEmail(ids: string[], type: 'confirmation' | 'validation') {
    const results: any[] = [];
    for (const id of ids) {
      try {
        await this.sendEmail(id, type);
        results.push({ id, status: 'sent' });
      } catch (error: any) {
        results.push({ id, status: 'failed', error: error.message });
      }
    }
    return results;
  }

  async remove(id: string) {
    const registration = await this.findOne(id);
    const candidateId = registration.candidate.id;
    const candidateRole = registration.candidate.role;

    // Delete the registration first
    await this.registrationRepository.remove(registration);

    // If the user is a CANDIDATE, delete their account too so they can re-register
    if (candidateRole === UserRole.CANDIDATE) {
      // Use delete instead of remove since we only have the ID now (and entity is detached or partial)
      await this.userRepository.delete(candidateId);
    }

    return { deleted: true, candidateDeleted: candidateRole === UserRole.CANDIDATE };
  }
}
