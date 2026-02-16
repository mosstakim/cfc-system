import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAcademicDto } from './dto/create-academic.dto';
import { UpdateAcademicDto } from './dto/update-academic.dto';
import { Establishment } from './entities/establishment.entity';
import { Formation } from './entities/formation.entity';
import { Session } from './entities/session.entity';
import { UpdateSessionDto } from './dto/update-session.dto';
import { CreateFormationDto } from './dto/create-formation.dto';
import { UpdateFormationDto } from './dto/update-formation.dto';

@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(Establishment) private establishmentRepository: Repository<Establishment>,
    @InjectRepository(Formation) private formationRepository: Repository<Formation>,
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
  ) { }

  findAllSessions() {
    return this.sessionRepository.find({ relations: ['formation'] });
  }

  create(createAcademicDto: CreateAcademicDto) {
    return 'This action adds a new academic';
  }

  async findAll() {
    return {
      establishments: await this.establishmentRepository.find({ relations: ['formations'] }),
      formations: await this.formationRepository.find({ relations: ['sessions'] }),
      sessions: await this.sessionRepository.find(),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} academic`;
  }

  update(id: number, updateAcademicDto: UpdateAcademicDto) {
    return `This action updates a #${id} academic`;
  }

  async updateSession(id: string, updateSessionDto: UpdateSessionDto) {
    const session = await this.sessionRepository.findOneBy({ id });
    if (!session) {
      throw new Error('Session not found');
    }

    // Update fields
    if (updateSessionDto.name) session.name = updateSessionDto.name;
    if (updateSessionDto.startDate) session.startDate = new Date(updateSessionDto.startDate);
    if (updateSessionDto.endDate) session.endDate = new Date(updateSessionDto.endDate);
    if (updateSessionDto.isOpen !== undefined) session.isOpen = updateSessionDto.isOpen;

    return this.sessionRepository.save(session);
  }

  async createFormation(createFormationDto: CreateFormationDto) {
    const { establishmentId, ...formationData } = createFormationDto;
    const establishment = await this.establishmentRepository.findOneBy({ id: establishmentId });
    if (!establishment) {
      throw new Error('Establishment not found');
    }

    const formation = this.formationRepository.create({
      ...formationData,
      establishment,
    });

    return this.formationRepository.save(formation);
  }

  async updateFormation(id: string, updateFormationDto: UpdateFormationDto) {
    const formation = await this.formationRepository.findOneBy({ id });
    if (!formation) {
      throw new Error('Formation not found');
    }

    const { establishmentId, ...updateData } = updateFormationDto;

    if (establishmentId) {
      const establishment = await this.establishmentRepository.findOneBy({ id: establishmentId });
      if (!establishment) {
        throw new Error('Establishment not found');
      }
      formation.establishment = establishment;
    }

    Object.assign(formation, updateData);
    return this.formationRepository.save(formation);
  }

  async removeFormation(id: string) {
    const formation = await this.formationRepository.findOneBy({ id });
    if (!formation) {
      throw new Error('Formation not found');
    }
    return this.formationRepository.remove(formation);
  }

  remove(id: number) {
    return `This action removes a #${id} academic`;
  }
}

