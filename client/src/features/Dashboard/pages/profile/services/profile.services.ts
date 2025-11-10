import PROFILE_API from '../api/profile.api';
import { AxiosError } from 'axios';

// Local storage key untuk menyimpan profile data
const PROFILE_STORAGE_KEY = 'user_profile_data';

// Get user from auth context as fallback
const getAuthUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

// Get profile from localStorage
const getStoredProfile = (user_id: number) => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      const profiles = JSON.parse(stored);
      return profiles[user_id] || null;
    }
  } catch (error) {
    console.error('Error reading stored profile:', error);
  }
  return null;
};

// Save profile to localStorage
const saveProfileToStorage = (user_id: number, profile: any) => {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    const profiles = stored ? JSON.parse(stored) : {};
    profiles[user_id] = {
      ...profile,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error('Error saving profile to storage:', error);
  }
};

export const ProfileService = {
  getProfile: async (user_id: number) => {
    try {
      console.log('🎯 [SERVICE] Fetching REAL data for user:', user_id);
      const res = await PROFILE_API.getProfile(user_id);

      if (!res.data || !res.data.userID) {
        throw new Error('Invalid response data from backend');
      }

      console.log('✅ [SERVICE] Real backend data received:', res.data);

      saveProfileToStorage(user_id, res.data);

      return res.data;
    } catch (err: any) {
      console.error('❌ [SERVICE] Backend API failed');

      const storedProfile = getStoredProfile(user_id);
      if (storedProfile) {
        console.log('🔄 [SERVICE] Using stored profile data');
        return storedProfile;
      }

      const authUser = getAuthUser();
      if (authUser) {
        console.log('🔄 [SERVICE] Using auth data as fallback');
        const fallbackData = {
          user_id: authUser.user_id || user_id,
          userID: authUser.userID || `user${user_id}`,
          role: authUser.role || 'USER',
          gender: authUser.gender || 'MALE',
          divisi: authUser.divisi || { divisi_id: 1, name: 'Compliance' },
          created_at: authUser.created_at || new Date().toISOString(),
          updated_at: authUser.updated_at || new Date().toISOString(),
        };
        saveProfileToStorage(user_id, fallbackData);
        return fallbackData;
      }

      // Jika semua fallback gagal
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || err.message || 'Backend Error 500';
        throw new Error(`Backend Error: ${errorMessage}`);
      }
      throw err;
    }
  },

  updateProfile: async (user_id: number, data: any) => {
    try {
      console.log('🎯 [SERVICE] Updating profile via API');
      const res = await PROFILE_API.updateProfile(user_id, data);

      // Simpan update ke localStorage
      saveProfileToStorage(user_id, res.data);

      console.log('✅ [SERVICE] API update successful');
      return res.data;
    } catch (err: any) {
      console.error('❌ [SERVICE] API update failed, updating locally');

      const currentProfile = getStoredProfile(user_id) || getAuthUser() || {};

      const updatedProfile = {
        user_id: currentProfile.user_id || user_id,
        userID: currentProfile.userID || `user${user_id}`,
        role: currentProfile.role || 'USER',
        gender: currentProfile.gender || 'MALE',
        divisi: currentProfile.divisi || { divisi_id: 1, name: 'Compliance' },
        created_at: currentProfile.created_at || new Date().toISOString(),
        ...data,
        updated_at: new Date().toISOString(),
      };

      // Save to localStorage
      saveProfileToStorage(user_id, updatedProfile);

      console.log('✅ [SERVICE] Profile updated locally:', updatedProfile);
      return updatedProfile;
    }
  },
};
