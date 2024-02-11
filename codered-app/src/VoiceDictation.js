import { useState, useEffect } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceDictation = ({ onDictationEnd }) => {
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof SpeechRecognition !== "undefined") {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true; // Keep listening even if the user pauses, until explicitly stopped
      recognitionInstance.interimResults = true; // Report results that are not yet final
      recognitionInstance.lang = 'en-US'; // Set the language

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        console.log(transcript);
        if (event.results[0].isFinal) {
          onDictationEnd(transcript); // Pass final transcript to parent component
        }
      };

      recognitionInstance.onspeechend = () => {
        // This event is triggered when the user stops speaking
        console.log("Speech has stopped.");
        recognitionInstance.stop(); // Stop the recognition instance
      };

      recognitionInstance.onend = () => {
        // This event is triggered when the recognition service is stopped
        console.log("Speech recognition service disconnected.");
      };

      // Start recognition
      recognitionInstance.start();

      // Set the recognition instance so it can be stopped when the component unmounts
      setRecognition(recognitionInstance);
    } else {
      console.log("SpeechRecognition is not supported in this browser.");
    }

    return () => {
      // Cleanup: stop recognition when the component unmounts
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onDictationEnd]); // Ensure to include dependencies correctly

  return null; // This component does not render anything
};

export default VoiceDictation;
