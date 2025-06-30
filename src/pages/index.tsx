import { useState } from 'react';
import { useRouter } from 'next/router';


export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleRoomAction = (type: string) => {
    if (!name.trim()) return alert("Please enter your name 🌼");

    let roomId;
    if (type === 'create') {
      roomId = Math.floor(1000 + Math.random() * 9000).toString();
    } else {
      const input = prompt("Enter Room ID");
      if (!input || input.length !== 4) {
        return alert("Please enter a valid 4-digit Room ID");
      }
      roomId = input;
    }

    router.push(`/room/${roomId}?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="welcome-container">
      <h1 className="title">welcome to 2play</h1>
      <p className="subtitle">Not a project But a present🎶</p>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="name-input"
      />

      <div className="button-group">
        <button onClick={() => handleRoomAction('create')} className="action-button create">
          Create Room
        </button>
        <button onClick={() => handleRoomAction('join')} className="action-button join">
          Join Room
        </button>
      </div>

      <footer className="footer">Made  by Harshit</footer>
    </div>
  );
}
