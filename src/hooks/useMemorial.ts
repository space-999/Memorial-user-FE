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
    data: flowers,
    isPending: flowersIsPending,
    isFetching: flowersIsFetching,
    error: flowersErrorRaw,
    refetch: refetchFlowers,
  } = useQuery<
    FlowerMessage[],
    BackendApiResponse<null>
  >({
    queryKey: ['flowers'],
    queryFn: async (): Promise<FlowerMessage[]> => {
      const response = await memorialApi.getFlowers();
      if (response.success && response.data) {
        return response.data;
      }
      throw response;
    },
    refetchInterval: 30000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // 나뭇잎 메시지 조회
  const {
    data: leaves,
    isPending: leavesIsPending,
    isFetching: leavesIsFetching,
    error: leavesErrorRaw,
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
    BackendApiResponse<FlowerMessage>,
    BackendApiResponse<null>,
    string
  >({
    mutationFn: (message: string) => memorialApi.createFlower(message),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['flowers'] });
        toast({
          title: "마음이 전달되었습니다",
          description: response.message || "따뜻한 메시지가 성공적으로 등록되었습니다.",
          className: "bg-pink-50 border-pink-200 text-pink-800 dark:bg-pink-900 dark:border-pink-700 dark:text-pink-100",
        });
      } else {
        toast({
          title: "메시지 전송 실패",
          description: response.message || "서버에서 요청 처리에 실패했습니다.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
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
        // queryClient.invalidateQueries({ queryKey: ['leaves'] });
        // invalidateQueries 대신 setQueryData를 사용하여 즉시 캐시를 업데이트하는 것이 더 빠르고 정확합니다.
        // 하지만 백엔드가 랜덤 메시지를 생성하므로, invalidateQueries를 유지하는 것이
        // 서버의 최신 데이터를 가져오는 데 더 적합할 수 있습니다.
        // 또는 onSuccess에 response.data를 활용하여 setQueryData로 직접 업데이트할 수도 있습니다.
        // 여기서는 invalidateQueries를 유지합니다.
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
    return '알 수 없는 오류가 발생했습니다.';
  };

  const queryError = flowersErrorRaw || leavesErrorRaw;
  const displayQueryErrorMessage = queryError ? getErrorMessage(queryError) : null;

  return {
    flowers: flowers || [],
    leaves: leaves || [],
    isLoadingInitial: flowersIsPending || leavesIsPending,
    isFetchingAny: flowersIsFetching || leavesIsFetching,
    error: displayQueryErrorMessage,
    createFlower: createFlowerMutation.mutateAsync, // ★★★ mutateAsync로 변경
    createLeaf: createLeafMutation.mutateAsync,     // ★★★ mutateAsync로 변경
    isCreatingFlower: createFlowerMutation.isPending,
    isCreatingLeaf: createLeafMutation.isPending,
    refetchFlowers,
    refetchLeaves,
  };
};