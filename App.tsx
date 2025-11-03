import React, { useState, useEffect } from 'react';
import type { Chat } from './types';
import LoginScreen from './components/LoginScreen';
import ChatListScreen from './components/ChatListScreen';
import ChatScreen from './components/ChatScreen';

const generateInitialChats = (): Chat[] => {
  return [
    {
      id: '1',
      participant: { id: 'user-2', name: 'Aisha Al-Farsi', avatarUrl: 'https://picsum.photos/seed/aisha/200' },
      messages: [
        { id: 'msg-1', text: 'Hey, are you free for the meeting tomorrow?', timestamp: '10:30 AM', senderId: 'user-2' },
        { id: 'msg-2', text: 'Yes, I am! 2 PM works for me.', timestamp: '10:31 AM', senderId: 'user-1' },
      ],
    },
    {
      id: '2',
      participant: { id: 'user-3', name: 'Khalid Al-Mansoori', avatarUrl: 'https://picsum.photos/seed/khalid/200' },
      messages: [
        { id: 'msg-3', text: 'I\'ve sent you the documents. Please review them.', timestamp: 'Yesterday', senderId: 'user-3' },
      ],
    },
    {
      id: '3',
      participant: { id: 'user-4', name: 'Fatima Al-Nuaimi', avatarUrl: 'https://picsum.photos/seed/fatima/200' },
      messages: [
        { id: 'msg-4', text: 'Can you help me with the project? I am stuck.', timestamp: 'Yesterday', senderId: 'user-4' },
      ],
    },
     {
      id: '4',
      participant: { id: 'user-5', name: 'Omar Abdullah', avatarUrl: 'https://picsum.photos/seed/omar/200' },
      messages: [
        { id: 'msg-5', text: 'Let\'s catch up this weekend!', timestamp: 'Wednesday', senderId: 'user-1' },
         { id: 'msg-6', text: 'Sounds great! What time?', timestamp: 'Wednesday', senderId: 'user-5' },
      ],
    },
  ];
};


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    // Simulate loading chats after login
    if(isLoggedIn) {
      setChats(generateInitialChats());
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
  };

  const handleBackToList = () => {
    setActiveChat(null);
  };

  const updateChatMessages = (chatId: string, newMessages: any[]) => {
      setChats(prevChats => 
          prevChats.map(chat => 
              chat.id === chatId ? { ...chat, messages: newMessages } : chat
          )
      );
      if (activeChat && activeChat.id === chatId) {
          setActiveChat(prevActiveChat => prevActiveChat ? { ...prevActiveChat, messages: newMessages } : null);
      }
  };


  const renderContent = () => {
    if (!isLoggedIn) {
      return <LoginScreen onLogin={handleLogin} />;
    }
    if (activeChat) {
      return <ChatScreen key={activeChat.id} chat={activeChat} onBack={handleBackToList} onMessagesUpdate={updateChatMessages} />;
    }
    return <ChatListScreen chats={chats} onSelectChat={handleSelectChat} />;
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900 font-sans">
      <div className="w-full max-w-md h-full md:h-[95vh] md:max-h-[800px] bg-slate-900 text-white shadow-2xl rounded-lg overflow-hidden flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
