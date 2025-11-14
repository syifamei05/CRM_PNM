import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInvestasiDto {
  @IsString()
  @IsNotEmpty()
  no: string;

  @IsString()
  @IsNotEmpty()
  parameter: string;

  @IsNumber()
  @IsNotEmpty()
  bobot: number;

  @IsNumber()
  @IsNotEmpty()
  no_indikator: number;

  @IsString()
  @IsNotEmpty()
  indikator: string;

  @IsNumber()
  @IsNotEmpty()
  bobot_indikator: number;

  @IsString()
  @IsNotEmpty()
  sumber_resiko: string;

  @IsString()
  @IsNotEmpty()
  dampak: string;

  @IsString()
  @IsNotEmpty()
  low: string;

  @IsString()
  @IsNotEmpty()
  low_to_moderate: string;

  @IsString()
  @IsNotEmpty()
  moderate: string;

  @IsString()
  @IsNotEmpty()
  moderate_to_high: string;

  @IsString()
  @IsNotEmpty()
  high: string;

  @IsNumber()
  @IsNotEmpty()
  hasil: number;

  @IsOptional()
  @IsNumber()
  peringkat?: number;

  @IsOptional()
  @IsString()
  keterangan: string;

  @IsOptional()
  @IsString()
  nama_pembilang?: string;

  @IsOptional()
  @IsString()
  nama_penyebut?: string;

  @IsOptional()
  @IsNumber()
  total_pembilang?: number;

  @IsOptional()
  @IsNumber()
  total_penyebut?: number;

  @IsOptional()
  @IsNumber()
  weighted?: number;

  @IsOptional()
  @IsNumber()
  pereview_hasil?: number;
}
