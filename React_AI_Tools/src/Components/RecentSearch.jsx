import { MdOutlineDelete } from "react-icons/md";

export function RecentSearch({recentHistory, setRecentHistory, setSelectedHistory}) {
  const clearHistory = () => {
    localStorage.clear()
    setRecentHistory([])
  }

  const clearSelectedHistory = (selectedItem) => {
    let history = JSON.parse(localStorage.getItem('history'))
    history = history.filter((item) => item !== selectedItem)
    setRecentHistory(history)
    localStorage.setItem('history', JSON.stringify(history))
  }

  return (
    <div className='flex flex-col h-full w-full dark:bg-zinc-800 bg-red-100 border-r border-zinc-700 pt-3 overflow-hidden'>
      <h1 className='text-[clamp(0.7rem,2.2vw,1.25rem)] dark:text-white text-zinc-800 flex items-center justify-center sm:mt-0 max-[240px]:mt-5 gap-1 px-2'>
        <span className="font-bold ">Recent Search</span>
        <button 
          onClick={clearHistory} 
          className='cursor-pointer dark:text-zinc-400 text-pink-600 dark:hover:text-red-500 hover:text-pink-400 shrink-0'
        >
          <MdOutlineDelete size={20}/>
        </button>
      </h1>
      
      <ul className='flex-1 overflow-y-auto mt-4 scrollbar-thin scrollbar-track-gray-200 dark:scrollbar-track-zinc-800"'>
        {recentHistory && recentHistory.map((item, index) => (
          <div key={index} className="flex group justify-between items-center dark:text-white text-zinc-800 px-2 py-2 hover:bg-red-200 dark:hover:bg-zinc-700 transition-colors border-b border-zinc-700/10">
            <li 
              onClick={() => setSelectedHistory(item)} 
              className='flex-1 truncate text-[11px] sm:text-base dark:text-zinc-400 dark:group-hover:text-zinc-200 text-zinc-700 cursor-pointer'
            >
              {item}
            </li>
            <button onClick={() => clearSelectedHistory(item)} className='ml-1 opacity-60 hover:opacity-100 dark:hover:text-red-500 dark:text-zinc-400 text-pink-600 hover:text-pink-400 transition-opacity shrink-0'>
              <MdOutlineDelete size={16}/>
            </button>
          </div>
        ))}
      </ul>
    </div>
  )
}