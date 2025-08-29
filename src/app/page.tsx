'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ChatbotAvatar from '@/components/ChatbotAvatar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ben' | 'brent';
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<'ben' | 'brent'>('ben');
  const [showChatbot, setShowChatbot] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting from Ben
    setTimeout(() => {
      setMessages([{
        id: '1',
        text: "Well hello there! I'm Ben Davis. Welcome to our family dealership here in Auburn, Indiana. We've been serving this wonderful community since 1980. What brings you by today?",
        sender: 'ben',
        timestamp: new Date()
      }]);
    }, 1000);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          speaker: currentSpeaker,
        }),
      });

      const data = await response.json();
      
      // Check if we need to switch speakers
      if (data.switchSpeaker) {
        setCurrentSpeaker(data.switchSpeaker);
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: currentSpeaker,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Fallback response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        sender: currentSpeaker,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative h-80 sm:h-96 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/hero-image.jpg')`
          }}
        ></div>
        
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Ben Davis Automotive</h1>
              <p className="text-lg sm:text-xl font-light">Serving Auburn Since 1980</p>
            </div>
            
            <p className="text-xl sm:text-2xl mb-4 font-light">
              "More than a dealer, we believe in making a difference"
            </p>
            <p className="text-base sm:text-lg opacity-90 mb-6 sm:mb-8">
              Honoring Ben Davis's legacy (1937-2014) and Auburn's automotive heritage.
              Where classic Auburn Cord Duesenberg tradition meets modern family dealership excellence.
            </p>
            
            <div className="flex justify-center">
              <button 
                onClick={() => router.push('/dashboard')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                Owner Dashboard →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Centered Logo Below Hero */}
      <div className="flex justify-center py-8 bg-white">
        <Image
          src="/ben-davis-logo.jpg"
          alt="Ben Davis Automotive Logo"
          width={90}
          height={90}
          className="rounded-full border-4 border-white shadow-2xl ring-4 ring-white/30"
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cards Grid - 2x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Card 1 - Our Legacy */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 h-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Our Auburn Legacy</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
              Founded by Ben Davis (1937-2014), we've served Auburn and Northeast Indiana since 1980. 
              Three generations of the Davis family continue the tradition of treating every customer like family.
            </p>
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
              <p className="text-2xl sm:text-3xl font-bold text-blue-800">44+</p>
              <p className="text-xs sm:text-sm text-gray-600">Years of Service</p>
            </div>
          </div>

          {/* Card 2 - Why Choose Us */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 h-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose Ben Davis</h2>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xl sm:text-2xl flex-shrink-0">🏆</span>
                <p className="text-sm sm:text-base text-gray-700">4.7-star rating • 1,480+ reviews</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xl sm:text-2xl flex-shrink-0">👨‍👩‍👧‍👦</span>
                <p className="text-sm sm:text-base text-gray-700">3 generations of family service</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xl sm:text-2xl flex-shrink-0">🚗</span>
                <p className="text-sm sm:text-base text-gray-700">Chevrolet • Buick • Ford • RVs</p>
              </div>
            </div>
          </div>

          {/* Card 3 - Heritage */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 h-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Auburn Heritage</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
              Home of the Auburn Cord Duesenberg classics since 1900. We carry on Auburn's 
              legendary automotive tradition with modern excellence.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-4">
              <div className="bg-white rounded-lg p-2 sm:p-3 text-center">
                <p className="text-lg sm:text-2xl font-bold text-blue-800">1900</p>
                <p className="text-xs text-gray-600">Auburn Founded</p>
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 text-center">
                <p className="text-lg sm:text-2xl font-bold text-blue-800">1980</p>
                <p className="text-xs text-gray-600">We Opened</p>
              </div>
            </div>
          </div>

          {/* Card 4 - Awards */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 h-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Recognition</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                DeKalb County Business Hall of Fame
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                GM Dealer Excellence Award
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Ford Customer Satisfaction Excellence
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Community Leadership Award
              </li>
            </ul>
          </div>
        </div>

        {/* Full Width Location Card */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Visit Ben Davis Automotive</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div>
              <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Ben Davis Chevrolet-Buick</h3>
              <p className="mb-1 sm:mb-2 text-sm sm:text-base">📍 931 W 7th St, Auburn, IN 46706</p>
              <p className="mb-1 sm:mb-2 text-sm sm:text-base">📞 (855) 366-5595</p>
              <p className="text-xs sm:text-sm opacity-90">Sales: Mon-Sat 9AM-7PM</p>
              <p className="text-xs sm:text-sm opacity-90">Service: Mon-Fri 8:30AM-6PM</p>
            </div>
            <div className="mt-4 md:mt-0">
              <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Ben Davis Ford</h3>
              <p className="mb-1 sm:mb-2 text-sm sm:text-base">📍 400 S Grandstaff Dr, Auburn, IN 46706</p>
              <p className="mb-1 sm:mb-2 text-sm sm:text-base">📞 (855) 388-2635</p>
              <p className="text-xs sm:text-sm opacity-90">Sales: Mon-Sat 9AM-7PM</p>
              <p className="text-xs sm:text-sm opacity-90">Service: Mon-Fri 8:30AM-6PM</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20 text-center">
            <p className="text-base sm:text-lg mb-1 sm:mb-2">🚗 Easy Access from I-69 Exit 329</p>
            <p className="text-xs sm:text-sm opacity-90">Just 10 minutes north of Fort Wayne • Free customer parking • Full service departments</p>
          </div>
        </div>
      </main>

      {/* Floating Chatbot Button (like dashboard) */}
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all z-50"
      >
        {showChatbot ? (
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <ChatbotAvatar size={36} showOnline={false} />
        )}
      </button>

      {/* Floating Chatbot Panel (like dashboard) */}
      {showChatbot && (
        <div className="fixed bottom-24 right-2 sm:right-6 w-[calc(100vw-1rem)] sm:w-96 max-w-96 h-[500px] sm:h-[600px] bg-white rounded-lg shadow-2xl flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <ChatbotAvatar size={50} showOnline={false} />
              <div>
                <h3 className="font-bold text-lg">
                  Chat with {currentSpeaker === 'ben' ? 'Ben Davis (Founder)' : 'Brent Davis (CEO)'}
                </h3>
                <p className="text-sm opacity-90">
                  Ask about our history, values, or how we can help you
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.sender !== 'user' && (
                    <p className="text-xs font-medium mb-1 text-blue-600">
                      {message.sender === 'ben' ? 'Ben Davis' : 'Brent Davis'}
                    </p>
                  )}
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Tip: Mention "Brent" to speak with the current CEO
            </p>
          </div>
        </div>
      )}
    </div>
  );
}