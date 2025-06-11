import React, { useState } from 'react';

const Login = ({ onJoin }) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && room) onJoin({ username, room });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Join Whiteboard</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <input
          type="text"
          placeholder="Room ID"
          value={room}
          onChange={e => setRoom(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">
          Join
        </button>
      </form>
    </div>
  );
};

export default Login;
