import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('investasi')
export class Investasi {
  @PrimaryGeneratedColumn()
  id_investasi: number;

  @Column({ type: 'varchar', nullable: true })
  no: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  no_parameter: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  parameter: string;

  @Column({ type: 'float', nullable: true })
  bobot: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  no_indikator: string;

  @Column({ type: 'text', nullable: true })
  indikator: string;

  @Column({ type: 'float', nullable: true })
  bobot_indikator: number;

  @Column({ type: 'text', nullable: true })
  sumber_resiko: string;

  @Column({ type: 'text', nullable: true })
  dampak: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  low: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  low_to_moderate: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  moderate: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  moderate_to_high: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  high: string;

  @Column({ type: 'float', nullable: true })
  hasil: number;

  @Column({ type: 'int', nullable: true })
  peringkat: number;

  @Column({ type: 'float', nullable: true })
  weighted: number;

  @Column({ type: 'text', nullable: true })
  keterangan: string;

  @Column({ type: 'float', nullable: true })
  total_pembilang: number;

  @Column({ type: 'float', nullable: true })
  total_penyebut: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nama_pembilang: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nama_penyebut: string;

  @Column({ type: 'int', nullable: true })
  pereview_hasil: number;
}
