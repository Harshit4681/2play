import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getDatabase, ref, onValue, set, push, serverTimestamp } from 'firebase/database';
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAhh8tXA1GH9tY0qGDTQk0-U3c7_HRthsk",
  authDomain: "play-9d1ee.firebaseapp.com",
  projectId: "play-9d1ee",
  storageBucket: "play-9d1ee.appspot.com",
  messagingSenderId: "1025153083498",
  appId: "1:1025153083498:web:d5bc29577aceabbc004213",
  databaseURL: "https://play-9d1ee-default-rtdb.firebaseio.com"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

type Song = {
  name: string;
  file: string;
};

export default function RoomPage() {
  const router = useRouter();
  const { roomId } = router.query;
  const audioRef = useRef<HTMLAudioElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const playlist: Song[] = [
    { name: "birthday song ", file: "birthday.mp3" },
  { name: "Kesariya (Brahmastra)", file: "Kesariya.mp3" },
  { name: "Ehsaan Tera Hoga Mujh Par (Old Classic)", file: "Ehsan Tera Hoga Mujh Par.mp3" },
  { name: "Jhuki Jhuki Si Nazar (Jagjit Singh)", file: "Jhuki Jhuki Si Nazar.mp3" },
  { name: "Sagar Kinare (Saagar)", file: "Saagar Kinare - Saagar.mp3" },
  { name: "Apna Bana Le (Bhediya)", file: "xx.mp3" },
  { name: "Us Mod Se Shuru Kare (Jagjit Singh)", file: "Us Mod Se Shuroo Karen.mp3" },
  { name: "Abhi Na Jao Chhod Kar (Hum Dono)", file: "Abhi Na Jao Chhod Kar.mp3" },
  { name: "Varoon (Mirzapur)", file: "Vaaroon.mp3" },
  { name: "Baija Mere Kaul (Ghulam Ali)", file: "Beh Ja Mere Kol.mp3" },
  { name: "Kabhi Kabhi (Aditea)", file: "Kabhi Kabhi Aditi Zindagi.mp3" },
  { name: "Meri Kahani (Atif Aslam)", file: "Meri Kahani.mp3" },
  { name: "Rang Lageya (Album)", file: "Rang Lageya.mp3" },
  { name: "Tere Bina (Guru)", file: "x.mp3" },
  { name: "Aaj Jaane Ki Zid Na Karo (Farida Khanum)", file: "Aaj Jaane Ki Zid Na Karo.mp3" },
  { name: "Ishq Bulaava (Hasee Toh Phasee)", file: "Ishq Bulaava.mp3" },
  { name: "Agar Main Kahoon (Lakshya)", file: "Agar Main Kahoon.mp3" },
  { name: "Mat Maari (Kill Dil)", file: "Mat Maari.mp3" },
  { name: "Paar Chanaa De (Coke Studio)", file: "Paar Chanaa De.mp3" },
  { name: "Raabta (Agent Vinod)", file: "Raabta.mp3" },
  { name: "Galat Baat Hai (Main Tera Hero)", file: "Galat Baat Hai.mp3" },
  { name: "Raat Akeli Thi (Album)", file: "Raat Akeli Thi.mp3" },
  { name: "Hoor (Hindi Medium)", file: "Hoor.mp3" },
  //{ name: "Mar Jayein Hum (Album)", file: "Mar Jayein.mp3" },
  { name: "Kuch Khaas (Fashion)", file: "Kuch Khaas.mp3" },
  { name: "Khali Salam Dua (Mary Kom)", file: "-Khali Salam Dua.mp3" },
  { name: "Kaun Mera (Special 26)", file: "Kaun Mera.mp3" },
  { name: "Chalo Jaane Do (Album)", file: "Chalo Jaane Do.mp3" },
  { name: "Tum Mile (Tum Mile)", file: "Tum Mile.mp3" },
  { name: "Gallan Goodiyan (Dil Dhadakne Do)", file: "Gallan Goodiyaan.mp3" },
  { name: "Tere Bin (Bas Ek Pal)", file: "Tere Bin.mp3" },
  { name: "Jahan Mein Aisa Kaun Hai (Album)", file: "Jahan Mein Aesa Kaun Hai.mp3" },
  { name: "Ijazat (Jazbaa)", file: "Ijazat.mp3" },
  { name: "Aaj Kal Zindagi (Wake Up Sid)", file: "Aaj Kal Zindagi.mp3" },
  { name: "Beete Lamhein (The Train)", file: "Beete Lamhein.mp3" },
  { name: "Kaise Mujhe (Ghajini)", file: "Kaise Mujhe.mp3" },
  { name: "Uljhan (Album)", file: "Uljhan.mp3" },
  { name: "Prem Ki Naiyya (Ajab Prem Ki Ghazab Kahani)", file: "Prem Ki Naiyya.mp3" },
  { name: "Aashique Tera (Happy Bhag Jayegi)", file: "xxx.mp3" },
  { name: "Tum Jo Aaye (Once Upon A Time in Mumbaai)", file: "Tum Jo Aaye Jindagi.mp3" },
  { name: "Tum Roothi Raho (Album)", file: "Tum Roothi Raho.mp3" },
  { name: "Sadka (I Hate Luv Storys)", file: "Sadka.mp3" },
  { name: "Main Koi Aisa Geet Gaoon (Yes Boss)", file: "Main Koi Aisa Geet Gaoon.mp3" },
  { name: "Tu Jaane Na (Ajab Prem Ki Ghazab Kahani)", file: "Tu Jaane Na.mp3" },
 // { name: "Kho Gaye Hum Kahan (Baar Baar Dekho)", file: "Kho Gaye Hum Kahan.mp3" },
  { name: "Ghagra (Yeh Jawaani Hai Deewani)", file: "Ghagra.mp3" },
  { name: "Billo Rani (Dhan Dhana Dhan Goal)", file: "Billo Rani.mp3" },
  { name: "Hey Shona (Ta Ra Rum Pum)", file: "Hey Shona.mp3" },
  { name: "Woh Ladki Jo (Baadshah)", file: "Wo Ladki Jo.mp3" },
  { name: "Dagabaaz Re (Dabangg 2)", file: "Dagabaaz Re.mp3" },
  { name: "Dekh Lena (Tum Bin 2)", file: "Dekh Lena.mp3" },
  { name: "Itna na Mujhse tu pyaar badha ", file: "xxxx.mp3" }
];

  

  useEffect(() => {
    if (!router.isReady || !roomId) return;

    const queryName = Array.isArray(router.query.name)
      ? router.query.name[0]
      : router.query.name || '';
    setName(queryName);

    // Push join message
    push(ref(db, `chats/${roomId}`), {
      sender: 'System',
      text: `${queryName} joined the room`,
      time: Date.now()
    });

    const musicRef = ref(db, `rooms/${roomId}`);
    const unsubscribeMusic = onValue(musicRef, (snap) => {
      const data = snap.val();
      if (data) {
        setCurrentSong(data.currentSong);
        setIsPlaying(data.isPlaying);
        if (audioRef.current && data.currentSong) {
          if (audioRef.current.src !== `/music/${data.currentSong.file}`) {
            audioRef.current.src = `/music/${data.currentSong.file}`;
          }
          audioRef.current.currentTime = data.currentTime || 0;
          if (data.isPlaying) {
            audioRef.current.play().catch(() => {});
          } else {
            audioRef.current.pause();
          }
        }
      }
    });

    const chatRef = ref(db, `chats/${roomId}`);
    const unsubscribeChat = onValue(chatRef, (snap) => {
      const messages: any[] = [];
      snap.forEach((child) => {
        messages.push(child.val());
      });
      setChatMessages(messages);
    });

    

    return () => {
      unsubscribeMusic();
      unsubscribeChat();
    
      set(ref(db, `typing/${roomId}/${name}`), false);
    };
  }, [router.isReady, roomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const updateRoomState = (state: any) => {
    if (!roomId) return;
    set(ref(db, `rooms/${roomId}`), state);
  };

  const handlePlay = () => {
    if (audioRef.current && currentSong) {
      audioRef.current.play();
      updateRoomState({
        currentSong,
        currentTime: audioRef.current.currentTime,
        isPlaying: true
      });
      push(ref(db, `chats/${roomId}`), {
        sender: 'System',
        text: `${name} played the music`,
        time: Date.now()
      });
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      updateRoomState({
        currentSong,
        currentTime: audioRef.current.currentTime,
        isPlaying: false
      });
      push(ref(db, `chats/${roomId}`), {
        sender: 'System',
        text: `${name} paused the music`,
        time: Date.now()
      });
    }
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSongSelect = (song: Song) => {
    updateRoomState({
      currentSong: song,
      currentTime: 0,
      isPlaying: true
    });
    if (audioRef.current) {
      audioRef.current.src = `/music/${song.file}`;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleSongEnd = () => {
    const currentIndex = playlist.findIndex(s => s.file === currentSong?.file);
    const nextSong = playlist[(currentIndex + 1) % playlist.length];
    handleSongSelect(nextSong);
  };

  const handleSendMessage = () => {
    if (!roomId || !messageText.trim()) return;
    const chatRef = ref(db, `chats/${roomId}`);
    push(chatRef, {
      sender: name,
      text: messageText.trim(),
      time: Date.now()
    });
    setMessageText('');
    set(ref(db, `typing/${roomId}/${name}`), false);
  };

  const handleTyping = (text: string) => {
    setMessageText(text);
    set(ref(db, `typing/${roomId}/${name}`), !!text);
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="room-container">
      <div className="top-section">
        <h1 className="room-heading"> Welcome, {name}!!!</h1>
        <p className="room-subtext">Room ID: <strong>{roomId}</strong></p>
      </div>

      {currentSong && (
        <div className="player-section">
          <p className="current-song">Now Playing: {currentSong.name}</p>
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleSongEnd}
          />
          <div className="player-controls">
            {!isPlaying ? (
              <button onClick={handlePlay} className="control-button play">▶ Play</button>
            ) : (
              <button onClick={handlePause} className="control-button pause">⏸ Pause</button>
            )}
            <button onClick={handleMuteToggle} className="control-button mute">
              {isMuted ? "🔇 Unmute" : "🔈 Mute"}
            </button>
            <span className="time-info">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      )}

      <div className="chat-box">
        <h3>💬 Live Chat</h3>
        <div className="chat-messages">
          {chatMessages.map((msg, index) => (
            <div key={index} className="chat-message">
              <strong>{msg.sender}</strong>: {msg.text}
            </div>
          ))}
          {typingUsers.length > 0 && (
            <div className="chat-typing">
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-input">
          <input
            value={messageText}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            style={{
              backgroundColor: '#ccc',
              border: 'none',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Send
          </button>
        </div>
      </div>

      <div className="playlist-section">
        <h2 className="playlist-title">🎶Listen with me </h2>
        <div className="song-list">
          {playlist.map((song, index) => (
            <div
              key={index}
              className="song-card"
              onClick={() => handleSongSelect(song)}
            >
              {song.name}
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">Made for Aditi 🌼 by Harshit</footer>
    </div>
  );
}
