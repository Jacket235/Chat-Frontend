import { useState } from 'react'
import Button from '../Button/Button'
import './chat-box.scss'

export default function ChatBox() {
    const [connected, setConnected] = useState<boolean>(false);

    const handleConnect = () => {
        setConnected(true)
    }

    return(
        <div className="chat-box">
            <div className='chat-box-container'>
                <Button label='Dołącz' onClick={handleConnect} disabled={connected}/>
            </div>
        </div>
    )
}