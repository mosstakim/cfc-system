import { CreateRegistrationDto } from './create-registration.dto';
import { RegistrationStatus } from '../entities/registration.entity';
declare const UpdateRegistrationDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateRegistrationDto>>;
export declare class UpdateRegistrationDto extends UpdateRegistrationDto_base {
    status?: RegistrationStatus;
}
export {};
