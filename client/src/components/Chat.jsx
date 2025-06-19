import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router';
import { socket } from './Utils';

const Chat = () => {
    const { roomname } = useParams();
    const username = localStorage.getItem('username');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);

    useEffect(() => {
        console.log("yes")
        socket.on('chat-message', (data) => {
            console.log('chat')
            setMessages(messages => [...messages, data]);
        });

        socket.on('get-messages', (data) => {
            console.log(data)
            setMessages(data);
        })

        socket.emit("reconnect", roomname);

        socket.emit('get-messages', roomname);

        return () => {
            socket.off('chat-message');
            socket.off('get-messages');
        }
        
    }, []);

    useEffect(() => {
        if(bottomRef.current){
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit('chat-message', { username, message, roomname });
        setMessage('')
    }

    const longerwords = (msg) => {
        const words = msg.trim().split(/\s+/);
        return words.filter(word => word.length > 10).length > 0;
    }

    return (
        <div className='chat flex flex-col items-center h-screen w-screen overflow-hidden'>
            <div className='w-full sm:w-[50%] border-2 border-gray-500 rounded-lg p-4 h-full flex flex-col relative justify-center'>
                <h1 className='text-2xl font-bold border-b-2 border-gray-500 pb-4'>Chat</h1>
            
                <ul className='messages flex flex-col mb-[3.5rem] mt-[1.5rem] overflow-y-scroll flex-1 gap-2'>
                    {messages.map((message, index) => (
                    <li key={index} className={`flex max-w-[60%] ${longerwords(message.message) ?  'break-all whitespace-pre-wrap' : ''} ${message.username === username ? 'self-end bg-blue-500' : 'self-start bg-gray-500'} p-2 rounded-lg`}>
                        <span>{message.message}</span>
                    </li>
                    ))}
                    <div ref={bottomRef} />
                </ul>
            
                <form
                    className="absolute bottom-2 inset-x-0 px-4 flex gap-2"
                    onSubmit={sendMessage}
                >
                    <input
                        type="text"
                        value={message}
                        placeholder="Enter your message"
                        className='flex-1 focus:outline-none border-2 border-gray-500 rounded-lg p-4'
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    Send
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Chat
