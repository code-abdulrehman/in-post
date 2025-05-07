import { useState, useRef, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import { useStore } from '../../store';

export default function ChatBot() {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const { canvasSize, canvasScale } = useStore();
  const [chatWidth, setChatWidth] = useState(canvasSize.width * canvasScale);

  // Update chat width when canvas size or scale changes
  useEffect(() => {
    setChatWidth(canvasSize.width * canvasScale);
  }, [canvasSize.width, canvasScale]);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Chat message:', message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div 
      className="fixed bottom-0 m-[10px] min-w-[350px] w-[555px] max-w-full p-1 bg-white border border-gray-300 rounded-2xl z-10"
      style={{
        // width: `${555}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '100%' 
      }}
    >
      <div className="">
        <div className="flex items-end p-1">
          <textarea
            ref={textareaRef}
            className="flex-1 rounded-l p-1 h-8 focus:h-[80px] transition-[height] duration-300 resize-none focus:border-none focus:outline-none text-md focus:text-black text-gray-400"
            placeholder="Your useful ideas here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSendMessage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-[36px] h-[36px] flex items-center justify-center transition-colors"
            aria-label="Send message"
            disabled={!message.trim()}
          >
            <IoSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
} 