
import { useRef } from "react";
import "./Chat.css"

export default function Chat(props) {
  return (
      <section ref={props.down} className='chat'>
      <span>{props.messages ? "" : "Nenhuma mensagem!"}</span>
      {props.messages.map((message, index) => (
          <div id={message.username + index} className={`chat-message ${localStorage.getItem("username") == message.username ? "right" : "left"}`} key={index}>
            <div className='chat-message-data'>
              <p className='data-username'>{localStorage.getItem("username") == message.username ? "você" : message.username}</p>
              <p className='data-hour'>{message.date}</p>
            </div>             
            <p className='message-content'>{message.content}</p>
          </div>  
        ))}
    </section>
  )
}