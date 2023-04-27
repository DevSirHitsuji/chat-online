import React, { useEffect, useRef, useState } from 'react'
import $ from 'jquery'
import iconSend from "./assets/send.png"
import Header from './components/header/Header'
import './App.css'


function App() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]) ;
  const socket = useRef(null);

// wss://server-chat-online.onrender.com
// ws://localhost:3000
// ws://192.168.0.98:3000

  useEffect(() => {
    socket.current = new WebSocket("ws://192.168.0.98:3000");
    
    socket.current.onmessage = event => {
      const data = JSON.parse(event.data);
      
      if (data.type == "sucess") {
        localStorage.setItem("username", data.content);
        $(".input-username").hide();
      }

      if (data.type == "users") {
        setUsers(data.content);
      }

      if (data.type == "message"){
        setMessages(prevMessages => [...prevMessages, data]);
      }
      
      if (data.type == "failed") {
        $(".userexist").text(data.content)
        $(".userexist").show();
        setUsername("");
        $(".username").val("");
      }


      if (data.type == "online") {
        $(".online").text(`${data.content} online`);
        $(".online").show();
        setTimeout(() => {
          $(".online").hide();
        }, 3000)
      }

      if (data.type == "offline") {
        $(".online").text(`${data.content} saiu`);
        $(".online").show();
        setTimeout(() => {
          $(".online").hide();
        }, 3000)
      }

      if (data.type == "logout") {
        $(".online").text(data.content);
        $(".online").show();
        setTimeout(() => {
          $(".online").hide();
          location.reload();
        }, 3000)     
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

  useEffect(() => {
    let name = localStorage.getItem("username");
    if (name) {
      setUsername(name);
      $(".input-username-loading").show();
      $(".input-username-box").hide()

      setTimeout(() => {
        document.querySelector(".send-username").click()
        setTimeout(() => {
          $(".input-username-loading").hide();
          $(".input-username-box").show()
        }, 500)
        
      }, 1000) 
    }
  }, [])

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
      $(".message").val(['']);
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

  function sendUsernameEnter(event) {
    if (event.keyCode === 13) {
      document.querySelector(".send-username").click()
    }
  }

  function sendMessageEnter (event) {
    if (event.keyCode == 16) {
      return ''
    } else if (event.keyCode == 13) {
      return document.querySelector(".btn-send").click()
    }
  }

  return (
    <>
      <main>
        <form action=""><input className='reload' type='submit' value={"oi"}></input></form>
        <Header 
          users={users}
          socket={socket.current}
          username={localStorage.getItem("username")}
        />

        <div className='input-username'>

          <div className='input-username-loading'>
              <h2>Loading...</h2>
          </div>

          <div className='input-username-box'>
            <span className='userexist'></span>
            <input onKeyDown={sendUsernameEnter} className='username' type="text" placeholder='username...' maxLength={20} onChange={(e) => {setUsername(e.target.value)}}/>
            <button className='send-username' onClick={sendUsername}>entrar</button>
          </div>
        </div>

        <span className='online'></span>

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
        <div className='send-message'>
          <textarea onKeyDown={sendMessageEnter} className='message' type="text" placeholder='mensagem...' onChange={(e) => {setMessage(e.target.value)}}></textarea>
          <button onClick={sendMessage} className='btn-send' type="button">
            <img src={iconSend} alt="send .icon"/>
          </button>
        </div>
      </main>
    </>
  )
}

export default App
