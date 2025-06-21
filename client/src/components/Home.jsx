import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { socket } from './Utils';
import { useLoading } from './Context.jsx';

const Home = () => {
    const username = crypto.randomUUID().replace(/-/g, '');
    localStorage.setItem('username', username);

    const navigate = useNavigate();
    const {setLoading} = useLoading();

    useEffect(() => {
        setLoading(false);
        
        socket.on('find-partner', (data) => {
            setLoading(false);
            navigate(`/chat/${data.roomname}`);
        });
        socket.on('disconnect', () => {
            localStorage.removeItem('username');
            navigate('/');
        });
    }, []);


    const startChat = (e) => {
        e.preventDefault();
        socket.emit('find-partner', username);
        setLoading(true);
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
