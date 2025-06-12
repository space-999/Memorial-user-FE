// Index.tsx
import React, { useState } from 'react';
import MessageInput from '@/components/MessageInput';
import LeafButton from '@/components/LeafButton';
import MessageDisplay from '@/components/MessageDisplay';
import { useMemorial } from '@/hooks/useMemorial';
import { Heart, Sparkles } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast'; 
import { FlowerMessage, LeafMessage } from '@/types/memorial'; // FlowerMessage, LeafMessage 타입 임포트

const Index = () => {
  const [newlyCreatedMessage, setNewlyCreatedMessage] = useState<{ content: string; type: 'flower' | 'leaf'; timestamp: number } | null>(null);
  
  const {
    flowers,
    leaves,
    isLoadingInitial,
    error,
    createFlower, // 이제 createFlower는 mutateAsync입니다.
    createLeaf,   // 이제 createLeaf는 mutateAsync입니다.
    isCreatingFlower,
    isCreatingLeaf,
  } = useMemorial();

  const handleFlowerSubmit = async (message: string) => {
    try {
      // createFlower는 BackendApiResponse<FlowerMessage>를 반환합니다.
      const response = await createFlower(message); 
      
      if (response.success && response.data) {
        setNewlyCreatedMessage({
          content: response.data.content, // ★★★ 백엔드에서 반환된 꽃 메시지 사용
          type: 'flower',
          timestamp: new Date(response.data.createdAt).getTime()
        });
      } else {
        console.warn('꽃 메시지 생성 응답 데이터 형식이 예상과 다릅니다:', response);
      }
    } catch (error) {
      console.error('Error creating flower:', error);
      // useMemorial 훅에서 이미 토스트 메시지를 처리하므로 여기서는 추가 처리 불필요
    }
  };

  const handleLeafClick = async () => {
    try {
      // createLeaf는 BackendApiResponse<LeafMessage>를 반환합니다.
      const response = await createLeaf(); 
      
      console.log('Create leaf response:', response); // 응답 전체를 로그하여 확인

      // response.success가 true이고 response.data가 존재하며 content를 포함하는지 확인
      if (response.success && response.data && response.data.content) {
        setNewlyCreatedMessage({
          content: response.data.content, // ★★★ 백엔드에서 생성된 랜덤 나뭇잎 메시지 사용
          type: 'leaf',
          timestamp: new Date(response.data.createdAt).getTime() // 백엔드의 생성 시간 사용
        });
        // leaves 배열은 useMemorial 훅의 onSuccess 콜백에서 자동으로 업데이트됩니다.
      } else {
        console.warn('나뭇잎 메시지 생성 응답 데이터 형식이 예상과 다릅니다:', response);
        // 오류 처리 또는 사용자에게 알림
      }
    } catch (error) {
      console.error('Error creating leaf:', error);
      // useMemorial 훅에서 이미 토스트 메시지를 처리하므로 여기서는 추가 처리 불필요
      // 에러 시 중앙 메시지 표시를 원한다면 여기에 추가:
      // setNewlyCreatedMessage({
      //   content: "마음 전달에 실패했습니다.",
      //   type: 'leaf',
      //   timestamp: Date.now()
      // });
    }
  };

  // MessageDisplay에 마우스 호버/리브 이벤트 핸들러
  // MessageDisplay 내부에서 호버 메시지 표시 로직을 관리하고 있다면,
  // 이 상위 컴포넌트의 selectedMessage, selectedDate, hoveredPosition 상태와
  // 이 핸들러들은 필요 없거나 MessageDisplay 내부로 옮겨지는 것이 좋습니다.
  // 현재 상태에서는 MessageDisplay에 props로 전달되므로 그대로 유지합니다.
  const handleMessageHover = (message: string, date: string, event: React.MouseEvent) => {
    // MessageDisplay 컴포넌트 내부에서 hoveredMessage 상태를 관리하는 것이 더 효율적입니다.
    // 만약 Index.tsx에서 이 상태들을 직접 관리하여 외부 모달 등을 띄우는 것이 목적이라면 유지.
    // 현재 코드에서는 해당 상태들이 사용되지 않고 주석 처리되어 있습니다.
    // (이 주석은 설명을 위해 남겨둔 것이므로, 실제 코드에서는 제거하거나 필요에 따라 구현하세요.)
  };

  const handleMessageLeave = () => {
    // 위와 동일
  };


  if (isLoadingInitial && flowers.length === 0 && leaves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background-start to-background-end p-4 text-foreground">
        마음들을 불러오고 있습니다...
        <Sparkles className="animate-pulse text-pink-500 mt-2 h-8 w-8" />
      </div>
    );
  }

  // 에러 메시지 표시 (선택 사항)
  {/* {error && <div className="text-red-500 text-center mt-4">{error}</div>} */}


  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <main className="min-h-screen relative overflow-x-hidden">
        {/* 배경 그라디언트 오버레이 */}
        <div className="fixed inset-0 bg-gradient-to-br from-pink-50/40 via-rose-50/30 to-pink-100/40 pointer-events-none"></div>
        
        {/* 헤더 */}
        <header className="relative z-10 text-center py-8 md:py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Heart className="w-8 h-8 md:w-10 md:h-10 text-pink-500 animate-gentle-float" />
                <div className="absolute -inset-1 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-semibold gradient-text">
                추모의 정원
              </h1>
              <div className="relative">
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-rose-500 animate-gentle-float" style={{ animationDelay: '2s' }} />
                <div className="absolute -inset-1 bg-rose-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
            <p className="text-lg md:text-xl subtitle-gradient font-body font-light leading-relaxed">
              소중한 생명을 나누어주신 기증자분들께<br className="md:hidden" />
              <span className="text-pink-600 font-medium"> 감사와 위로의 마음</span>을 전해주세요
            </p>
          </div>
        </header>

        {/* 입력 섹션 */}
        <section className="relative z-10 px-4 mb-8 md:mb-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="animate-slide-up">
              <MessageInput
                onSubmit={handleFlowerSubmit}
                isLoading={isCreatingFlower}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <LeafButton
                onClick={handleLeafClick}
                isLoading={isCreatingLeaf}
              />
              <p className="text-lg md:text-xl subtitle-gradient font-body font-light leading-relaxed">
                당신의 마음을 대신할, 따뜻한 메시지를 나뭇잎처럼 띄워보세요.
              </p>
            </div>
          </div>
        </section>

        {/* 메시지 표시 섹션 */}
        <section className="relative z-10 px-4 pb-8 md:pb-12">
          <div className="max-w-5xl mx-auto flex justify-center">
            {isLoadingInitial ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-6">
                  <div className="relative inline-block">
                    <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-rose-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  </div>
                  <p className="text-gray-600 text-xl font-body font-light">
                    마음들을 불러오고 있습니다...
                  </p>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <MessageDisplay 
                  flowers={flowers} 
                  leaves={leaves} 
                  onMessageHover={handleMessageHover}
                  onMessageLeave={handleMessageLeave}
                  newlyCreatedMessage={newlyCreatedMessage} // 새로 생성된 메시지 전달
                />
              </div>
            )}
          </div>
        </section>

        {/* 푸터 */}
        <footer className="relative z-10 text-center py-6 md:py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-500 text-sm font-body font-light opacity-75">
              장기기증의 숭고한 뜻을 기리는 공간입니다
            </p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Index;