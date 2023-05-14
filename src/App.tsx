import { Fragment, useState, useEffect, ChangeEvent } from 'react';
import { Room } from './common/common.types';

function App() {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleRoomIdChange = (e: ChangeEvent<HTMLInputElement>) =>
    setRoomId(e.target.value);

  useEffect(() => {
    const source = new EventSource('https://nestjs-sse.herokuapp.com/rooms/notif');
    fetch('https://nestjs-sse.herokuapp.com/rooms')
      .then((res) => res.json())
      .then((rooms) => {
        setRooms([...rooms]);
      });
    source.onmessage = (e: MessageEvent<string>) => {
      const rooms: Room = JSON.parse(e.data);
      console.log(rooms);
      setRooms((oldRooms) => [...oldRooms, rooms]);
    };
    return () => {
      source.close();
    };
  }, []);

  const createRoom = async () => {
    const body = { title, name };
    const req = await fetch('https://nestjs-sse.herokuapp.com/rooms', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await req.json();
    console.log(data);
    setTitle('');
    setName('');
  };

  const joinRoom = async () => {
    const req = await fetch(`https://nestjs-sse.herokuapp.com/rooms/${roomId}`);
    const data = await req.json();

    console.log(data);
  };

  return (
    <Fragment>
      <div>
        <ul>
          {rooms.map((room, i) => (
            <li key={`${room.title}_${i}`} title={room.id}>{room.title}</li>
          ))}
        </ul>
      </div>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        <label htmlFor="name">Name :</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleNameChange}
        />
      </div>
      <button disabled={!(name || title)} onClick={createRoom}>
        Create Room
      </button>
      <hr />
      <div>
        <label htmlFor="title">Room ID:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={roomId}
          onChange={handleRoomIdChange}
        />
      </div>
      <button disabled={!roomId} onClick={joinRoom}>
        Join Room
      </button>
    </Fragment>
  );
}

export default App;
