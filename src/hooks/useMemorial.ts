// src/hooks/useMemorial.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memorialApi } from '@/services/memorialApi';
import { FlowerMessage, LeafMessage, BackendApiResponse } from '@/types/memorial';
import { useToast } from '@/hooks/use-toast';

export const useMemorial = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 꽃 메시지 조회
  const {
    data: flowers, // 최종 데이터 타입: FlowerMessage[] | undefined
    isPending: flowersIsPending, // 로딩 상태
    isFetching: flowersIsFetching,
    error: flowersErrorRaw, // 원본 에러 객체: BackendApiResponse<null> | Error | unknown
    refetch: refetchFlowers,
  } = useQuery<
    FlowerMessage[],             // TData (성공 시 최종 데이터 타입)
    BackendApiResponse<null>     // TError (에러 객체 타입)
                                 // queryFn이 BackendApiResponse<FlowerMessage[]>를 반환하고,
                                 // 여기서 data를 추출하므로 TQueryFnData는 명시하지 않거나,
                                 // BackendApiResponse<FlowerMessage[]>로 명시 후 select 사용 가능
  >({
    queryKey: ['flowers'],
    queryFn: async (): Promise<FlowerMessage[]> => { // 성공 시 FlowerMessage[] 반환
      const response = await memorialApi.getFlowers(); // response는 BackendApiResponse<FlowerMessage[]>
      if (response.success && response.data) {
        return response.data;
      }
      // success가 false이거나 data가 null이면 에러로 처리
      throw response; // BackendApiResponse 객체를 그대로 throw하여 onError 또는 error 상태에서 사용
    },
    refetchInterval: 30000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // 나뭇잎 메시지 조회
  const {
    data: leaves, // LeafMessage[] | undefined
    isPending: leavesIsPending,
    isFetching: leavesIsFetching,
    error: leavesErrorRaw, // BackendApiResponse<null> | Error | unknown
    refetch: refetchLeaves,
  } = useQuery<LeafMessage[], BackendApiResponse<null>>({
    queryKey: ['leaves'],
    queryFn: async (): Promise<LeafMessage[]> => {
      const response = await memorialApi.getLeaves();
      if (response.success && response.data) {
        return response.data;
      }
      throw response;
    },
    refetchInterval: 30000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // 꽃 메시지 생성
  const createFlowerMutation = useMutation<
    BackendApiResponse<FlowerMessage>, // 성공 시 API가 반환하는 전체 응답 타입
    BackendApiResponse<null>,          // 에러 발생 시 타입
    string                             // mutate 함수 파라미터 타입 (message)
  >({
    mutationFn: (message: string) => memorialApi.createFlower(message),
    onSuccess: (response) => { // response는 BackendApiResponse<FlowerMessage>
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['flowers'] });
        toast({
          title: "마음이 전달되었습니다",
          description: response.message || "따뜻한 메시지가 성공적으로 등록되었습니다.",
          className: "bg-pink-50 border-pink-200 text-pink-800 dark:bg-pink-900 dark:border-pink-700 dark:text-pink-100",
        });
      } else {
        // API 호출은 성공했으나 백엔드가 success:false를 반환한 경우
        toast({
          title: "메시지 전송 실패",
          description: response.message || "서버에서 요청 처리에 실패했습니다.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => { // error는 memorialApi에서 reject한 BackendApiResponse<null>
      toast({
        title: "메시지 전송 오류",
        description: error.message || "다시 시도해 주세요.",
        variant: "destructive",
      });
    },
  });

  // 나뭇잎 메시지 생성
  const createLeafMutation = useMutation<
    BackendApiResponse<LeafMessage>,
    BackendApiResponse<null>,
    void
  >({
    mutationFn: () => memorialApi.createLeaf(),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['leaves'] });
        toast({
          title: "따뜻한 마음이 전달되었습니다",
          description: response.message || "소중한 마음을 받았습니다.",
          className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-100",
        });
      } else {
        toast({
          title: "마음 전달 실패",
          description: response.message || "서버에서 요청 처리에 실패했습니다.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "마음 전달 오류",
        description: error.message || "다시 시도해 주세요.",
        variant: "destructive",
      });
    },
  });

  const getErrorMessage = (err: BackendApiResponse<null> | Error | unknown): string | null => {
    if (err && typeof err === 'object' && err !== null) {
        if ('message' in err && typeof (err as any).message === 'string') {
            return (err as BackendApiResponse<null>).message;
        }
        if (err instanceof Error) {
            return err.message;
        }
    }
    return '알 수 없는 오류가 발생했습니다.'; // 에러가 있지만 메시지를 추출할 수 없는 경우
  };

  const queryError = flowersErrorRaw || leavesErrorRaw;
  const displayQueryErrorMessage = queryError ? getErrorMessage(queryError) : null;

  // useEffect를 사용한 query error toast는 App.tsx의 QueryClient 전역 설정에서 처리합니다.
  // 이 훅에서는 UI에 표시할 error 메시지만 반환합니다.

  return {
    flowers: flowers || [],
    leaves: leaves || [],
    isLoadingInitial: flowersIsPending || leavesIsPending, // 초기 로딩
    isFetchingAny: flowersIsFetching || leavesIsFetching, // 백그라운드 포함 모든 fetching
    error: displayQueryErrorMessage, // UI 직접 표시용 에러 메시지
    createFlower: createFlowerMutation.mutate,
    createLeaf: createLeafMutation.mutate,
    isCreatingFlower: createFlowerMutation.isPending,
    isCreatingLeaf: createLeafMutation.isPending,
    refetchFlowers,
    refetchLeaves,
  };
};
