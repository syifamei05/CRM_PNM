"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestasiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const investasi_entity_1 = require("./entities/investasi.entity");
let InvestasiService = class InvestasiService {
    investRepository;
    constructor(investRepository) {
        this.investRepository = investRepository;
    }
    calculateWeighted(hasil, bobotIndikator, bobot) {
        return (hasil ?? 0) * (bobotIndikator ?? 0) * (bobot ?? 0);
    }
    async create(dto) {
        const weighted = this.calculateWeighted(dto.hasil, dto.bobot_indikator, dto.bobot);
        const entity = this.investRepository.create({
            ...dto,
            no: String(dto.no),
            no_indikator: String(dto.no_indikator),
        });
        entity.weighted = weighted;
        return this.investRepository.save(entity);
    }
    async findAll() {
        return this.investRepository.find({
            order: { id_investasi: 'ASC' },
        });
    }
    async findOne(id) {
        const data = await this.investRepository.findOne({
            where: { id_investasi: id },
        });
        if (!data)
            throw new common_1.NotFoundException(`Investasi ID ${id} tidak ditemukan`);
        return data;
    }
    async update(id, dto) {
        const data = await this.findOne(id);
        Object.assign(data, {
            ...dto,
            no_indikator: dto.no_indikator !== undefined
                ? String(dto.no_indikator)
                : data.no_indikator,
        });
        if (dto.hasil !== undefined ||
            dto.bobot_indikator !== undefined ||
            dto.bobot !== undefined) {
            data.weighted = this.calculateWeighted(dto.hasil ?? data.hasil, dto.bobot_indikator ?? data.bobot_indikator, dto.bobot ?? data.bobot);
        }
        return this.investRepository.save(data);
    }
    async remove(id) {
        const data = await this.findOne(id);
        await this.investRepository.remove(data);
        return { message: `Investasi ID ${id} berhasil dihapus` };
    }
    async getInvestDataField() {
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
};
exports.InvestasiService = InvestasiService;
exports.InvestasiService = InvestasiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(investasi_entity_1.Investasi)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InvestasiService);
//# sourceMappingURL=investasi.service.js.map