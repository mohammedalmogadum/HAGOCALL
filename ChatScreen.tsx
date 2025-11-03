import React, { useState, useEffect, useRef } from 'react';
import type { Chat, Message } from '../types';
import { generateChatReplyStream } from '../services/geminiService';
import Icon from './Icon';

interface ChatScreenProps {
  chat: Chat;
  onBack: () => void;
  onMessagesUpdate: (chatId: string, messages: Message[]) => void;
}

const ChatBubble: React.FC<{ message: Message; isOwn: boolean; onRetry: () => void; }> = ({ message, isOwn, onRetry }) => {
  const bubbleClasses = isOwn
    ? 'bg-teal-600 text-white self-end rounded-br-none'
    : 'bg-slate-700 text-slate-200 self-start rounded-bl-none';

  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-xs md:max-w-md w-fit`}>
      <div className={`px-4 py-2 rounded-2xl ${bubbleClasses}`}>
        <p>{message.text}</p>
      </div>
      <div className="flex items-center space-x-2 mt-1 px-1">
        {isOwn && message.status === 'error' && (
           <button onClick={onRetry} className="text-red-500 hover:text-red-400">
             <Icon as="ExclamationCircle" className="w-4 h-4" />
           </button>
        )}
        <span className="text-xs text-slate-500">{message.timestamp}</span>
        {isOwn && message.status === 'sent' && <Icon as="CheckCircle" className="w-4 h-4 text-teal-400" />}
        {isOwn && message.status === 'sending' && <Icon as="Clock" className="w-4 h-4 text-slate-500" />}
      </div>
    </div>
  );
};


const ChatScreen: React.FC<ChatScreenProps> = ({ chat, onBack, onMessagesUpdate }) => {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent | null, messageText?: string) => {
    e?.preventDefault();
    const textToSend = (messageText || newMessage).trim();
    if (textToSend === '' || isLoading) return;

    setIsLoading(true);
    setNewMessage('');

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderId: 'user-1',
      status: 'sending',
    };
    
    const updatedMessagesWithUser = [...messages, userMessage];
    setMessages(updatedMessagesWithUser);

    try {
      const stream = generateChatReplyStream(updatedMessagesWithUser, chat.participant.name);

      const aiMessageId = `msg-${Date.now() + 1}`;
      const aiMessage: Message = {
        id: aiMessageId,
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderId: chat.participant.id,
      };
      
      // Add AI placeholder message to state.
      setMessages(prev => [...prev, aiMessage]);
      
      let fullReply = '';
      for await (const chunk of stream) {
        fullReply += chunk;
        // Update AI message text as it streams in
        setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: fullReply } : m));
      }
      
      // Final update: set user message to 'sent' and pass final list to parent
      setMessages(prev => {
          const finalMessageList = prev.map(m => 
              m.id === userMessage.id ? { ...m, status: 'sent' as const } : m
          );
          onMessagesUpdate(chat.id, finalMessageList);
          return finalMessageList;
      });
    } catch (error) {
      console.error("Failed to generate chat reply:", error);
      // Update user message to 'error' and pass final list to parent
      setMessages(prev => {
          const finalMessageList = prev.map(m => 
              m.id === userMessage.id ? { ...m, status: 'error' as const } : m
          );
          onMessagesUpdate(chat.id, finalMessageList);
          return finalMessageList;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (failedMessage: Message) => {
    setMessages(prev => prev.filter(m => m.id !== failedMessage.id));
    handleSendMessage(null, failedMessage.text);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="flex items-center p-3 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
        <button onClick={onBack} className="text-slate-300 hover:text-white me-3">
          <Icon as="ArrowLeft" className="w-6 h-6 transform scale-x-[-1]" />
        </button>
        <img src={chat.participant.avatarUrl} alt={chat.participant.name} className="w-10 h-10 rounded-full me-3" />
        <div className="flex-1">
          <h2 className="font-semibold text-white">{chat.participant.name}</h2>
          <p className="text-xs text-teal-400">متصل</p>
        </div>
        <div className="flex items-center space-x-4 text-slate-300">
          <button className="hover:text-white"><Icon as="Phone" className="w-6 h-6" /></button>
          <button className="hover:text-white"><Icon as="Video" className="w-6 h-6" /></button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col items-center text-center my-4">
            <Icon as="Lock" className="w-5 h-5 text-slate-500" />
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
                الرسائل مشفرة تمامًا بين الطرفين. لا يمكن لأي شخص خارج هذه الدردشة، ولا حتى HAGO، قراءتها.
            </p>
        </div>
        <div className="space-y-4 flex flex-col">
            {messages.map(msg => (
                <ChatBubble key={msg.id} message={msg} isOwn={msg.senderId === 'user-1'} onRetry={() => handleRetry(msg)} />
            ))}
            {isLoading && messages[messages.length-1]?.senderId === 'user-1' && (
                 <div className="self-start flex items-center space-x-2 p-4">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="p-2 border-t border-slate-700 bg-slate-800">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
           <button type="button" className="text-slate-400 hover:text-slate-300 p-2">
            <Icon as="Paperclip" className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالة..."
            className="flex-1 bg-slate-700 rounded-full px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button type="submit" className="text-teal-400 hover:text-teal-300 disabled:text-slate-600 p-2" disabled={isLoading || newMessage.trim() === ''}>
            <Icon as="Send" className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatScreen;