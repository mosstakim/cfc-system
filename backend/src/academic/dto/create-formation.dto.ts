import { IsString, IsNumber, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateFormationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    tuitionFees: number;

    @IsString()
    @IsOptional()
    duration: string;

    @IsUUID()
    @IsNotEmpty()
    establishmentId: string;
}
