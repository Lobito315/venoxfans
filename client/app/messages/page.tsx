import Link from 'next/link';

const CONVERSATIONS = [
    { id: 1, handle: 'alex_fitness', name: 'Alex Johnson', img: 'https://i.pravatar.cc/150?u=1', lastMsg: 'Thanks for subscribing! Here\'s a custom routine...', unread: 2, time: '2h' },
    { id: 2, handle: 'sarah_art', name: 'Sarah Creates', img: 'https://i.pravatar.cc/150?u=2', lastMsg: 'The commission is ready.', unread: 0, time: '1d' },
    { id: 3, handle: 'gamer_ninja', name: 'Ninja Pro', img: 'https://i.pravatar.cc/150?u=3', lastMsg: 'Yes, we are playing tonight.', unread: 0, time: '2d' },
];

const CURRENT_MESSAGES = [
    { id: 1, sender: 'them', content: 'Hey there! Thanks for joining my VIP tier! 🎉', time: '10:00 AM' },
    { id: 2, sender: 'them', content: 'As promised, here is the exclusive workout block.', locked: true, price: 15.00, time: '10:02 AM' },
    { id: 3, sender: 'me', content: 'Awesome, just unlocked it! Looks intense.', time: '11:45 AM' },
    { id: 4, sender: 'them', content: 'Let me know how it goes! If you need a form check, Im doing custom video reviews for $20 this week.', time: '11:50 AM' },
];

export default function MessagesPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-100px)]">
            <div className="glass rounded-2xl border border-white/10 h-full flex overflow-hidden shadow-2xl">

                {/* Sidebar */}
                <div className="w-full md:w-80 border-r border-white/10 flex flex-col shrink-0">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="text-xl font-bold mb-4">Messages</h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full bg-background border border-gray-700 rounded-full py-2 px-4 text-sm text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {CONVERSATIONS.map((conv, i) => (
                            <div key={conv.id} className={`p-4 flex gap-3 cursor-pointer hover:bg-white/5 transition border-b border-white/5 ${i === 0 ? 'bg-white/10' : ''}`}>
                                <div className="relative shrink-0">
                                    <img src={conv.img} alt={conv.name} className="w-12 h-12 rounded-full" />
                                    {conv.unread > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-surface">
                                            {conv.unread}
                                        </span>
                                    )}
                                </div>
                                <div className="overflow-hidden w-full">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-sm truncate">{conv.name}</h4>
                                        <span className="text-xs text-gray-500">{conv.time}</span>
                                    </div>
                                    <p className={`text-sm truncate ${conv.unread ? 'font-medium text-white' : 'text-gray-400'}`}>
                                        {conv.lastMsg}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="hidden md:flex flex-col flex-1 bg-background/30 relative">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10 glass flex justify-between items-center sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <img src="https://i.pravatar.cc/150?u=1" alt="Alex" className="w-10 h-10 rounded-full" />
                            <div>
                                <h3 className="font-bold text-sm">Alex Johnson</h3>
                                <p className="text-xs text-green-400">Online</p>
                            </div>
                        </div>
                        <div className="flex gap-4 text-xl text-gray-400">
                            <button className="hover:text-purple-400 transition">📞</button>
                            <button className="hover:text-pink-400 transition" title="Tip Creator">💸</button>
                            <button className="hover:text-white transition">•••</button>
                        </div>
                    </div>

                    {/* Messages Stream */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        <div className="text-center text-xs text-gray-500 my-4">Today</div>

                        {CURRENT_MESSAGES.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'them' && (
                                    <img src="https://i.pravatar.cc/150?u=1" alt="Avatar" className="w-8 h-8 rounded-full mr-2 self-end mb-1" />
                                )}

                                <div className={`max-w-[70%] rounded-2xl p-3 ${msg.sender === 'me' ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-surface border border-white/10 rounded-tl-sm text-gray-200'}`}>
                                    {msg.locked ? (
                                        <div className="bg-background/50 rounded-lg p-4 text-center border border-purple-500/30 w-64">
                                            <div className="text-3xl mb-2 text-purple-400">🔒</div>
                                            <p className="font-bold text-sm mb-2">Locked Message</p>
                                            <button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-full w-full transition">
                                                Unlock for ${msg.price?.toFixed(2)}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-sm">{msg.content}</p>
                                    )}
                                    <span className={`text-[10px] block mt-1 ${msg.sender === 'me' ? 'text-purple-200 text-right' : 'text-gray-500'}`}>
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 glass mt-auto">
                        <div className="flex items-center gap-3 bg-background border border-gray-700 rounded-full px-2 py-2">
                            <button className="text-gray-400 hover:text-purple-400 transition p-2 bg-surface rounded-full">
                                📎
                            </button>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder-gray-500 px-2"
                            />
                            <button className="text-gray-400 hover:text-purple-400 transition p-2">
                                💰
                            </button>
                            <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm transition-transform transform hover:scale-105">
                                ➤
                            </button>
                        </div>
                        <p className="text-center text-[10px] text-gray-500 mt-2">
                            Messages to creators cost $0.50 minimum or as set by creator.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
