import React, { useState, useEffect } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // Prefixes for different browsers

const VoiceDictation = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    const recognition = new SpeechRecognition();
    recognition.interimResults = true; // Update results as you speak
    recognition.lang = 'en-US'; // Set your preferred language

    recognition.onstart = () => {
      console.log('Voice recognition activated. Start speaking.');
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

      setText(transcript);
      if (event.results[0].isFinal) {
        setIsListening(false); // Stop listening when you stop speaking
        console.log('You stopped talking.');
      }
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Keep the recognition service running if isListening is true
      }
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  return (
    <div>
      <button onClick={() => setIsListening((prevState) => !prevState)}>
        {isListening ? 'Stop' : 'Start'} Listening
      </button>
      <p>{text}</p>
    </div>
  );
};

export default VoiceDictation;
