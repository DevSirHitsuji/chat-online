import "./Login.css"

export default function Login(props) {
    return (
        <div className='input-username'>
            <div className='input-username-loading'>
                <h2>Loading...</h2>
            </div>
            
            <div className='input-username-box'>
                <span className='userexist'></span>
                <input onKeyDown={props.sendUsernameEnter} className='username' type="text" placeholder='username...' maxLength={20} onChange={(e) => {props.setUsername(e.target.value)}}/>
                <button className='send-username' onClick={props.sendUsername}>entrar</button>
            </div>
        </div>
    )
}