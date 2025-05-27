
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';

interface LeafButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const LeafButton: React.FC<LeafButtonProps> = ({ onClick, isLoading }) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white font-display font-medium px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl text-lg"
      aria-label="따뜻한 마음 전하기"
      title="클릭하면 자동으로 감사의 마음이 전달됩니다"
      style={{
        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
      }}
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>마음 전달중...</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="relative">
            <Heart className="w-5 h-5" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 animate-sparkle" />
          </div>
          <span>따뜻한 마음 전하기</span>
        </div>
      )}
    </Button>
  );
};

export default LeafButton;
