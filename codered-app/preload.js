const { contextBridge, ipcRenderer } = require('electron');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {PythonShell} =require('python-shell');

contextBridge.exposeInMainWorld('electron', 
{
  require: require,
  doThing: async (user_prompt) => {
    const API_KEY = "AIzaSyAh7Bbtu2fE28zPJrGASczWmW2CRF71-NU";
    const genAI = new GoogleGenerativeAI(API_KEY);
    const arrayResponse = ["\n"];
    if(user_prompt){
    async function run() {
      // For text-only input, use the gemini-pro model
      const model = genAI.getGenerativeModel({ model: "gemini-pro", temperature: 0.3});
    
      const prompt = user_prompt;
    
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);
      return text; 
    }

    // async function streamChat() {
    //   const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    //   const chat = model.startChat();
    //   const chatInput1 = user_prompt;
    //   const result1 = await chat.sendMessageStream(chatInput1);
    //   for await (const item of result1.stream) {
    //       console.log(item.candidates[0].content.parts[0].text);
    //       arrayResponse.push(item.candidates[0].content.parts[0].text)
    //   }
    //   console.log(arrayResponse)
    //   return arrayResponse.join(' ');
    // }
  
    
    const text = run()
    // const text = run();
    return text;
  }
  },  
  doPython: (jsonObject) => {
    // Convert the JSON object to a string
    const jsonString = JSON.stringify(jsonObject);

    PythonShell.run('my_script.py', { args: [jsonString] })
        .then(messages => {
            console.log('finished running python -- ' + messages);
        })
        .catch(err => {
            console.error('Error while running python:', err);
        });
  },
});

