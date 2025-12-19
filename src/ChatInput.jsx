import React, { useRef } from 'react';

const ChatInput = ({ setChatHistory, chatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();

    if (!userMessage) return;

    setChatHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    inputRef.current.value = '';

    setChatHistory((prev) => [...prev, { role: "model", text: "Thinking..." }]);

    // Remove "Thinking..." placeholder after bot replies
    setTimeout(() => {
      setChatHistory((prev) => prev.slice(0, -1));
      generateBotResponse([...chatHistory, { role: "user", text: userMessage }], setChatHistory);
    },100);
  };

  return (
    <form className="p-4 border-t border-gray-300" onSubmit={handleFormSubmit}>
      <div className="flex">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          placeholder="Type your message here..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-blue-600 transition duration-200"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
