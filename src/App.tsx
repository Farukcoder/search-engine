import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Message } from './types';
import { generateContent } from './services/gemini';
import { MessageBubble } from './components/MessageBubble';
import { LoadingDots } from './components/LoadingDots';
import { BackgroundEffect } from './components/BackgroundEffect';
import { Sidebar } from './components/Sidebar';

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messageCount: number;
  messages: Message[];
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Changed to true - sidebar open by default
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateConversationTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 6);
    return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
  };

  const saveCurrentConversation = useCallback(() => {
    if (messages.length === 0) return;

    const conversationId = activeConversationId || Date.now().toString();
    const title = generateConversationTitle(messages[0].content);
    
    const conversation: Conversation = {
      id: conversationId,
      title,
      timestamp: new Date(),
      messageCount: messages.length,
      messages: [...messages],
    };

    setConversations(prev => {
      const existing = prev.find(c => c.id === conversationId);
      if (existing) {
        return prev.map(c => c.id === conversationId ? conversation : c);
      }
      return [conversation, ...prev];
    });

    if (!activeConversationId) {
      setActiveConversationId(conversationId);
    }
  }, [messages, activeConversationId]);

  const handleNewConversation = () => {
    if (messages.length > 0) {
      saveCurrentConversation();
    }
    setMessages([]);
    setActiveConversationId(null);
    // Removed setSidebarOpen(false) to keep sidebar open
  };

  const handleSelectConversation = (id: string) => {
    if (messages.length > 0 && activeConversationId !== id) {
      saveCurrentConversation();
    }
    
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setMessages(conversation.messages);
      setActiveConversationId(id);
    }
    // Removed setSidebarOpen(false) to keep sidebar open on desktop
    // Only close on mobile screens
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setMessages([]);
      setActiveConversationId(null);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateContent(input.trim());
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to generate response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save conversation when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => {
        saveCurrentConversation();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, saveCurrentConversation]);
  return (
    <div className="min-h-screen transition-all duration-1000 dark">
      <BackgroundEffect />
      
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className={`relative z-10 flex flex-col h-screen transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-80' : 'ml-0'
      }`}>
        {/* Header */}
        <header className={`flex items-center justify-between p-6 ${sidebarOpen ? 'pl-6' : 'pl-20'} transition-all duration-300`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 bg-gradient-to-r from-cyan-400 to-purple-600 shadow-cyan-500/40">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-cyan-300 to-purple-400">
                TopnotchChat
              </h1>
              <p className="text-sm text-gray-300">
                AI-Powered Search Engine
              </p>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md mx-auto text-gray-300">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-300 bg-gradient-to-r from-cyan-500/25 to-purple-500/25 border-cyan-400/30 shadow-lg shadow-cyan-500/20">
                    <Sparkles className="w-10 h-10 text-cyan-300" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    Welcome to TopnotchChat
                  </h2>
                  <p className="text-sm leading-relaxed">
                    Experience the future of AI conversation. Ask me anything, and I'll provide intelligent, context-aware responses.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-6">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                  />
                ))}
                {isLoading && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/40 ring-2 ring-purple-400/20">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="p-4 rounded-2xl backdrop-blur-md border bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-600/40 text-gray-100 shadow-purple-500/10 shadow-lg">
                      <LoadingDots />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t backdrop-blur-md border-gray-700/50 bg-gray-900/20">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative rounded-2xl backdrop-blur-md border transition-all duration-300 focus-within:scale-[1.02] bg-gray-800/40 border-gray-600/40 focus-within:border-cyan-400/60 focus-within:shadow-xl focus-within:shadow-cyan-500/30">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full px-6 py-4 pr-16 rounded-2xl bg-transparent border-none outline-none resize-none min-h-[60px] max-h-32 text-gray-100 placeholder-gray-400"
                  rows={1}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center ${
                    input.trim() && !isLoading
                      ? 'bg-gradient-to-r text-white hover:scale-110 hover:shadow-xl from-cyan-400 to-purple-600 hover:shadow-cyan-500/50'
                      : 'cursor-not-allowed bg-gray-700/50 text-gray-500 border border-gray-600/30'
                  }`}
                >
                  {isLoading ? (
                    <LoadingDots />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              <div className="text-xs mt-2 text-center text-gray-400">
                Press Enter to send, Shift + Enter for new line
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;