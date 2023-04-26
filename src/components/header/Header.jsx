import "./header.css"
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
                    <img src={closeIcon} alt="" srcset="" />
                   </button>
                </div>
                
                <div className="users">
                    {props.users.map((user, index) => (
                        <p key={index}>{user}</p>
                    ))}
                </div>
            </div>
        </div>

    )
}