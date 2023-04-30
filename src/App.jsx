import React, { useEffect, useRef, useState } from 'react'
import $ from 'jquery'



import Header from './components/header/Header'
import './App.css'

// assets
import blop from "./assets/sounds/res.mp3"

//functions import 
import getHour from './controllers/getHour'
import Chat from './components/Chat/Chat'
import Rooms from './components/Rooms/Rooms'
import InputMessage from './components/InputMessage/InputMessage'

function App() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [chatId, setChatId] = useState("");
  const [inChat, setInChat] = useState(false);
  const [messages, setMessages] = useState([]) ;
  const socket = useRef(null);

// wss://server-chat-online.onrender.com
// ws://localhost:3000

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:3000");
    
    socket.current.onmessage = event => {
      const data = JSON.parse(event.data);

      if (data.type == "sucess") {
        localStorage.setItem("username", data.content);
        $(".input-username").hide();
      }

      if (data.type == "users") {
        setUsers(data.content);
      }

      if (data.type == "rooms") {
        setRooms(data.content);
      }

      if (data.type == "message"){
        $(".sound-notify")[0].play();
        setMessages(prevMessages => [...prevMessages, data]);
      }

      if (data.type == "loadRoom") {
        setMessages(data.content);
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
        if (data.content) {
          $(".online").text(`${data.content} saiu`);
          $(".online").show();
          setTimeout(() => {
            $(".online").hide();
          }, 3000)
        }
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
        }, 1000)     
      }, 1000) 
    }
  }, [])

  function sendMessage() {
    if (message.trim() !== '') {
      const Message = {
        "type" : "message",
        "roomId" : chatId,
        "content" : message.trim(),
        "date" : getHour(),
        "username": localStorage.getItem("username")
      }
      socket.current.send(JSON.stringify(Message));
      setMessage("");
      $(".message").val(['']);
    }
  }

  function sendRoom(id) {
    const Room = {
      "type" : "getRoom", 
      "id" : id
    }
    socket.current.send(JSON.stringify(Room))
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
        <audio className='sound-notify' src={blop}></audio>
        <Header 
          users={users}
          inChat={inChat}
          socket={socket.current}
          username={localStorage.getItem("username")}
          backToRooms={() => {
            $(".send-message").hide();
            setInChat(false);
          }}
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

        {inChat ? 
          <Chat 
            messages={messages}
          /> : 
          <Rooms 
            rooms={rooms}
            enterChat={(id) => {
              $(".send-message").css("display", "flex")
              sendRoom(id);
              setChatId(id)
              setInChat(true)
            }}
          />
        }
        
        <InputMessage 
          sendMessageEnter={sendMessageEnter}
          sendMessage={sendMessage}
          setMessage={setMessage}
        /> 

      </main>
    </>
  )
}

export default App
