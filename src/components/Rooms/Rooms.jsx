import "./Rooms.css"

export default function Rooms(props) {
    return (
        <div className="rooms">
            {props.rooms.map((room, index) => (
                <div className="room" key={index} onClick={() => props.enterChat(room.room?.id)} id={room.room?.id}>
                    <p className="title-room">{room.room?.name}</p>
                    {room?.lastMessage ?
                        <div className="preview-message">
                            <div className="preview-message-data">
                                <p className="preview-message-username">{room.lastMessage?.username}</p>
                                <p className="preview-message-hour">{room.lastMessage?.date}</p>
                            </div>
                            <p className="preview-message-content">{room.lastMessage?.content}</p>
                        </div> :
                        ""
                    }
                    
                </div>
            ))}
        </div>
    )
}