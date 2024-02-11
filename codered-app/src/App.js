import React, { useState } from 'react';
import './App.css';
import VoiceDictation from './VoiceDictation'; // Ensure the path is correct
import MarkdownView from 'react-showdown';

function App() {
  const questions = { 0:"What are your preferred date and time for travel? Are you flexible with these times, and if so, to what extent?", 1:"Do you prefer the quickest travel option available, or are you open to longer durations if it offers cost savings?", 2:"How important is price in determining your travel option? What is your budget range?"};

  // const i;
  const [messages, setMessages] = useState([{ text: "<div>Welcome to our travel agency! We are delighted to have you here and eager to assist you in planning your next adventure. Whether you're seeking a relaxing beach getaway, an exciting city exploration, or a cultural immersion in a far-off land, we're here to make your travel dreams a reality. Our team of friendly and experienced travel agents is dedicated to providing you with personalized assistance every step of the way. From finding the perfect flight options to arranging accommodations and activities, we're committed to ensuring your journey is smooth and memorable. Get ready to embark on an unforgettable travel experience, and let us help you create memories that will last a lifetime. We look forward to assisting you!</div><br></br><div>Please provide us with the following details:Personal Information:Full Name:Email Address:Contact Number:Travel Details:Departure City:Destination City:Departure Date (YYYY-MM-DD):Preferred Departure Time:Number of Travelers (Adults, Children, Infants):Traveler Type (e.g., Adult, Child, Infant):Cabin Preference (e.g., Economy, Business, First Class):Additional Preferences:Flexibility in Dates (If any):Maximum Number of Flight Offers to Consider:Any Specific Airlines Preferred or Avoided:Budget and Currency:Preferred Currency:Budget Range (per person):Minimum:Maximum:Contact Preferences:Preferred Mode of Contact (Email, Phone):Preferred Time for Contact:Additional Comments or Special Requests:</div>", sender: 'bot' }]);
  const [question, setCurrentQuestion] = useState(messages[0].text);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState('');
  const [answers2, setAnswers2] = useState('');
  const [answers3, setAnswers3] = useState('');
  const [isDictating, setIsDictating] = useState(false); // State to control dictation mode
  const continueToGemini = true;
  const JSONanswers = {
    "date_and_time": answers ,
    "travel_duration": answers2,
    "price_sensitivity":answers3, 
  }

  
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
  const handleInput = (a) => {
    console.log(a);
  }

  const handleSend = () => { // Allow sending dictated text directly
    const messageText = input.trim();
    if (messageText && continueToGemini) {
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
          const runPython = (json, answers) => {
            window.electron.doPython(json, answers)
          }
          
        
          runPython(fileJSON, JSONanswers);
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
    <div className="container mx-auto px-4 font-sans ">
      <header className="App-header">
      <img className="max-h-36" src={`${process.env.PUBLIC_URL}/ARIA.png`} alt="Chatbot Logo" />
      <div className="container w-max content-center align-middle justify-center px-auto h-36">
        <h1 className="flex flex-col pt-8 text-5xl font-bold font-sans text-slate-900">
            A.R.I.A (AI Routing Information Assistant)
          </h1>
      </div>

      </header>
      <div>
        
      </div>
      <div className="chat-window">
      
        <div>
          <div className={`rounded-lg mb-8 p-8 bg-sky-200/75`}>
            <MarkdownView
              markdown={questions[0]}
              options={{ tables: true, emoji: true }}
            />
          </div>
          <input
            autoFocus
            className='flex flex-grow resize-none border rounded-md h-auto min-h-[1rem] max-h-[20rem] text-wrap overflow-hidden mb-8 p-8 pt-8 pb-8 bg-slate-200/75 w-full'
            type="textarea"
            value={answers} // Bind value to the answers state variable
            onChange={(e) => setAnswers(e.target.value) }
            
          />
          </div>
          <div>
          <div className={`rounded-lg mb-8 p-8 bg-sky-200/75`}>
            <MarkdownView
              markdown={questions[1]}
              options={{ tables: true, emoji: true }}
            />
          </div>
          <input
            className='flex flex-grow resize-none border rounded-md h-auto min-h-[1rem] max-h-[20rem] text-wrap overflow-hidden mb-8 p-8 pt-8 pb-8 bg-slate-200/75 w-full'
            type="textarea"
            value={answers2} // Bind value to the answers state variable
            onChange={(e) => setAnswers2(e.target.value) }
            
          />
          </div>
          <div>
          <div className={`rounded-lg mb-8 p-8 bg-sky-200/75`}>
            <MarkdownView
              markdown={questions[2]}
              options={{ tables: true, emoji: true }}
            />
          </div>
          <input
            className='flex flex-grow resize-none border rounded-md h-auto min-h-[1rem] max-h-[20rem] text-wrap overflow-hidden mb-8 p-8 pt-8 pb-8 bg-slate-200/75 w-full'
            type="textarea"
            value={answers3} // Bind value to the answers state variable
            onChange={(e) => setAnswers3(e.target.value) }
            
          />
          </div>

        {messages.map((message, index) => (
          <div key={index} className={`rounded-lg mb-8 p-8 bg-sky-200/75 ${message.sender}`}>
            <MarkdownView
              markdown={message.text}
              options={{ tables: true, emoji: true }}
            />
          </div>
        ))}
      </div>
      <div className="">
        <textarea 
          className='flex flex-grow resize-none border rounded-md h-auto min-h-[1rem] max-h-[20rem] text-wrap overflow-hidden mb-8 p-8 pt-8 pb-8 bg-slate-200/75 w-full'
          type="textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <div className="flex align-middle place-content-center justify-center mx-auto"><button className="bg-green-200 hover:bg-green-400 rounded-lg p-3 mr-8" onClick={handleSend}>Send</button>
        <button className="bg-green-200 hover:bg-green-400 rounded-lg p-3" onClick={() => setIsDictating(true)}>Dictate</button> {/* Button to toggle dictation mode */}</div>
      </div>
      {isDictating && <VoiceDictation onDictationEnd={handleDictationResult} />} {/* Conditionally render VoiceDictation */}
    </div>
  );
}

export default App;
