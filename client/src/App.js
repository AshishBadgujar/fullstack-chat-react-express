import React, { useState, useEffect, useRef } from 'react'
import Navbar from './components/navbar';
import io from 'socket.io-client';

let socket;

function App() {
  const CONNECTION_PORT = 'localhost:3002';
  const [isLogin, setIsLogin] = useState(false)
  const [room, setRoom] = useState('')
  const [username, setUsername] = useState('')
  const [msg, setMsg] = useState('')
  const [msgList, setMsgList] = useState([])
  const [users, setUsers] = useState([])
  const msgEndRef = useRef(null)

  useEffect(() => {
    socket = io(CONNECTION_PORT, { transports: ['websocket', 'polling', 'flashsocket'] });
  }, [CONNECTION_PORT]);

  useEffect(() => {
    let username = sessionStorage.getItem('username')
    let room = sessionStorage.getItem('room')
    if (username && room) {
      setUsername(username)
      setRoom(room)
      socket.emit('join-room', { username, room });
      setIsLogin(true)
    }
  }, [])

  useEffect(() => {
    socket.on('message', message => {
      setMsgList([...msgList, message]);
      //scroll down
      msgEndRef.current.scrollTop = msgEndRef.current.scrollHeight;
    })
    // get user and room 
    socket.on('roomUsers', ({ room, users }) => {
      setRoom(room)
      setUsers(users)
    });
  })

  const connectRoom = async (e) => {
    e.preventDefault();
    await socket.emit('join-room', { username, room });
    setIsLogin(true)
    await sessionStorage.setItem('username', username)
    await sessionStorage.setItem('room', room)
  }
  const sendMsg = async (e) => {
    e.preventDefault();
    await socket.emit('chatMessage', msg);
    setMsg('');
  }

  return (
    <div className="App">
      <Navbar isLogin={isLogin} setIsLogin={setIsLogin} users={users} room={room} />
      {isLogin ?
        (
          <div className="container">
            <div className="chat-messages" ref={msgEndRef}>
              {msgList.map(message => {
                if (message.username === '') {
                  return <div className="center1"><p>{message.text}</p></div>
                }
                else {
                  if (message.username === username) {
                    return <div className="message right"><p className="text">{message.text}</p><p className="meta"><span className="right">{message.time}</span></p></div>
                  } else {
                    return <div className="message left"><p className="meta">{message.username}-<span>{message.time}</span></p><p className="text">{message.text}</p></div>
                  }
                }
              })}
            </div>
            <form action="" className="chat" id="chat-form" onSubmit={(e) => sendMsg(e)}>
              <div className="input-field">
                <input id="msg" required type="text" value={msg} onChange={(e) => setMsg(e.target.value)} autoComplete="off" placeholder="Type..." />
              </div>
              <button className="btn waves-effect waves-light sendbtn" type="submit" name="action"><i
                className="material-icons">send</i></button>
            </form>
          </div>
        )
        :
        (
          <main className="container flex">
            <form className="container main" onSubmit={(e) => connectRoom(e)}>
              <h3 className="h3">Join</h3>
              <div className="input-field">
                <input id="name" name='username' type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Enter username" autoComplete="off" />
              </div>
              <div className="input-field">
                <input id="room" name="room" type="text" value={room} onChange={(e) => setRoom(e.target.value)} required placeholder="Enter room" autoComplete="off" />
              </div>
              <button className="btn waves-effect waves-light" type="submit" name="action">Join</button>
            </form>
          </main>
        )
      }
    </div>
  );
}

export default App;
