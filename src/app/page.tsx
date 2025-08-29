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
      <section className="relative h-96 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
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
              <h1 className="text-5xl font-bold mb-2">Ben Davis Automotive</h1>
              <p className="text-xl font-light">Serving Auburn Since 1980</p>
            </div>
            
            <p className="text-2xl mb-4 font-light">
              "More than a dealer, we believe in making a difference"
            </p>
            <p className="text-lg opacity-90 mb-8">
              Honoring Ben Davis's legacy (1937-2014) and Auburn's automotive heritage.
              Where classic Auburn Cord Duesenberg tradition meets modern family dealership excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg">
                View Inventory
              </button>
              <button className="px-8 py-3 bg-white hover:bg-gray-100 text-blue-900 font-semibold rounded-lg transition-colors shadow-lg">
                Schedule Service
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                Owner Dashboard →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Centered Logo Below Hero */}
      <div className="flex justify-center -mt-12 relative z-20">
        <Image
          src="/ben-davis-logo.jpg"
          alt="Ben Davis Automotive Logo"
          width={90}
          height={90}
          className="rounded-full border-4 border-white shadow-2xl ring-4 ring-white/30"
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Story & History */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Auburn Legacy</h2>
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 mb-4 text-lg">
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

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Auburn: Home of the Classics</h3>
              <p className="text-gray-700 mb-4">
                Auburn's automotive story began in 1900 with the Auburn Automobile Company. At its 
                peak, the company sold 34,000 cars annually through 100+ international dealers. 
                Though the Great Depression ended production in 1937, Auburn's automotive spirit 
                lives on through the Auburn Cord Duesenberg Museum and businesses like ours.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-3xl font-bold text-blue-600">1900</p>
                  <p className="text-sm text-gray-600">Auburn Auto Founded</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-3xl font-bold text-blue-600">1980</p>
                  <p className="text-sm text-gray-600">Ben Davis Opens</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-3xl font-bold text-blue-600">44+</p>
                  <p className="text-sm text-gray-600">Years Serving Auburn</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-3xl font-bold text-blue-600">3</p>
                  <p className="text-sm text-gray-600">Generations Strong</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Commitment</h3>
              <p className="text-gray-700 mb-4">
                The Ben Davis Memorial Fund, managed by the Community Foundation DeKalb County, 
                continues Ben's philanthropic legacy. We sponsor local events, support schools, 
                and invest in Auburn's future because this community has given us everything.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-6 mt-4">
                <h4 className="font-bold text-lg text-blue-900 mb-2">Awards & Recognition</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• DeKalb County Business Hall of Fame (2012)</li>
                  <li>• General Motors Dealer Excellence Award</li>
                  <li>• Ford Customer Satisfaction Excellence</li>
                  <li>• Community Leadership Award</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Values & Features */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Ben Davis</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Award-Winning Service</h4>
                    <p className="text-gray-600">4.7-star rating with over 1,480+ customer reviews. Excellence recognized by GM and Ford.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👨‍👩‍👧‍👦</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Family Values</h4>
                    <p className="text-gray-600">Three generations committed to treating every customer like family since 1980.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Local Heritage</h4>
                    <p className="text-gray-600">Born and raised in Auburn, committed to our community's automotive legacy.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Complete Selection</h4>
                    <p className="text-gray-600">Chevrolet, Buick, Ford, and Northern Indiana's fastest-growing RV dealership.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-6">
                <h4 className="font-bold text-xl mb-4">Visit Our Locations</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold">Ben Davis Chevrolet-Buick</p>
                    <p className="text-sm opacity-90">931 W 7th St, Auburn, IN</p>
                    <p className="text-sm opacity-90">(855) 366-5595</p>
                  </div>
                  <div>
                    <p className="font-semibold">Ben Davis Ford</p>
                    <p className="text-sm opacity-90">400 S Grandstaff Dr, Auburn, IN</p>
                    <p className="text-sm opacity-90">(855) 388-2635</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl shadow-lg p-6">
                <h4 className="font-bold text-xl text-green-900 mb-2">Customer Excellence</h4>
                <p className="text-3xl font-bold text-green-600 mb-2">4.7 ⭐</p>
                <p className="text-green-700 mb-4">1,480+ Reviews</p>
                <div className="text-sm text-green-700">
                  <p><strong>Service Hours:</strong></p>
                  <p>Mon-Fri: 8:30 AM - 6:00 PM</p>
                  <p>Just off I-69 at exit 329</p>
                  <p>10 minutes north of Fort Wayne</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chatbot Button (like dashboard) */}
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all"
      >
        {showChatbot ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <ChatbotAvatar size={40} showOnline={false} />
        )}
      </button>

      {/* Floating Chatbot Panel (like dashboard) */}
      {showChatbot && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col">
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