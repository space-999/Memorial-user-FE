
import axios, { AxiosError, AxiosResponse } from 'axios';
import { FlowerMessage, LeafMessage, BackendApiResponse} from '@/types/memorial';

const API_BASE_URL = 'http://localhost:8081/api/v1';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 요청 인터셉터 - 로깅
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 로깅 및 에러 처리
apiClient.interceptors.response.use(
  (response: AxiosResponse<BackendApiResponse<any>>) => { // 응답 타입을 BackendApiResponse<any>로 명시
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    // 백엔드 응답 구조에서 실제 데이터를 추출하여 반환하거나, 전체 BackendApiResponse를 반환할 수 있습니다.
    // 여기서는 전체 BackendApiResponse를 반환하여 호출하는 쪽에서 success, message, data 등을 모두 활용하도록 합니다.
    return response; // AxiosResponse<BackendApiResponse<any>> 자체를 반환
  },
  (error: AxiosError) => {
    console.error(
      'API Response Error:',
      error.response?.status,
      error.response?.data || error.message
    );

    // 에러 발생 시에도 백엔드가 BackendApiResponse 또는 ErrorResponse 형태의 JSON을 body에 담아 보냈다면,
    // error.response.data에 해당 정보가 있을 수 있습니다.
    // 이를 일관된 에러 객체로 가공하여 reject
    const errorResponse: BackendApiResponse<null> = error.response?.data as BackendApiResponse<null> || {
        success: false,
        code: error.response?.status || 500,
        message: (error.response?.data as any)?.message || error.message || 'An unknown error occurred',
        data: null,
    };
    return Promise.reject(errorResponse); // 가공된 에러 응답 객체를 reject
  }
);

export const memorialApi = {
  // 꽃 메시지 조회
  getFlowers: async (): Promise<BackendApiResponse<FlowerMessage[]>> => {
    const response = await apiClient.get<BackendApiResponse<FlowerMessage[]>>('/flowers');
    return response.data; // response.data 형태 -> BackendApiResponse<FlowerMessage[]
  },

  // 나뭇잎 메시지 조회
  getLeaves: async (): Promise<BackendApiResponse<LeafMessage[]>> => {
    const response = await apiClient.get<BackendApiResponse<LeafMessage[]>>('/leaves');
    return response.data;
  },

  // 꽃 메시지 생성
  createFlower: async (message: string): Promise<BackendApiResponse<FlowerMessage>> => {
    console.log('Creating flower with message:', message);
    const requestData = { content: message };
    console.log('Request data:', requestData);
    const response = await apiClient.post<BackendApiResponse<FlowerMessage>>('/flowers', requestData);
    console.log('Flower creation response:', response.data);
    return response.data;
  },

  // 나뭇잎 메시지 생성
  createLeaf: async (): Promise<BackendApiResponse<LeafMessage>> => {
    const response = await apiClient.post<BackendApiResponse<LeafMessage>>('/leaves');
    return response.data;
  },
};
