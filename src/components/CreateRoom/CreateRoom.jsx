import "./CreateRoom.css"
import { useState } from "react"
import $ from "jquery"
export default function CreateRoom(props) {

    const [members, setMembers] = useState([]);
    const [place, setPlace] = useState("Nome da sala...")

    function select(id, name) {
        if (name !== localStorage.getItem("username")) {
            let isSelect = $(id).hasClass("select")
            if (isSelect) {
                $(id).removeClass("select")
                members.map((member, index) => {
                    if (member == name) {
                        let newList = members;
                        newList.splice(index, 1)
                        setMembers(newList);
                    }
                })
    
            }else {
                $(id).addClass("select")
                setMembers(prevMembers => [...prevMembers, name])
    
            }
        }
    }

    function cancel() {
        let input = $(".name-room")
        input.val("");
        setMembers([])
        $(".user-option").removeClass("select");
        input.removeClass("invalid")
        input.addClass("valid")
        $(".new-room").hide();      
    }

    function create(socket) {
        let input = $(".name-room")
        if (input.val().trim()) {
            input.removeClass("invalid")
            input.addClass("valid")

            members.push(localStorage.getItem("username"));

            socket.send(JSON.stringify({
                "type" : "createRoom",
                "name" : input.val().trim(),
                "users" : members
            }))
    
            input.val("");
            setMembers([])
            $(".user-option").removeClass("select");
            $(".new-room").hide();  
        } else {
            setPlace("Escolha um nome!!")
            input.removeClass("valid");
            input.addClass("invalid");
        }

    }

    return (
        <div className="new-room">
            <h2>Novo chat</h2>
            <div className="list-users">
                <input onKeyDown={props.createRoomEnter} className="name-room valid" name="name-room" type="text" placeholder={place} maxLength={20}/>
                {props.users.map((user, index) => (
                    
                    <div 
                    key={index} 
                    className={user == localStorage.getItem("username") ? `user-option you` : "user-option"} 
                    id={user + index + index} 
                    onClick={() => select(`#${user + index + index}`, user)}>
                        <p>{user == localStorage.getItem("username") ? "Você" : user}</p>
                    </div>
                ))}
            </div>
            <div>
               <button className="btn-create" onClick={() => create(props.socket)}>CRIAR</button>
               <button className="btn-cancel" onClick={() => cancel()}>CANCELAR</button> 
            </div>
            
        </div>
    )
}