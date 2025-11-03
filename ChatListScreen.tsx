import React from 'react';
import type { Chat } from '../types';
import Icon from './Icon';

interface ChatListScreenProps {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
}

const ChatListItem: React.FC<{ chat: Chat; onSelect: () => void }> = ({ chat, onSelect }) => {
  const lastMessage = chat.messages[chat.messages.length - 1];
  return (
    <li
      onClick={onSelect}
      className="flex items-center p-4 hover:bg-slate-800 cursor-pointer transition-colors duration-200"
    >
      <div className="relative">
        <img src={chat.participant.avatarUrl} alt={chat.participant.name} className="w-12 h-12 rounded-full" />
        {/* Hardcoded online indicator for demo */}
        {chat.id === '1' && <span className="absolute bottom-0 end-0 block h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-slate-900" />}
      </div>
      <div className="flex-1 overflow-hidden me-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-100 truncate">{chat.participant.name}</h3>
          <p className="text-xs text-slate-400">{lastMessage?.timestamp}</p>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-slate-400 truncate">{lastMessage?.text}</p>
           {/* Hardcoded unread badge for demo */}
          {chat.id === '2' && (
            <span className="bg-teal-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

const ChatListScreen: React.FC<ChatListScreenProps> = ({ chats, onSelectChat }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="flex items-center justify-between p-4 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 space-x-4">
        <h1 className="text-xl font-bold text-white">المحادثات</h1>
        <div className="relative flex-1">
            <input type="text" placeholder="بحث..." className="w-full bg-slate-700 border border-slate-600 rounded-full py-1.5 ps-10 pe-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                <Icon as="Search" className="w-5 h-5 text-slate-400" />
            </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <ul>
          {chats.map(chat => (
            <ChatListItem key={chat.id} chat={chat} onSelect={() => onSelectChat(chat)} />
          ))}
        </ul>
      </div>
       <button className="absolute bottom-6 end-6 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110">
          <Icon as="Plus" className="w-7 h-7" />
        </button>
    </div>
  );
};

export default ChatListScreen;