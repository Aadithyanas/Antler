import React, { useContext, useRef, useEffect, useState, memo } from "react";
import { datacontext } from "../context/AIContext";
import { FaVolumeUp } from 'react-icons/fa';

const UserRobot = memo(({ isVisible, animate }) => {
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        marginLeft: "8px",
        opacity: isVisible ? 1 : 0,
        transform: `scale(${isVisible ? 1 : 0.8}) translateX(${isVisible ? 0 : 10}px)`,
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f766e, #0d9488)",
          borderRadius: "12px",
          border: "2px solid rgba(20, 184, 166, 0.3)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "4px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          animation: animate ? "userRobotBounce 0.5s ease" : "none",
        }}
      >
        {/* Antenna */}
        <div
          style={{
            width: "6px",
            height: "6px",
            background: "#5eead4",
            borderRadius: "50%",
            margin: "-8px auto 0",
            boxShadow: "0 0 4px #5eead4",
          }}
        />
        {/* Eyes */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 4px" }}>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#5eead4",
              boxShadow: "0 0 4px #5eead4",
            }}
          />
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#5eead4",
              boxShadow: "0 0 4px #5eead4",
            }}
          />
        </div>
        {/* Mouth */}
        <div
          style={{
            width: "12px",
            height: "3px",
            background: "#5eead4",
            margin: "0 auto",
            borderRadius: "3px",
            boxShadow: "0 0 4px #5eead4",
            transform: "rotate(0deg)",
          }}
        />
      </div>
    </div>
  );
});

const AIRobot = memo(({ isVisible, animate }) => {
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        marginRight: "8px",
        opacity: isVisible ? 1 : 0,
        transform: `scale(${isVisible ? 1 : 0.8}) translateX(${isVisible ? 0 : -10}px)`,
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          borderRadius: "12px",
          border: "2px solid rgba(14, 165, 233, 0.3)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "4px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          animation: animate ? "aiRobotBounce 0.5s ease" : "none",
        }}
      >
        {/* Ears */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "-6px" }}>
          <div
            style={{
              width: "4px",
              height: "8px",
              background: "#38bdf8",
              borderRadius: "2px",
              marginLeft: "-2px",
              boxShadow: "0 0 4px #38bdf8",
            }}
          />
          <div
            style={{
              width: "4px",
              height: "8px",
              background: "#38bdf8",
              borderRadius: "2px",
              marginRight: "-2px",
              boxShadow: "0 0 4px #38bdf8",
            }}
          />
        </div>
        {/* Eyes */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 4px" }}>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#38bdf8",
              boxShadow: "0 0 4px #38bdf8",
            }}
          />
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#38bdf8",
              boxShadow: "0 0 4px #38bdf8",
            }}
          />
        </div>
        {/* Mouth */}
        <div
          style={{
            width: "12px",
            height: "3px",
            background: "#38bdf8",
            margin: "0 auto",
            borderRadius: "0 0 3px 3px",
            boxShadow: "0 0 4px #38bdf8",
          }}
        />
      </div>
    </div>
  );
});

