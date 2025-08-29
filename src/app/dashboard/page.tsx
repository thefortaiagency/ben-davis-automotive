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

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<'ben' | 'brent'>('ben');
  const [showChatbot, setShowChatbot] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Dashboard metrics (would come from database in production)
  const [metrics] = useState({
    totalSales: 179,
    monthlyRevenue: 2400000,
    serviceAppointments: 255,
    customerSatisfaction: 92,
    inventoryCount: 342,
    leadConversions: 68
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/ben-davis-logo.jpg"
              alt="Ben Davis Logo"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ben Davis Automotive Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, Brent Davis</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Public Site
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Sales</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalSales}</p>
                <p className="text-sm text-green-600">+8.2% from last month</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${(metrics.monthlyRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600">+12.5% from last month</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Service Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.serviceAppointments}</p>
                <p className="text-sm text-green-600">+6.7% from last month</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.customerSatisfaction}%</p>
                <p className="text-sm text-green-600">+2.1% from last month</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.inventoryCount}</p>
                <p className="text-sm text-gray-600">vehicles in stock</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lead Conversion</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.leadConversions}%</p>
                <p className="text-sm text-green-600">+5.3% from last month</p>
              </div>
              <div className="bg-indigo-100 rounded-full p-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Chart & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              <p className="text-gray-500">Sales chart would go here</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New Chevrolet Silverado sold</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Service appointment scheduled</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 rounded-full p-2">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New customer lead from website</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance</h3>
          
          {/* Today and Week Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cars Sold Today</p>
                  <p className="text-3xl font-bold text-blue-900">12</p>
                  <p className="text-xs text-green-600 mt-1">+20% vs yesterday</p>
                </div>
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cars Sold This Week</p>
                  <p className="text-3xl font-bold text-green-900">67</p>
                  <p className="text-xs text-green-600 mt-1">+15% vs last week</p>
                </div>
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Daily Sales Chart */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Daily Sales This Week</h4>
            <div className="flex items-end justify-between h-32 px-2">
              <div className="flex flex-col items-center flex-1">
                <div className="bg-blue-500 rounded-t" style={{height: '60%', width: '80%'}}></div>
                <span className="text-xs mt-1">Mon</span>
                <span className="text-xs font-bold">8</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="bg-blue-500 rounded-t" style={{height: '80%', width: '80%'}}></div>
                <span className="text-xs mt-1">Tue</span>
                <span className="text-xs font-bold">11</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="bg-blue-500 rounded-t" style={{height: '70%', width: '80%'}}></div>
                <span className="text-xs mt-1">Wed</span>
                <span className="text-xs font-bold">9</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="bg-blue-500 rounded-t" style={{height: '100%', width: '80%'}}></div>
                <span className="text-xs mt-1">Thu</span>
                <span className="text-xs font-bold">15</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="bg-blue-600 rounded-t" style={{height: '90%', width: '80%'}}></div>
                <span className="text-xs mt-1 font-bold">Today</span>
                <span className="text-xs font-bold">12</span>
              </div>
              <div className="flex flex-col items-center flex-1 opacity-50">
                <div className="bg-gray-300 rounded-t" style={{height: '40%', width: '80%'}}></div>
                <span className="text-xs mt-1">Sat</span>
                <span className="text-xs">-</span>
              </div>
              <div className="flex flex-col items-center flex-1 opacity-50">
                <div className="bg-gray-300 rounded-t" style={{height: '40%', width: '80%'}}></div>
                <span className="text-xs mt-1">Sun</span>
                <span className="text-xs">-</span>
              </div>
            </div>
          </div>

          {/* Sales Team Stats */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Sales Team Performance</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">JM</div>
                  <div>
                    <p className="text-sm font-medium">Jake Miller</p>
                    <p className="text-xs text-gray-500">Senior Sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">5 cars</p>
                  <p className="text-xs text-green-600">Top Performer</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">ST</div>
                  <div>
                    <p className="text-sm font-medium">Sarah Thompson</p>
                    <p className="text-xs text-gray-500">Sales Associate</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">3 cars</p>
                  <p className="text-xs text-gray-600">Today</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">RD</div>
                  <div>
                    <p className="text-sm font-medium">Robert Davis</p>
                    <p className="text-xs text-gray-500">Sales Manager</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">2 cars</p>
                  <p className="text-xs text-gray-600">Today</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">MW</div>
                  <div>
                    <p className="text-sm font-medium">Mike Wilson</p>
                    <p className="text-xs text-gray-500">Sales Associate</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">2 cars</p>
                  <p className="text-xs text-gray-600">Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all"
      >
        {showChatbot ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <ChatbotAvatar size={56} />
        )}
      </button>

      {/* Chatbot Panel */}
      {showChatbot && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <ChatbotAvatar size={50} showOnline={false} />
              <div>
                <h3 className="font-bold text-lg">
                  {currentSpeaker === 'ben' ? 'Ben Davis (Founder)' : 'Brent Davis (CEO)'}
                </h3>
                <p className="text-sm opacity-90">Your AI Assistant</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {/* Quick Question Cards - Only show when no messages */}
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Quick Questions</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setInputValue("Who's the top sales person this month?");
                      handleSendMessage();
                    }}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all text-left"
                  >
                    <svg className="w-5 h-5 text-blue-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs font-medium text-gray-900">Top Sales Person</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </button>
                  
                  <button
                    onClick={() => {
                      setInputValue("What's our best selling vehicle model?");
                      handleSendMessage();
                    }}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all text-left"
                  >
                    <svg className="w-5 h-5 text-green-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-xs font-medium text-gray-900">Best Seller</p>
                    <p className="text-xs text-gray-500">#1 Vehicle</p>
                  </button>
                  
                  <button
                    onClick={() => {
                      setInputValue("Which vehicle had the highest profit margin?");
                      handleSendMessage();
                    }}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all text-left"
                  >
                    <svg className="w-5 h-5 text-purple-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs font-medium text-gray-900">Best Margin</p>
                    <p className="text-xs text-gray-500">Highest profit</p>
                  </button>
                  
                  <button
                    onClick={() => {
                      setInputValue("What's our customer satisfaction rating?");
                      handleSendMessage();
                    }}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all text-left"
                  >
                    <svg className="w-5 h-5 text-yellow-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <p className="text-xs font-medium text-gray-900">Satisfaction</p>
                    <p className="text-xs text-gray-500">Customer rating</p>
                  </button>
                  
                  <button
                    onClick={() => {
                      setInputValue("Show me year-over-year sales comparison");
                      handleSendMessage();
                    }}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all text-left"
                  >
                    <svg className="w-5 h-5 text-orange-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <p className="text-xs font-medium text-gray-900">YoY Sales</p>
                    <p className="text-xs text-gray-500">Annual trend</p>
                  </button>
                  
                  <button
                    onClick={() => {
                      setInputValue("What's our current inventory turnover rate?");
                      handleSendMessage();
                    }}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all text-left"
                  >
                    <svg className="w-5 h-5 text-red-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <p className="text-xs font-medium text-gray-900">Turnover Rate</p>
                    <p className="text-xs text-gray-500">Inventory</p>
                  </button>
                </div>
                
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-900 font-medium mb-1">💡 Pro Tip</p>
                  <p className="text-xs text-blue-700">Ask me anything about sales, inventory, customers, or financial performance!</p>
                </div>
              </div>
            )}
            
            {/* Message History */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 shadow-sm'
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
                <div className="bg-white rounded-lg p-3 shadow-sm">
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

          <div className="border-t p-4 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about metrics, customers, or operations..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}