import DIVISION_API from '../api/division.api';
import { AxiosError } from 'axios';

export const DivisionService = {
  getAllDivisions: async () => {
    try {
      const res = await DIVISION_API.getAllDivisions();
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data?.message || 'Gagal mengambil data divisi');
      }
      throw err;
    }
  },

  updateUserDivision: async (user_id: number, divisi_id: number | null) => {
    try {
      const res = await DIVISION_API.updateUserDivision(user_id, divisi_id);
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data?.message || 'Gagal update divisi user');
      }
      throw err;
    }
  },
};
