import React, { createContext, useState } from 'react';
import run from '../GeminiApi';

export const datacontext = createContext();

function AIContext({ children }) {
  const [conversations, setConversations] = useState([]);
  const [status, setStatus] = useState("Ready");
  const [lastError, setLastError] = useState(null);
  const [sessionId, setSessionId] = useState(() => {
    return `session-${Date.now()}`;
  });

  async function saveChat(userMessage, aiResponse, sessionIdOverride) {
    try {
      await fetch('https://antler-4k4i.onrender.com/save-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'guest',
          session_id: sessionIdOverride || sessionId,
          message: userMessage,
          response: aiResponse,
        }),
      });
    } catch (error) {
      console.error("Error saving chat:", error);
      setLastError("Failed to save chat");
    }
  }

  async function aiResponse(prompt, sessionIdOverride) {
    setStatus("Processing");
    setConversations(prev => [...prev, { type: 'user', text: prompt }]);
    setConversations(prev => [...prev, { type: 'ai-thinking', text: '' }]);
    const useSessionId = sessionIdOverride || sessionId;
    try {
      // Prepare history for context (user/ai pairs)
      let history = [];
      // Use all previous messages except the last 'ai-thinking' if present
      const filtered = conversations.filter(m => m.type === 'user' || m.type === 'ai');
      for (let i = 0; i < filtered.length; i += 2) {
        const userMsg = filtered[i];
        const aiMsg = filtered[i + 1];
        if (userMsg && userMsg.type === 'user') {
          history.push({ role: 'user', parts: [{ text: userMsg.text }] });
        }
        if (aiMsg && aiMsg.type === 'ai') {
          history.push({ role: 'model', parts: [{ text: aiMsg.text }] });
        }
      }
      // Add the new user prompt
      history.push({ role: 'user', parts: [{ text: prompt }] });
      const text = await run(prompt, history);
      const cleaned = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/Google/gi, 'Nexa');
      setConversations(prev => [
        ...prev.slice(0, -1),
        { type: 'ai', text: cleaned }
      ]);
      setStatus("Ready");
      await saveChat(prompt, cleaned, useSessionId);
      return cleaned;
    } catch (error) {
      console.error("AI response error:", error);
      setLastError("Failed to get AI response");
      setStatus("Error");
      const errorMsg = "Sorry, I encountered an error processing your request.";
      setConversations(prev => [
        ...prev.slice(0, -1),
        { type: 'ai', text: errorMsg }
      ]);
      return errorMsg;
    }
  }

  const clearConversations = () => {
    setConversations([]);
    setSessionId(`session-${Date.now()}`);
  };

  const value = {
    aiResponse,
    status,
    conversations,
    setConversations,
    clearConversations,
    sessionId,
    setSessionId,
    lastError,
    setLastError
  };

  return (
    <datacontext.Provider value={value}>
      {children}
    </datacontext.Provider>
  );
}

export default AIContext;