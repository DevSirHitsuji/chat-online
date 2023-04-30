import "./InputMessage.css"

import iconSend from "../../assets/send.png"

export default function InputMessage(props) {
    return (
        <div className='send-message'>
          <textarea onKeyDown={props.sendMessageEnter} className='message' type="text" placeholder='mensagem...' onChange={(e) => {props.setMessage(e.target.value)}}></textarea>
          <button onClick={props.sendMessage} className='btn-send' type="button">
            <img src={iconSend} alt="send .icon"/>
          </button>
        </div>
    )
}