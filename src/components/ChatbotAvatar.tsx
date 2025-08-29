import Image from 'next/image';

interface ChatbotAvatarProps {
  size?: number;
  showOnline?: boolean;
}

export default function ChatbotAvatar({ size = 60, showOnline = true }: ChatbotAvatarProps) {
  return (
    <div className="relative inline-block">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse opacity-75 blur-md"></div>
      
      {/* Main avatar container */}
      <div className="relative rounded-full overflow-hidden border-3 border-white shadow-lg" 
           style={{ width: size, height: size }}>
        <Image
          src="/bendavis.jpg"
          alt="Ben Davis"
          width={size}
          height={size}
          className="object-cover"
          style={{
            filter: 'contrast(1.1) brightness(1.05)',
          }}
        />
        
        {/* Overlay to give it a friendly, stylized look */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
      </div>
      
      {/* Online indicator */}
      {showOnline && (
        <div className="absolute bottom-0 right-0 transform translate-x-1">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
            <div className="relative w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      )}
      
      {/* Chat bubble indicator */}
      <div className="absolute -bottom-1 -left-1">
        <div className="bg-white rounded-lg shadow-sm px-2 py-1 border border-gray-200">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}