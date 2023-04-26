import { useEffect, useRef, useState } from 'react'
import $ from 'jquery'
import iconSend from "./assets/send.png"
import Header from './components/header/Header'
import './App.css'


function App() {
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("")
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]) 
  const socket = useRef(null)

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:3000");
    
    socket.current.onmessage = event => {
      const data = JSON.parse(event.data)
      
      if (data.type == "sucess") {
        localStorage.setItem("username", data.content);
        $(".input-username").hide();
      }

      if (data.type == "users") {
        setUsers(data.content);
      }

      if (data.type == "message"){ 
        setMessages(prevMessages => [...prevMessages, data])
      }
      
      if (data.type == "failed") {
        window.alert(data.content);
        setUsername("");
        $(".username").val("");
      }

    }

    socket.current.onerror = (error) => {
      console.log("Conection error: " + error);
    }

    socket.current.onclose = () => {
      console.log("Connection closed")
    }

    return () => {
      socket.current.close();
    }

  }, []);

  function getDate() {
    let currentDate = new Date;
    let hour = (currentDate.getHours()<10 ? '0' : "") + currentDate.getHours();
    let minutes = (currentDate.getMinutes()<10 ? '0' : "") + currentDate.getMinutes();
    return `${hour}:${minutes}`
  }

  function sendMessage() {
    if (message.trim() !== '') {
      const Message = {
        "type" : "message",
        "content" : message.trim(),
        "date" : getDate(),
        "username": localStorage.getItem("username")
      }

      socket.current.send(JSON.stringify(Message));
      setMessage("");
      $(".message").val("");
    }
  }

  function sendUsername() {
    if (username.trim() !== '') {
      const Username = {
        "type" : "username",
        "content" : username.trim()
      }
      socket.current.send(JSON.stringify(Username));
    }
  }

  return (
    <>
      <main>
        <Header 
          users={users}

        />
        <div className='input-username'>
          <div className='input-username-box'>
            <input className='username' type="text" placeholder='username...' maxLength={20} onChange={(e) => {setUsername(e.target.value)}}/>
            <button onClick={sendUsername} >entrar</button>
          </div>
        </div>

        <section className='chat'>
          {messages.map((message, index) => (
              <div id={message.username + index} className={`chat-message ${localStorage.getItem("username") == message.username ? "right" : "left"}`} key={index}>
                <div className='chat-message-data'>
                  <p className='data-username'>{localStorage.getItem("username") == message.username ? "você" : message.username}</p>
                  <p className='data-hour'>{message.date}</p>
                </div>             
                <p className='message-content'>{message.content}</p>
              </div>     
            ))}
        </section>
        <div id='recents'></div>
        <div className='send-message'>
          <textarea className='message' type="text" placeholder='mensagem...' onChange={(e) => {setMessage(e.target.value)}}></textarea>
          <button onClick={sendMessage} className='btn-send' type="button">
            <img src={iconSend} alt="send .icon"/>
          </button>
        </div>
      </main>
    </>
  )
}

export default App
