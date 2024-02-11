import React, { useState } from 'react';
import './App.css';
import VoiceDictation from './VoiceDictation'; // Ensure the path is correct
import MarkdownView from 'react-showdown';

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

      const runPython = () => {
        window.electron.doPython()
      }
      runPython();

      const userInput = newMessages[newMessages.length-1].text;
      const asyncResult = window.electron.doThing(userInput)
      window.electron.doThing(userInput)
      .then((response) => {
        if(response) {
          // This function will be executed when the promise is fulfilled
        setMessages([...newMessages, { text: response, sender: 'bot' }]); // Assuming response contains the data you need to pass to setMessages
        console.log(response);
        }
        else {
          // Handle the case where 'parts' property is undefined
          console.error("Error: 'parts' property is undefined");
        }
      })
      .catch((error) => {
        // This function will be executed if there's an error in the promise chain
        console.error('Error:', error);
      });




      // // Simulate a bot response
      // setTimeout(() => {
      //   setMessages([...newMessages, { text: 'Hello! This is a basic response Isaac.', sender: 'bot' }]);
      // }, 1000);
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
            <MarkdownView
              markdown={message.text}
              options={{ tables: true, emoji: true }}
            />
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          autoFocus
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
