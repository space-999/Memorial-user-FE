
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Heart } from 'lucide-react';

interface MessageInputProps {
  onSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSubmit, isLoading }) => {
  const [message, setMessage] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative max-w-3xl mx-auto">
        <div className="search-input flex items-center p-2">
          <Heart className="w-6 h-6 text-pink-500 ml-4 flex-shrink-0 animate-gentle-float" />
          <input
            type="text"
            placeholder="소중한 마음을 담아 꽃으로 활짝 피워주세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-6 py-4 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-lg font-body"
            maxLength={200}
            disabled={isLoading}
            aria-label="추모 메시지 입력"
          />
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="heart-button mr-2 px-6 py-3 disabled:opacity-50 disabled:transform-none"
            size="sm"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline font-body font-medium">마음 남기기</span>
              </div>
            )}
          </Button>
        </div>
        <div className="text-sm text-gray-500 text-right mt-2 pr-4 font-body font-light">
          {message.length}/200자
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
