'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/ben-davis-logo.jpg"
              alt="Ben Davis Logo"
              width={60}
              height={60}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ben Davis Automotive</h1>
              <p className="text-sm text-gray-600">Serving Auburn Since 1980</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">"More than a dealer,</p>
            <p className="text-sm font-medium text-blue-600">we believe in making a difference"</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Story & History */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Auburn Legacy</h2>
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 mb-4">
                  Welcome to Ben Davis Automotive, where three generations of the Davis family have 
                  served Auburn and Northeast Indiana with pride since 1980. Founded by Ben Davis 
                  (1937-2014), our dealerships embody the entrepreneurial spirit and automotive 
                  heritage that makes Auburn the "Home of the Classics."
                </p>
                <p className="text-gray-700 mb-4">
                  Ben Davis saw an opportunity in 1980 when he purchased the former Rohm dealership, 
                  establishing Ben Davis Chevrolet. His vision was simple yet profound: treat every 
                  customer like family. This philosophy earned him induction into the DeKalb County 
                  Business Hall of Fame in 2012.
                </p>
                <p className="text-gray-700 mb-4">
                  Today, under the leadership of CEO Brent Davis, we operate Ben Davis Chevrolet-Buick, 
                  Ben Davis Ford, and the fastest-growing RV dealership in Northern Indiana. The third 
                  generation of the Davis family is now involved, ensuring our commitment to Auburn 
                  continues for decades to come.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Auburn: Home of the Classics</h3>
              <p className="text-gray-700 mb-3">
                Auburn's automotive story began in 1900 with the Auburn Automobile Company. At its 
                peak, the company sold 34,000 cars annually through 100+ international dealers. 
                Though the Great Depression ended production in 1937, Auburn's automotive spirit 
                lives on through the Auburn Cord Duesenberg Museum and businesses like ours.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white rounded p-3">
                  <p className="text-2xl font-bold text-blue-600">1900</p>
                  <p className="text-sm text-gray-600">Auburn Auto Founded</p>
                </div>
                <div className="bg-white rounded p-3">
                  <p className="text-2xl font-bold text-blue-600">1980</p>
                  <p className="text-sm text-gray-600">Ben Davis Opens</p>
                </div>
                <div className="bg-white rounded p-3">
                  <p className="text-2xl font-bold text-blue-600">44+</p>
                  <p className="text-sm text-gray-600">Years Serving Auburn</p>
                </div>
                <div className="bg-white rounded p-3">
                  <p className="text-2xl font-bold text-blue-600">3</p>
                  <p className="text-sm text-gray-600">Generations Strong</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Commitment</h3>
              <p className="text-gray-700">
                The Ben Davis Memorial Fund, managed by the Community Foundation DeKalb County, 
                continues Ben's philanthropic legacy. We sponsor local events, support schools, 
                and invest in Auburn's future because this community has given us everything.
              </p>
            </div>
          </div>

          {/* Right Column - Chatbot */}
          <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <Image
                  src="/bendavis.jpg"
                  alt={currentSpeaker === 'ben' ? "Ben Davis" : "Brent Davis"}
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-white"
                />
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>

        {/* Bottom Section - Key Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h4 className="font-bold text-lg text-gray-900 mb-2">Our Locations</h4>
            <p className="text-sm text-gray-600">Ben Davis Chevrolet-Buick</p>
            <p className="text-sm text-gray-600">931 W 7th St, Auburn</p>
            <p className="text-sm text-gray-600 mt-2">Ben Davis Ford</p>
            <p className="text-sm text-gray-600">400 S Grandstaff Dr, Auburn</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h4 className="font-bold text-lg text-gray-900 mb-2">Contact Us</h4>
            <p className="text-sm text-gray-600">Chevrolet: (855) 366-5595</p>
            <p className="text-sm text-gray-600">General: (855) 388-2635</p>
            <p className="text-sm text-gray-600 mt-2">Just off I-69 at exit 329</p>
            <p className="text-sm text-gray-600">10 minutes north of Fort Wayne</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h4 className="font-bold text-lg text-gray-900 mb-2">Customer Excellence</h4>
            <p className="text-2xl font-bold text-blue-600">4.7 ⭐</p>
            <p className="text-sm text-gray-600">1,480+ Reviews</p>
            <p className="text-sm text-gray-600 mt-2">Service Hours:</p>
            <p className="text-sm text-gray-600">Mon-Fri: 8:30 AM - 6:00 PM</p>
          </div>
        </div>
      </main>
    </div>
  );
}