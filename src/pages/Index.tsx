
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
  
  const {
    flowers,
    leaves,
    isLoading,
    error,
    createFlower,
    createLeaf,
    isCreatingFlower,
    isCreatingLeaf,
  } = useMemorial();

  const handleFlowerSubmit = async (message: string) => {
    await createFlower(message);
  };

  const handleLeafClick = async () => {
    await createLeaf();
  };

  const handleMessageClick = (message: string, date: string) => {
    setSelectedMessage(message);
    setSelectedDate(date);
  };

  const handleCloseMessage = () => {
    setSelectedMessage(null);
    setSelectedDate(null);
  };

  if (isLoading && flowers.length === 0 && leaves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background-start to-background-end p-4 text-foreground">
        마음들을 불러오고 있습니다...
        <Sparkles className="animate-pulse text-accent mt-2 h-8 w-8" />
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
            <div className="flex justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <LeafButton
                onClick={handleLeafClick}
                isLoading={isCreatingLeaf}
              />
            </div>
          </div>
        </section>

        {/* 메시지 표시 섹션 */}
        <section className="relative z-10 px-4 pb-8 md:pb-12">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
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
                  onMessageClick={handleMessageClick}
                />
              </div>
            )}
          </div>
        </section>

        {/* 중앙 메시지 표시 */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCloseMessage}>
            <div className="bg-white/95 backdrop-blur-sm border border-pink-200/50 rounded-xl p-6 max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <p className="text-gray-800 leading-relaxed font-medium mb-2">
                {selectedMessage}
              </p>
              <p className="text-xs text-gray-500 opacity-80 font-light">
                {selectedDate}
              </p>
              <button 
                onClick={handleCloseMessage}
                className="mt-4 text-pink-500 hover:text-pink-600 text-sm font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        )}

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
