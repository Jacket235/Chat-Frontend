import Message from '../Message/Message'
import './chat-box.scss'

export default function ChatBox() {
    return(
        <div className="chat-box">
            <div className='chat-box-container'>
                <Message text='Hej'/>
                <Message text='This is a message bigger than the average one' reply/>
            </div>
        </div>
    )
}