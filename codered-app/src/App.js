import React, { useState } from 'react';
import './App.css';
import VoiceDictation from './VoiceDictation'; // Ensure the path is correct

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isDictating, setIsDictating] = useState(false); // State to control dictation mode

  const handleSend = (text = input) => { // Allow sending dictated text directly
    const messageText = text.trim();
    if (messageText) {
      const newMessages = [...messages, { text: messageText, sender: 'user' }];
      setMessages(newMessages);
      setInput('');

      // Simulate a bot response
      setTimeout(() => {
        setMessages([...newMessages, { text: 'Hello! This is a basic response.', sender: 'bot' }]);
      }, 1000);
    }
  };

  // Function to handle dictated text
  const handleDictationResult = (dictatedText) => {
    handleSend(dictatedText);
    setIsDictating(false); // Turn off dictation mode after sending the message
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={`${process.env.PUBLIC_URL}/ARIA.png`} alt="Chatbot Logo" />
      </header>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
        <button onClick={() => setIsDictating(true)}>Dictate</button> {/* Button to toggle dictation mode */}
      </div>
      {isDictating && <VoiceDictation onDictationEnd={handleDictationResult} />} {/* Conditionally render VoiceDictation */}
    </div>
  );
}

export default App;
