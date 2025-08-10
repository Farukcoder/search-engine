import React, { useEffect, useState } from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.role === 'assistant') {
      setIsTyping(true);
      setDisplayedContent('');
      let index = 0;
      const timer = setInterval(() => {
        if (index < message.content.length) {
          setDisplayedContent(message.content.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 20);
      return () => clearInterval(timer);
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, message.role]);

  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''} animate-slideUp`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-r from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-400/20' 
          : 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-500/40 ring-2 ring-purple-400/20'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      
      <div className={`max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
            isUser
              ? 'bg-gradient-to-br from-cyan-500/25 to-blue-600/25 border-cyan-400/40 text-cyan-50 shadow-cyan-500/20 hover:shadow-cyan-500/30'
              : 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-600/40 text-gray-100 shadow-purple-500/10 hover:shadow-purple-500/20'
          }`}
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {displayedContent}
            {isTyping && (
              <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />
            )}
          </div>
        </div>
        
        <div className={`text-xs mt-2 ${isUser ? 'text-right' : 'text-left'} text-gray-400`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};