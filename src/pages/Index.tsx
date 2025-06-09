import React, { useState } from 'react';
import MessageInput from '@/components/MessageInput';
import LeafButton from '@/components/LeafButton';
import MessageDisplay from '@/components/MessageDisplay';
import { useMemorial } from '@/hooks/useMemorial';
import { Heart, Sparkles } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast'; 

const Index = () => {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number } | null>(null);
  const [newlyCreatedMessage, setNewlyCreatedMessage] = useState<{ content: string; type: 'flower' | 'leaf'; timestamp: number } | null>(null);
  
  const {
    flowers,
    leaves,
    isLoadingInitial,
    error,
    createFlower,
    createLeaf,
    isCreatingFlower,
    isCreatingLeaf,
  } = useMemorial();

  const handleFlowerSubmit = async (message: string) => {
    await createFlower(message);
    // 새로 생성된 꽃 메시지를 10초간 표시
    setNewlyCreatedMessage({
      content: message,
      type: 'flower',
      timestamp: Date.now()
    });
  };

  const handleLeafClick = async () => {
    await createLeaf();
    // 새로 생성된 나뭇잎 메시지를 10초간 표시
    const leafMessages = [
      "감사합니다", "고마운 마음", "기억하겠습니다", "존경합니다", "마음을 전합니다",
      "따뜻한 위로", "소중한 선물", "아름다운 마음", "깊은 감동", "진심 어린 감사",
      "영원한 기억", "고귀한 뜻", "사랑합니다", "축복합니다", "평안하세요"
    ];
    const randomMessage = leafMessages[Math.floor(Math.random() * leafMessages.length)];
    
    setNewlyCreatedMessage({
      content: randomMessage,
      type: 'leaf',
      timestamp: Date.now()
    });
  };

  const handleMessageHover = (message: string, date: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setSelectedMessage(message);
    setSelectedDate(date);
    setHoveredPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleMessageLeave = () => {
    setSelectedMessage(null);
    setSelectedDate(null);
    setHoveredPosition(null);
  };

  if (isLoadingInitial && flowers.length === 0 && leaves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background-start to-background-end p-4 text-foreground">
        마음들을 불러오고 있습니다...
        <Sparkles className="animate-pulse text-pink-500 mt-2 h-8 w-8" />
      </div>
    );
  }

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
                  newlyCreatedMessage={newlyCreatedMessage}
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
