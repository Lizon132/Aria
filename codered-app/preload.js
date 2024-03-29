const { contextBridge, ipcRenderer } = require('electron');
const { GoogleGenerativeAI } = require("@google/generative-ai");

contextBridge.exposeInMainWorld('electron', 
{
  require: require,
  doThing: async (user_prompt) => {

    const API_KEY = "AIzaSyAh7Bbtu2fE28zPJrGASczWmW2CRF71-NU";
    const genAI = new GoogleGenerativeAI(API_KEY);
    const arrayResponse = ["\n"];

    // async function run() {
    //   // For text-only input, use the gemini-pro model
    //   const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    
    //   const prompt = user_prompt;
    
    //   const result = await model.generateContent(prompt);
    //   const response = await result.response;
    //   const text = response.text();
    //   console.log(text);
    //   return text; 
    // }

    async function streamChat() {
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const chat = model.startChat();
      const chatInput1 = user_prompt;
      const result1 = await chat.sendMessageStream(chatInput1);
      for await (const item of result1.stream) {
          console.log(item.candidates[0].content.parts[0].text);
          arrayResponse.push(item.candidates[0].content.parts[0].text)
      }
      return arrayResponse.join(' ');
    }
    
    
    const text = streamChat()
    // const text = run();
    return text;

  },  
});

