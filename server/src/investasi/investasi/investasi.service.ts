import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investasi } from './entities/investasi.entity';
import { CreateInvestasiDto } from './dto/create-investasi.dto';
import { UpdateInvestasiDto } from './dto/update-investasi.dto';

@Injectable()
export class InvestasiService {
  constructor(
    @InjectRepository(Investasi)
    private readonly investRepository: Repository<Investasi>,
  ) {}

  private calculateWeighted(
    hasil?: number,
    bobotIndikator?: number,
    bobot?: number,
  ): number {
    return (hasil ?? 0) * (bobotIndikator ?? 0) * (bobot ?? 0);
  }

  async create(dto: CreateInvestasiDto): Promise<Investasi> {
    const weighted = this.calculateWeighted(
      dto.hasil,
      dto.bobot_indikator,
      dto.bobot,
    );

    const entity = this.investRepository.create({
      ...dto,
      no: String(dto.no),
      no_indikator: String(dto.no_indikator),
    });

    entity.weighted = weighted;

    return this.investRepository.save(entity);
  }

  async findAll(): Promise<Investasi[]> {
    return this.investRepository.find({
      order: { id_investasi: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Investasi> {
    const data = await this.investRepository.findOne({
      where: { id_investasi: id },
    });
    if (!data)
      throw new NotFoundException(`Investasi ID ${id} tidak ditemukan`);
    return data;
  }

  async update(id: number, dto: UpdateInvestasiDto): Promise<Investasi> {
    const data = await this.findOne(id);

    Object.assign(data, {
      ...dto,
      no_indikator:
        dto.no_indikator !== undefined
          ? String(dto.no_indikator)
          : data.no_indikator,
    });

    if (
      dto.hasil !== undefined ||
      dto.bobot_indikator !== undefined ||
      dto.bobot !== undefined
    ) {
      data.weighted = this.calculateWeighted(
        dto.hasil ?? data.hasil,
        dto.bobot_indikator ?? data.bobot_indikator,
        dto.bobot ?? data.bobot,
      );
    }

    return this.investRepository.save(data);
  }

  async remove(id: number): Promise<{ message: string }> {
    const data = await this.findOne(id);
    await this.investRepository.remove(data);
    return { message: `Investasi ID ${id} berhasil dihapus` };
  }

  async getInvestDataField(): Promise<Partial<Investasi>[]> {
    return this.investRepository.find({
      select: [
        'id_investasi',
        'parameter',
        'indikator',
        'hasil',
        'peringkat',
        'weighted',
      ],
      order: { id_investasi: 'ASC' },
    });
  }
}
