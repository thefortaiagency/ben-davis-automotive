import Image from 'next/image';

interface ChatbotAvatarProps {
  size?: number;
  showOnline?: boolean;
}

export default function ChatbotAvatar({ size = 60, showOnline = true }: ChatbotAvatarProps) {
  return (
    <div className="relative inline-block">
      <Image
        src="/bendavis.jpg"
        alt="Ben Davis"
        width={size}
        height={size}
        className="rounded-full border-2 border-white shadow-lg object-cover"
      />
      {showOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
}