const Message = memo(({ msg, sessionId, index, isLatestMessage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState(msg.text);
  const messageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, []);

  // Typing animation only for live AI responses (not for history)
  useEffect(() => {
    if (msg.type === 'ai' && isLatestMessage && isVisible) {
      setDisplayedText('');
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(msg.text.slice(0, i + 1));
        i++;
        if (i >= msg.text.length) clearInterval(interval);
      }, 18); // Adjust speed here (ms per character)
      return () => clearInterval(interval);
    } else {
      setDisplayedText(msg.text);
    }
  }, [msg.text, msg.type, isLatestMessage, isVisible]);

  // Speak handler for AI responses
  const handleSpeak = () => {
    if ('speechSynthesis' in window && msg.type === 'ai') {
      const utter = new window.SpeechSynthesisUtterance(msg.text);
      utter.lang = 'en-US';
      window.speechSynthesis.speak(utter);
    }
  };

  // Tailwind bubble classes - Modified for black background, white text, and blue borders
  const baseBubble =
    'px-4 py-3 rounded-2xl shadow-md text-sm font-medium transition-all duration-300 max-w-[80%] break-words border border-blue-500';
  const userBubble =
    baseBubble + ' bg-gray-900 text-gray-200 ml-auto rounded-br-md animate-fade-in';
  const aiBubble =
    baseBubble + ' bg-gray-900 text-gray-200 mr-auto rounded-bl-md animate-fade-in';
  const systemBubble =
    baseBubble + ' bg-gray-600 text-gray-200 mx-auto text-center animate-fade-in';

  return (
    <div
      ref={messageRef}
      key={`${sessionId}-${index}`}
      className={`flex items-end mb-2 ${
        msg.type === 'user' ? 'justify-end' : msg.type === 'system' ? 'justify-center' : 'justify-start'
      }`}
    >
      {msg.type === 'ai' && <AIRobot isVisible={isVisible} animate={isLatestMessage} />}
      <div
        className={
          msg.type === 'user'
            ? userBubble
            : msg.type === 'system'
            ? systemBubble
            : aiBubble
        }
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? 'translateY(0)'
            : msg.type === 'user'
            ? 'translateY(20px)'
            : 'translateY(-20px)',
          position: 'relative',
        }}
      >
        <p className="mb-1 text-xs font-semibold opacity-80">
          {msg.type === 'user' ? 'You' : msg.type === 'system' ? 'System' : 'Nexa'}
        </p>
        <p className="whitespace-pre-line">
          {msg.type === 'ai' ? displayedText : msg.text}
        </p>
        {/* Speak icon for AI responses */}
        {msg.type === 'ai' && (
          <button
            onClick={handleSpeak}
            className="absolute bottom-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors"
            title="Speak this response"
            style={{ lineHeight: 0 }}
          >
            <FaVolumeUp className="text-blue-300" size={16} />
          </button>
        )}
      </div>
      {msg.type === 'user' && <UserRobot isVisible={isVisible} animate={isLatestMessage} />}
    </div>
  );
});

const TypingBubble = () => (
  <div className="flex items-end mb-2 justify-start">
    <div className="px-4 py-3 rounded-2xl shadow-md text-sm font-medium max-w-[80%] bg-gray-500 text-gray-200 mr-auto rounded-bl-md animate-fade-in flex items-center gap-2 border border-blue-500">
      <span className="mb-1 text-xs font-semibold opacity-80">Nexa</span>
      <span className="flex gap-1 ml-2">
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
      </span>
    </div>
  </div>
);

function ChatArea({ sessionId }) {
  const { conversations, setConversations } = useContext(datacontext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    const fetchSessionMessages = async () => {
      if (!sessionId) {
        setConversations([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:3000/session/${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch session messages');
        
        const data = await response.json();
        
        if (data.chats && Array.isArray(data.chats)) {
          // Transform the flat chats array into conversation pairs
          const formattedMessages = [];
          data.chats.forEach(chat => {
            if (chat.message) {
              formattedMessages.push({ type: 'user', text: chat.message });
            }
            if (chat.response) {
              formattedMessages.push({ type: 'ai', text: chat.response });
            }
          });
          setConversations(formattedMessages);
        } else {
          setConversations([]);
        }
      } catch (err) {
        console.error('Error fetching session messages:', err);
        setError('Failed to load conversation history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionMessages();
  }, [sessionId, setConversations]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations]);

  if (isLoading) {
    return (
      <div style={{ 
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray'
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        backgroundColor: 'gray'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-10 gap-2 w-full h-[60vh] sm:h-[70vh] overflow-y-auto p-2 bg-gray-900 rounded-xl shadow-inner">
      {conversations && conversations.length > 0 ? (
        conversations.map((msg, idx) =>
          msg.type === 'ai-thinking' ? (
            <TypingBubble key={idx} />
          ) : (
            <Message
              key={idx}
              msg={msg}
              sessionId={sessionId}
              index={idx}
              isLatestMessage={idx === conversations.length - 1}
            />
          )
        )
      ) : (
        <div className="text-center text-gray-400 py-8">Hi Aadithyan <br />Start the conversation!</div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
}

export default memo(ChatArea);