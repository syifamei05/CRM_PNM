import axios from 'axios';
import DB_API from '../../../api/dashboard.api';
const BASE_URL = 'http://localhost:/api/v1/users';
const PROFILE_API = {
  getProfile: (user_id: number) => DB_API.get(`/users/${user_id}`),

  updateProfile: (user_id: number, data: any) => DB_API.patch(`/users/${user_id}`, data),
  updateDivision: (user_id: number, divisiId: number) => axios.patch(`${BASE_URL}/${user_id}/division`, { divisiId }),
};

export default PROFILE_API;
