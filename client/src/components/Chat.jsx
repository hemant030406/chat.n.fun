import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router';
import { socket } from './Utils';
import { ImageIcon, SendHorizonalIcon } from 'lucide-react';
import { useLoading } from './Context';

const FilePreview = ({ file, fileType, sendImage, cancelImage }) => {
    return (
        <div className='fixed inset-0 bg-opacity-90 h-full w-full bg-gray-600 flex flex-col items-center justify-center gap-3 z-50'>
            {
                fileType === 'image' &&
                <img src={file} alt="image" className='max-w-[60%] p-2 rounded-lg' />
            }
            {
                fileType === 'video' &&
                <video src={file} controls className='max-w-[60%] p-2 rounded-lg' />
            }
            <div className='flex gap-4'>
                <button className='bg-red-600 p-2' onClick={cancelImage}>Cancel</button>
                <button className='bg-green-600 p-2' onClick={sendImage}>Send</button>
            </div>
        </div>
    )
}

const Chat = () => {
    const { roomname } = useParams();
    const username = localStorage.getItem('username');
    const [message, setMessage] = useState({
        content: '',
        type: '',
    });
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);
    const imageInputRef = useRef(null);
    const [preview, setPreview] = useState(false);
    const { setLoading } = useLoading();

    useEffect(() => {
        setLoading(false);

        socket.on('chat-message', (data) => {
            setLoading(false);
            setMessages(messages => [...messages, data]);
        });

        socket.on('get-messages', (data) => {
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
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit('chat-message', { username, message, roomname });
        setMessage({ content: '', type: '' });
    }

    const longerwords = (msg) => {
        const words = msg.trim().split(/\s+/);
        return words.filter(word => word.length > 10).length > 0;
    }

    const convertToBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(file);
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const fileType = file.type.startsWith('image/') ? 'image' : 'video';
        if (file) {
            convertToBase64(file, (base64Image) => {
                setMessage({ content: base64Image, type: fileType })
                setPreview(true);
            })
        }
    }

    const sendImage = () => {
        setLoading(true);
        socket.emit('chat-message', {username, message, roomname});
        setMessage({content: '', type: ''});
        setPreview(false);
    }

    const cancelImage = () => {
        setMessage({content: '', type: ''});
        setPreview(false);
        if (imageInputRef.current) {
            imageInputRef.current.value = null; // Reset file input
        }
    }

    return (
        <div className='chat flex flex-col items-center h-screen w-screen overflow-hidden'>
            <div className='w-full sm:w-[60%] border-2 border-gray-500 rounded-lg p-4 h-full flex flex-col relative justify-center relative'>
                <h1 className='text-2xl font-bold border-b-2 border-gray-500 pb-4'>Chat</h1>

                <ul className='messages flex flex-col mb-[3.5rem] mt-[1.5rem] overflow-y-scroll flex-1 gap-2'>
                    {messages.map((message, index) => {
                        if(message.message.type === 'text') {
                            return (
                                <li key={index} className={`flex max-w-[60%] ${longerwords(message.message.content) ? 'break-all whitespace-pre-wrap' : ''} ${message.username === username ? 'self-end bg-blue-500' : 'self-start bg-gray-500'} p-2 rounded-lg`}>
                                    <span>{message.message.content}</span>
                                </li>
                            )
                        } else if(message.message.type === 'image') {
                            return (
                                <div key={index} className={`flex max-w-[60%] ${message.username === username ? 'self-end bg-blue-500' : 'self-start bg-gray-500'} p-2 rounded-lg`}>
                                    <img src={message.message.content} alt="image"/>
                                </div>
                            )
                        } else if(message.message.type === 'video'){
                            return (
                                <div key={index} className={`flex max-w-[60%] ${message.username === username ? 'self-end bg-blue-500' : 'self-start bg-gray-500'} p-2 rounded-lg`}>
                                    <video src={message.message.content} controls/>
                                </div>
                            )
                        }
                    })}
                    <div ref={bottomRef} />
                </ul>

                <form
                    className="absolute bottom-2 px-4 flex gap-2 left-1/2 transform -translate-x-1/2"
                    onSubmit={sendMessage}
                >
                    <input
                        type="text"
                        value={message.content}
                        placeholder="Enter your message"
                        className='focus:outline-none border-2 border-gray-500 rounded-2xl p-2'
                        onChange={(e) => setMessage({ content: e.target.value, type: 'text' })}
                    />
                    <div className='flex items-center'>
                        <button
                            onClick={() => imageInputRef.current.click()}
                            className="text-blue-500 text-2xl hover:text-blue-700 transition"
                            type="button"
                            title="Upload Image/Video"
                        >
                            <ImageIcon className="w-10 h-10" />
                        </button>
                        <input
                            type='file'
                            accept='image/*, video/*'
                            onChange={handleFileUpload}
                            ref={imageInputRef}
                            className='hidden'
                        />
                    </div>
                    <button type="submit" className='text-blue-500 hover:text-blue-700 transition'>
                        <SendHorizonalIcon className="w-10 h-10"/>
                    </button>
                </form>
            </div>
            {
                preview && <FilePreview file={message.content} fileType={message.type} sendImage={sendImage} cancelImage={cancelImage} />
            }
        </div>
    )
}

export default Chat
