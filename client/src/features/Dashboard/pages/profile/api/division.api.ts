import axios from 'axios';

const BASE_URL = 'http://localhost:5530/api/divisi';

const DIVISION_API = {
  getAllDivisions: () => axios.get(BASE_URL),

  updateUserDivision: (user_id: number, divisi_id: number | null) => axios.patch(`${BASE_URL}/users/${user_id}/division`, { divisiId: divisi_id }),
};

export default DIVISION_API;
