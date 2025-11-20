import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://your-production-url.com/kpmr-investasi' : 'http://localhost:5530/api/v1/kpmr-investasi';
export interface KpmrInvestasi {
  id_kpmr_investasi: number;
  year: number;
  quarter: string;
  aspekNo?: string;
  aspekBobot?: number;
  aspekTitle?: string;
  sectionNo?: string;
  indikator: string;
  sectionSkor?: number;
  tata_kelola_resiko?: string;
  strong?: string;
  satisfactory?: string;
  fair?: string;
  marginal?: string;
  unsatisfactory?: string;
  evidence?: string;
}

export interface CreateKpmrInvestasiDto extends Omit<KpmrInvestasi, 'id_kpmr_investasi'> {}
export interface UpdateKpmrInvestasiDto extends Partial<CreateKpmrInvestasiDto> {}

export const kpmrInvestasiService = {
  async getAll(filters?: { year?: number; quarter?: string; aspekNo?: string; query?: string }) {
    const params = new URLSearchParams();

    if (filters?.year) params.append('year', String(filters.year));
    if (filters?.quarter) params.append('quarter', filters.quarter);
    if (filters?.aspekNo) params.append('aspekNo', filters.aspekNo); // ❌ PERBAIKI: aspek_no -> aspekNo
    if (filters?.query) params.append('query', filters.query);

    const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
    const res = await axios.get<KpmrInvestasi[]>(url);
    return res.data;
  },

  async getById(id: number) {
    const res = await axios.get<KpmrInvestasi>(`${API_URL}/${id}`);
    return res.data;
  },

  async getByPeriod(year: number, quarter: string) {
    const res = await axios.get<KpmrInvestasi[]>(`${API_URL}/period/${year}/${quarter}`);
    return res.data;
  },

  async create(data: CreateKpmrInvestasiDto) {
    const res = await axios.post<KpmrInvestasi>(API_URL, data);
    return res.data;
  },

  async update(id: number, data: UpdateKpmrInvestasiDto) {
    const res = await axios.patch<KpmrInvestasi>(`${API_URL}/${id}`, data);
    return res.data;
  },

  async remove(id: number) {
    await axios.delete(`${API_URL}/${id}`);
  },
};
