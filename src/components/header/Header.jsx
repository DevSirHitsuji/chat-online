import "./Header.css"
import $ from 'jquery'
import openIcon from "../../assets/open.png"
import closeIcon from "../../assets/close.png"

export default function header(props) {

    function closeMenu() {
        $(".users-list").hide()
    }

    function openMenu() {
        $(".users-list").show();
    }

    function disconect() {
        let name = localStorage.getItem("username")
        props.socket.send(JSON.stringify({"type": "logout", "content": `${name} disconected`}))
        localStorage.setItem("username", "");
    }

    return (
        <div id="menu">
            <header className="app-header">
                <button className="button-menu" onClick={openMenu}>
                    <img src={openIcon} alt="open .icon" />
                </button>
            </header>
            <div className="users-list">
                <div className="users-list-header">
                   <h2>Usuários online</h2>
                   <button onClick={closeMenu}>
                    <img src={closeIcon} alt="close .icon"/>
                   </button>
                </div>
                
                <div className="users">
                    {props.users.map((user, index) => (
                        <div className="" key={index}>{props.username == user ? <p>você <button className="disconect" onClick={() => disconect()}>sair</button></p> : <p>{user} <button className="ballgreen"></button></p>}</div>
                    ))}
                </div>
            </div>
        </div>

    )
}