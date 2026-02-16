import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistrationDto } from './create-registration.dto';
import { RegistrationStatus } from '../entities/registration.entity';

export class UpdateRegistrationDto extends PartialType(CreateRegistrationDto) {
    status?: RegistrationStatus;
}
