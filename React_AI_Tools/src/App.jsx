import { useEffect, useRef, useState } from 'react'
import './App.css'
import { RecentSearch } from './Components/RecentSearch';
import QuestionAnswer from './Components/QusetionAnswer';

function App() {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState([])
  const [recentHistory, setRecentHistory] = useState(JSON.parse(localStorage.getItem('history')) || [])
  const [selectedHistory, setSelectedHistory] = useState('')
  const scrollToAns = useRef()
  const [loader, setLoader] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const askQuestion = async () => {
    if (!question && !selectedHistory) return;
    
    if (question) {
      let history = JSON.parse(localStorage.getItem('history')) || [];
      history = [question.charAt(0).toUpperCase() + question.slice(1).trim(), ...history.slice(0, 19)];
      history = [...new Set(history)];
      localStorage.setItem('history', JSON.stringify(history));
      setRecentHistory(history);
    }

    const payloadData = question || selectedHistory;
    const payload = { "contents": [{ "parts": [{ "text": payloadData }] }] };
    
    setLoader(true);
    try {
      let response = await fetch(import.meta.env.VITE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      let dataString = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      dataString = dataString.replace(/\r\n/g, "\n");
      const lines = dataString.split("\n").map(line => line.trim()).filter(Boolean);

      setResult(prev => [...prev, { type: 'q', text: payloadData }, { type: 'a', text: lines }]);
      setTimeout(() => { if (scrollToAns.current) scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight; }, 100);
    } catch (e) { 
      console.error("Server error"); 
    } 
    finally {
       setLoader(false); setQuestion('');
       }
  };

  const isEnter = (e) => { 
    if (e.key === 'Enter') askQuestion();
   };
  useEffect(() => { 
    if (selectedHistory){
      askQuestion()
    };

    }, [selectedHistory]);

  const [darkMode, setDarkMode] = useState('dark')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode === 'dark');
  }, [darkMode]);

  return (
    <div className={darkMode === 'dark' ? 'dark' : 'light'}>
      <div className='flex h-dvh w-full overflow-hidden bg-white dark:bg-zinc-900 transition-colors'>
       {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] md:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        
        <div className={`fixed inset-y-0 left-0 z-50 w-[80%] max-w-65 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 md:flex md:w-1/5 border-r border-zinc-700`}>
          <RecentSearch recentHistory={recentHistory} setRecentHistory={setRecentHistory} setSelectedHistory={(h) => { setSelectedHistory(h); setIsSidebarOpen(false); }} />
          <button onClick={() => setIsSidebarOpen(false)} className="absolute top-1 right-0 md:hidden text-[clamp(0.8rem,2vw,1.25rem)]  text-zinc-500 text-xl p-2">✕</button>
        </div>

        
        <div className={`flex-1 flex flex-col h-full relative p-2 sm:p-4 min-w-0 transition-all duration-500 ${result.length === 0 ? 'justify-center items-center' : 'justify-between'}`}>
          
          <div className={`w-full flex justify-between items-center shrink-0 mb-4 px-1 ${result.length === 0 ? 'absolute top-2 left-0 right-0 px-2' : ''}`}>
            <div className="flex items-center gap-1 min-w-0">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-xl dark:text-white shrink-0">☰</button>
              <h1 className='dark:text-white text-base sm:text-2xl md:text-5xl font-bold truncate'>Chat AI</h1>
            </div>
            <select onChange={(e) => setDarkMode(e.target.value)} value={darkMode} className='text-[10px] sm:text-sm dark:text-white border-none rounded-xl outline-none p-1 sm:p-2 dark:bg-zinc-800 bg-red-200 shrink-0'>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <h1 className={`text-center leading-22 px-2 bg-clip-text text-transparent bg-linear-to-r from-pink-700 to-violet-500 transition-all duration-500 ${result.length === 0 ? 'text-xl sm:text-6xl mb-4 font-bold' : 'text-sm sm:text-3xl mb-2 font-medium '}`}>
            Hello User, Ask me Anything
          </h1>

          {result.length > 0 && (
            <div ref={scrollToAns} className="flex-1 w-full max-w-4xl mx-auto overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-red-400 dark:scrollbar-thumb-zinc-700">
              <ul className="space-y-3 text-zinc-400">
                {result.map((item, index) => <QuestionAnswer key={index} item={item} index={index} />)}
              </ul>
              {loader && (
                <div className="flex justify-center p-2">
                  <div className="w-5 h-5 border-2 border-zinc-700 dark:border-t-gray-500 border-t-pink-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          )}

  
          <div className={`shrink-0 w-full transition-all duration-500 ${result.length === 0 ? 'max-w-[90%]' : 'max-w-4xl py-2 mx-auto'}`}>
            <div className='dark:bg-zinc-800 bg-red-100 p-0.5 dark:text-white text-zinc-800 rounded-full border border-zinc-700 flex items-center h-10 sm:h-14 md:h-16 pr-2 overflow-hidden shadow-lg'>
              <input name='chat' type="text" value={question} onKeyDown={isEnter} onChange={(e) => setQuestion(e.target.value)} className='flex-1 w-0 min-w-0 h-full p-4 outline-none bg-transparent text-[11px] sm:text-base' placeholder='Ask...' />
              <button onClick={askQuestion} disabled={!question.trim()} className="bg-pink-600 dark:bg-gray-600 text-white px-3 sm:px-6 py-1 h-[80%] rounded-full text-[11px] sm:text-base font-bold enabled:hover:bg-pink-700  disabled:opacity-50  dark:enabled:hover:bg-gray-700 transition-colors shrink-0">Ask</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
export default App