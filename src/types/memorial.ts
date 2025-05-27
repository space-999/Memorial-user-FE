
export interface FlowerMessage {
  id: number;
  content: string;
  createdAt: string;
}

export interface LeafMessage {
  id: number;
  content: string;
  createdAt: string;
}

export interface BackendApiResponse<T> {
  success: boolean;
  code: number; // HTTP 상태 코드 또는 내부 정의 코드
  message: string;
  data: T | null; // 성공 시 데이터, 실패 시 null
}
