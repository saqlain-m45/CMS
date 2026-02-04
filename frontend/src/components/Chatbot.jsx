// frontend/src/components/Chatbot.jsx
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Chatbot = () => {
    const { api } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I am the College AI. Ask me about teachers, courses, or your attendance!' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await api.post('/chatbot.php', { message: userMsg });
            setMessages(prev => [...prev, { type: 'bot', text: res.data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { type: 'bot', text: "Sorry, I'm having trouble connecting to the college database." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <div className={`
                pointer-events-auto transition-all duration-300 origin-bottom-right 
                ${isOpen ? 'scale-100 opacity-100 mb-4' : 'scale-0 opacity-0'}
                w-80 md:w-96 bg-white/80 backdrop-blur-md border border-white/40 shadow-2xl rounded-2xl overflow-hidden flex flex-col
            `} style={{ height: '500px' }}>

                {/* Header */}
                <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <Bot size={20} />
                        <span className="font-bold">College Assistant</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`
                                max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
                                ${msg.type === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'}
                            `}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white/50 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-3 bg-white/80 border-t border-gray-100 flex gap-2">
                    <input
                        type="text"
                        className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Type a question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                        <Send size={18} />
                    </button>
                </form>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto p-4 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-400 hover:scale-110 transition-transform active:scale-95 group"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} className="group-hover:animate-pulse" />}
            </button>
        </div>
    );
};

export default Chatbot;
