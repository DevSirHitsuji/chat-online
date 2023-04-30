import "./Rooms.css"

export default function Rooms(props) {
    return (
        <div className="rooms">
            {props.rooms.map((room, index) => (
                <div className="room" key={index} onClick={() => props.enterChat(room.id)} id={room.id}>
                    <p>{room.name}</p>
                </div>
            ))}
        </div>
    )
}