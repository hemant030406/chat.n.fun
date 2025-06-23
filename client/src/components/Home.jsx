import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { socket } from './Utils';
import { useLoading } from './Context.jsx';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
    const username = uuidv4().replace(/-/g, '');
    localStorage.setItem('username', username);

    const navigate = useNavigate();
    const {setLoading} = useLoading();

    useEffect(() => {
        setLoading(false);

        const handleBeforeUnload = () => {
            localStorage.removeItem('username');
            localStorage.removeItem('chatStatus');
        }

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        socket.on('find-partner', (data) => {
            setLoading(false);
            localStorage.setItem("chatStatus", "chatting");
            navigate(`/chat/${data.roomname}`);
        });
        
        socket.on('disconnect', () => {
            localStorage.removeItem('username');
            localStorage.removeItem('chatStatus');
            navigate('/');
        });

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);


    const startChat = (e) => {
        e.preventDefault();
        if (localStorage.getItem("chatStatus") === "searching") {
            alert("You're already searching for a partner in another tab.");
            return;
        }
        socket.emit('find-partner', username);
        setLoading(true);
        localStorage.setItem("chatStatus", "searching");
    }

    return (
    <div className='p-10 flex flex-col items-center justify-center'>
        <form className='flex flex-col items-center justify-center' onSubmit={startChat}>
        <button className='bg-blue-600 p-2'>Start Chat</button>
        </form>
    </div>
    )
}

export default Home
