import { Expose } from 'class-transformer';

export class GetInvestDto {
  @Expose()
  No: string;

  @Expose()
  bobot: number;

  @Expose()
  parameter: string;

  @Expose()
  no_indikator: number;

  @Expose()
  indikator: string;

  @Expose()
  bobot_indikator: number;

  @Expose()
  sumber_resiko: string;

  @Expose()
  dampak: string;

  @Expose()
  low: string;

  @Expose()
  low_to_moderate: string;

  @Expose()
  moderate: string;

  @Expose()
  moderate_to_high: string;

  @Expose()
  high: string;

  @Expose()
  hasil: number;

  @Expose()
  peringkat?: number;

  @Expose()
  nama_pembilang?: string;

  @Expose()
  nama_penyebut?: string;

  @Expose()
  total_pembilang?: number;

  @Expose()
  total_penyebut?: number;

  @Expose()
  weighted?: number;

  @Expose()
  keterangan?: string;

  @Expose()
  pereview_hasil?: number;
}
