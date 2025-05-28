
import React, { useState, useEffect } from 'react';
import { FlowerMessage, LeafMessage } from '@/types/memorial';
import { Heart, Sparkles } from 'lucide-react';

interface MessageDisplayProps {
  flowers: FlowerMessage[];
  leaves: LeafMessage[];
  onMessageHover: (message: string, date: string, event: React.MouseEvent) => void;
  onMessageLeave: () => void;
}

// 샘플 데이터 - 10개 꽃 메시지
const sampleFlowers: FlowerMessage[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  content: [
    "소중한 생명을 나누어주신 기증자님께 깊은 감사를 드립니다",
    "따뜻한 마음으로 생명을 구해주셔서 감사합니다",
    "당신의 선택이 새로운 희망이 되었습니다",
    "숭고한 뜻을 기리며 기도드립니다",
    "천사와 같은 마음에 존경을 표합니다",
    "영원히 기억될 아름다운 마음에 감사합니다",
    "생명의 선물을 주셔서 감사합니다",
    "당신의 사랑이 계속 이어집니다",
    "마음 깊이 감사드리며 기억하겠습니다",
    "고귀한 결정에 진심으로 감사합니다"
  ][i],
  createdAt: new Date(Date.now() - i * 1000 * 60 * 30).toISOString()
}));

// 샘플 데이터 - 15개 나뭇잎 메시지
const sampleLeaves: LeafMessage[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  content: [
    "감사합니다", "고마운 마음", "기억하겠습니다", "존경합니다", "마음을 전합니다",
    "따뜻한 위로", "소중한 선물", "아름다운 마음", "깊은 감동", "진심 어린 감사",
    "영원한 기억", "고귀한 뜻", "사랑합니다", "축복합니다", "평안하세요"
  ][i],
  createdAt: new Date(Date.now() - i * 1000 * 60 * 45).toISOString()
}));

const MessageDisplay: React.FC<MessageDisplayProps> = ({ 
  flowers, 
  leaves, 
  onMessageHover, 
  onMessageLeave 
}) => {
  const [hoveredMessage, setHoveredMessage] = useState<{message: string, date: string} | null>(null);
  
  // 실제 데이터가 없으면 샘플 데이터 사용
  const displayFlowers = flowers.length > 0 ? flowers : sampleFlowers;
  const displayLeaves = leaves.length > 0 ? leaves : sampleLeaves;

  console.log('Display flowers:', displayFlowers);
  console.log('Display leaves:', displayLeaves);

  // 꽃을 원형으로 배치하는 함수 (내부 원)
  const getFlowerPosition = (index: number, total: number) => {
    if (total === 1) return { x: 50, y: 50 };
    
    const angle = (index * 360) / total;
    const radius = 15; // 더 작은 내부 원
    const centerX = 50;
    const centerY = 50;
    
    const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
    const y = centerY + radius * Math.sin((angle * Math.PI) / 180);
    
    return { x, y };
  };

  // 나뭇잎을 꽃 주변에 원형으로 촘촘히 배치하는 함수 (외부 원)
  const getLeafPosition = (index: number, total: number) => {
    const angle = (index * 360) / total;
    const radius = 35; // 꽃보다 바깥쪽, 화관처럼
    const centerX = 50;
    const centerY = 50;
    
    const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
    const y = centerY + radius * Math.sin((angle * Math.PI) / 180);
    
    return { x, y };
  };

  // 나뭇잎마다 고유한 랜덤 회전값을 생성하는 함수
  const getLeafRotation = (id: number) => {
    const seed = id * 137.508;
    return (seed % 360) - 180;
  };

  const handleItemHover = (item: FlowerMessage | LeafMessage) => {
    const message = item.content || (item as any).message || '메시지가 없습니다';
    const date = new Date(item.createdAt).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    setHoveredMessage({ message, date });
  };

  const handleItemLeave = () => {
    setHoveredMessage(null);
  };

  return (
    <div className="message-container w-full h-[600px] relative overflow-hidden">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full blur-xl animate-gentle-float"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full blur-lg animate-gentle-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="absolute inset-0 p-6 md:p-16">
        {/* 나뭇잎 메시지들 - 꽃 주변에 화관처럼 배치 */}
        {displayLeaves.map((leaf, index) => {
          const position = getLeafPosition(index, displayLeaves.length);
          const rotation = getLeafRotation(leaf.id);
          
          return (
            <div
              key={leaf.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-fade-in z-10"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                animationDelay: `${(displayFlowers.length + index) * 0.15}s`,
              }}
            >
              {/* 나뭇잎 모양 메시지 */}
              <div 
                className="leaf-shape-message cursor-pointer hover:scale-110 transition-all duration-300"
                onMouseEnter={() => handleItemHover(leaf)}
                onMouseLeave={handleItemLeave}
              >
                <div className="relative w-24 h-28">
                  {/* 나뭇잎 모양 */}
                  <div 
                    className="w-full h-full bg-gradient-to-br from-emerald-200/90 to-green-300/80"
                    style={{
                      borderRadius: '0 100% 0 100%',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
                      transform: `rotate(${rotation}deg)`,
                    }}
                  >
                    {/* 나뭇잎 줄기 */}
                    <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-green-400/60 transform -translate-x-1/2 -translate-y-1/2 rotate-45 pointer-events-none"></div>
                    
                    {/* 나뭇잎 중앙 아이콘 */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* 꽃 메시지들 - 중앙에 원형으로 배치 */}
        {displayFlowers.map((flower, index) => {
          const position = getFlowerPosition(index, displayFlowers.length);
          
          return (
            <div
              key={flower.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-fade-in z-20"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              {/* 꽃 모양 메시지 */}
              <div 
                className="flower-shape-message cursor-pointer hover:scale-105 transition-all duration-300"
                onMouseEnter={() => handleItemHover(flower)}
                onMouseLeave={handleItemLeave}
              >
                {/* 꽃잎들 */}
                <div className="relative w-32 h-32">
                  {/* 5개 꽃잎을 원형으로 배치 */}
                  {[0, 1, 2, 3, 4].map((petalIndex) => (
                    <div
                      key={petalIndex}
                      className="absolute w-12 h-16 bg-gradient-to-br from-rose-200/90 to-pink-300/80 rounded-full transform origin-bottom"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -75%) rotate(${petalIndex * 72}deg)`,
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        boxShadow: '0 4px 15px rgba(251, 113, 133, 0.2)',
                      }}
                    />
                  ))}
                  
                  {/* 꽃 중앙 */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full border-2 border-orange-300/50 pointer-events-none">
                    <Heart className="w-5 h-5 text-rose-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 호버 시 메시지 모달 - 중앙 표시 */}
      {hoveredMessage && (
        <>
          {/* 어두운 오버레이 */}
          <div className="fixed inset-0 bg-black/50 z-[9998] pointer-events-none" />
          
          {/* 중앙 메시지 모달 */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm border border-pink-200/50 rounded-xl px-8 py-6 shadow-2xl max-w-md">
              <p className="text-gray-800 text-lg font-medium mb-3 text-center leading-relaxed">
                {hoveredMessage.message}
              </p>
              <p className="text-sm text-gray-500 opacity-80 font-light text-center">
                {hoveredMessage.date}
              </p>
            </div>
          </div>
        </>
      )}

      {/* 상태 표시 - 우측 하단 */}
      <div className="absolute bottom-6 right-6 z-30">
        <div className="glass-effect rounded-2xl px-6 py-3">
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span className="text-gray-700">{displayFlowers.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <span className="text-gray-700">{displayLeaves.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDisplay;
