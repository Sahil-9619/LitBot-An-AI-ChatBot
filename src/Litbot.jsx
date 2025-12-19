import React, { useState } from 'react';
import ChatInput from './ChatInput';
import { marked } from 'marked'; // Add this to top


// Reusable component for bot messages
const BotMessage = ({ message }) => (
  <div className="flex items-start mb-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
      🤖
    </div>
    <div className="bg-gray-200 p-3 rounded-lg max-w-2xl prose prose-sm prose-blue">
      <div dangerouslySetInnerHTML={{ __html: marked.parse(message) }} />
    </div>
  </div>
);

// Reusable component for user messages
const UserMessage = ({ message }) => (
  <div className="flex items-start justify-end mb-4">
    <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-xl">
      <p>{message}</p>
    </div>
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold ml-3">
      You
    </div>
  </div>
);

// Function to call Gemini API
const generateBotResponse = async (history, setChatHistory) => {
  const formattedHistory = history.map(({ role, text }) => ({
    role,
    parts: [{ text }],
  }));

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: formattedHistory }),
  };

  try {
    const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error?.message || "Something went wrong!");

    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

    setChatHistory((prev) => [
      ...prev,
      { role: 'model', text: botReply }
    ]);
  } catch (err) {
    console.error(err);
    setChatHistory((prev) => [
      ...prev,
      { role: 'model', text: "Oops! Something went wrong." }
    ]);
  }
};

// Main Litbot component
const Litbot = () => {
  const [chatHistory, setChatHistory] = useState([]);

  return (
    <div className="flex h-screen bg-gray-100 antialiased text-gray-900">
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">AI Litbot</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          {chatHistory.map((msg, index) =>
            msg.role === 'model' ? (
              <BotMessage key={index} message={msg.text} />
            ) : (
              <UserMessage key={index} message={msg.text} />
            )
          )}
        </div>
        <ChatInput setChatHistory={setChatHistory} chatHistory={chatHistory} generateBotResponse={generateBotResponse} />
      </div>
    </div>
  );
};

export default Litbot;
