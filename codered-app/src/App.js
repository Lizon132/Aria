import React, { useState } from 'react';
import './App.css';
import VoiceDictation from './VoiceDictation'; // Ensure the path is correct
import MarkdownView from 'react-showdown';

function App() {
  const [messages, setMessages] = useState([{ text: "Welcome to our travel agency! We are delighted to have you here and eager to assist you in planning your next adventure. Whether you're seeking a relaxing beach getaway, an exciting city exploration, or a cultural immersion in a far-off land, we're here to make your travel dreams a reality. Our team of friendly and experienced travel agents is dedicated to providing you with personalized assistance every step of the way. From finding the perfect flight options to arranging accommodations and activities, we're committed to ensuring your journey is smooth and memorable. Get ready to embark on an unforgettable travel experience, and let us help you create memories that will last a lifetime. We look forward to assisting you!\n\n Please provide us with the following details:\n\nPersonal Information:\n\n\tFull Name:\n\n\tEmail Address:\n\n\tContact Number:\n\nTravel Details:\n\n\tDeparture City:\n\n\tDestination City:\n\n\tDeparture Date (YYYY-MM-DD):\n\n\tPreferred Departure Time:\n\n\tNumber of Travelers (Adults, Children, Infants):\n\n\tTraveler Type (e.g., Adult, Child, Infant):\n\n\tCabin Preference (e.g., Economy, Business, First Class):\n\nAdditional Preferences:\n\n\tFlexibility in Dates (If any):\n\n\tMaximum Number of Flight Offers to Consider:\n\n\tAny Specific Airlines Preferred or Avoided:\n\nBudget and Currency:\n\n\tPreferred Currency:\n\n\tBudget Range (per person):\n\n\tMinimum:\n\n\tMaximum:\n\nContact Preferences:\n\n\tPreferred Mode of Contact (Email, Phone):\n\n\tPreferred Time for Contact:\n\n\tAdditional Comments or Special Requests:", sender: 'bot' }]);
  const [question, setCurrentQuestion] = useState(messages[0].text);
  const [input, setInput] = useState('');
  const [isDictating, setIsDictating] = useState(false); // State to control dictation mode
  const continueToGemini = true;

// todo: make the JSON extractor function
  const makeJSON = (inputString) => {
    const firstIndex = inputString.indexOf('{');
    const lastIndex = inputString.lastIndexOf('}');
    
    if (firstIndex === -1 || lastIndex === -1 || firstIndex >= lastIndex) {
        return { extractedContent: '', remainingString: inputString }; // No curly brackets found or invalid arrangement
    }

    const extractedContent = inputString.substring(firstIndex + 1, lastIndex);
    // const remainingString = inputString.substring(0, firstIndex) + inputString.substring(lastIndex + 1);
    // Define regular expressions to match Markdown-like characters
    const markdownRegex = /(\n|\r|\t|<br\s*\/?>|\[([^\]]+)\]\([^)]+\))/gi;

    // Replace Markdown-like characters with an empty string
    const cleanedString = extractedContent.replace(markdownRegex, '');

    return "{"+cleanedString+"}";
  }

  //complete: the handleSend function that fires when the user response is submitted.
  const handleSend = () => { // Allow sending dictated text directly
    const messageText = input.trim();
    if (messageText && !continueToGemini) {
      const newMessages = [...messages, { text: messageText, sender: 'user' }];
      setMessages(newMessages);
      setInput('');
      const userInput = newMessages[newMessages.length-1].text;
      console.log(userInput);

    }
    else if (messageText && continueToGemini) {
      const newMessages = [...messages, { text: messageText, sender: 'user' }];
      setMessages(newMessages);
      setInput('');
      

      const userInput = newMessages[newMessages.length-1].text;
      const asyncResult = window.electron.doThing(`Please summarize the users travel request in ${newMessages[newMessages.length-1].text} with the response: ${userInput}. Write like you are addressing the client, so please make the statement in a natural language form of a native english speaker. Write it in full sentences like someone dictated the information. Conclude the summary portion with the statement: "I'll get back to you with the best options that meet your budget and preferences."
      
      If possible please restate the facts to confirm that you are understanding the question. Finally and most importantly please generate a JSON text that follows this form for Amadeaus API: Please only include the raw JSON format and ALWAYS ENSURE THAT THE ',' AND '}' ARE FOLLOWING THE JSON STANDARDS - keep the codeblock enclosed by \`\`\`. **the time format must be in the HH:MM:SS
      {
        "currencyCode": "USD",
        "originDestinations": [
          {
            "id": "1",
            "originLocationCode": "NYC",
            "destinationLocationCode": "MAD",
            "departureDateTimeRange": {
              "date": "2023-11-01",
              "time": "10:00:00"
            }
          }
        ],
        "travelers": [
          {
            "id": "1",
            "travelerType": "ADULT"
          }
        ],
        "sources": [
          "GDS"
        ],
        "searchCriteria": {
          "maxFlightOffers": 2,
          "flightFilters": {
            "cabinRestrictions": [
              {
                "cabin": "BUSINESS",
                "coverage": "MOST_SEGMENTS",
                "originDestinationIds": [
                  "1"
                ]
              }
            ]
          }
        }
      }`)
      .then((response) => {
        if(response) {
          // Use a regular expression to match everything between ``` quotes
          const fileJSON = JSON.parse(makeJSON(response));
          const runPython = (json) => {
            window.electron.doPython(json)
          }
          runPython(fileJSON);
          const stringResponse = response.replace(/```[^`]+```/g, '');
          // This function will be executed when the promise is fulfilled
        setMessages([...newMessages, { text: stringResponse, sender: 'bot' }]); // Assuming response contains the data you need to pass to setMessages
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
