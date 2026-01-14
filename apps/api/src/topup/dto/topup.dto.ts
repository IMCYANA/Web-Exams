import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateTopupDto {
    @IsNotEmpty()
    @IsString()
    method: 'BANK_TRANSFER' | 'TRUEMONEY_GIFT';

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsString()
    refNo?: string;

    @IsOptional()
    @IsString()
    proofUrl?: string;
}
