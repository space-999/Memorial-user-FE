
import axios from 'axios';
import { FlowerMessage, LeafMessage, BackendApiResponse } from '@/types/memorial';

const BASE_URL = 'http://localhost:8081/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message, error.code);
    return Promise.reject(error);
  }
);

export const memorialApi = {
  // 꽃 메시지 목록 조회
  async getFlowers(): Promise<BackendApiResponse<FlowerMessage[]>> {
    try {
      const response = await api.get<BackendApiResponse<FlowerMessage[]>>('/flowers');
      console.log('Flowers API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching flowers:', error);
      throw {
        success: false,
        message: '꽃 메시지를 불러오는데 실패했습니다',
        status: error.response?.status || 500,
        code: error.code || 'UNKNOWN_ERROR',
        data: null
      } as BackendApiResponse<null>;
    }
  },

  // 나뭇잎 메시지 목록 조회
  async getLeaves(): Promise<BackendApiResponse<LeafMessage[]>> {
    try {
      const response = await api.get<BackendApiResponse<LeafMessage[]>>('/leaves');
      console.log('Leaves API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching leaves:', error);
      throw {
        success: false,
        message: '나뭇잎 메시지를 불러오는데 실패했습니다',
        status: error.response?.status || 500,
        code: error.code || 'UNKNOWN_ERROR',
        data: null
      } as BackendApiResponse<null>;
    }
  },

  // 꽃 메시지 생성
  async createFlower(message: string): Promise<BackendApiResponse<FlowerMessage>> {
    try {
      console.log('Creating flower with message:', message);
      const response = await api.post<BackendApiResponse<FlowerMessage>>('/flowers', {
        message: message
      });
      console.log('Create flower response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating flower:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      throw {
        success: false,
        message: error.response?.data?.message || '메시지 전송에 실패했습니다',
        status: error.response?.status || 500,
        code: error.response?.data?.code || error.code || 'UNKNOWN_ERROR',
        data: null
      } as BackendApiResponse<null>;
    }
  },

  // 나뭇잎 메시지 생성
  async createLeaf(): Promise<BackendApiResponse<LeafMessage>> {
    try {
      console.log('Creating leaf message');
      const response = await api.post<BackendApiResponse<LeafMessage>>('/leaves');
      console.log('Create leaf response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating leaf:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      throw {
        success: false,
        message: error.response?.data?.message || '마음 전달에 실패했습니다',
        status: error.response?.status || 500,
        code: error.response?.data?.code || error.code || 'UNKNOWN_ERROR',
        data: null
      } as BackendApiResponse<null>;
    }
  },
};
