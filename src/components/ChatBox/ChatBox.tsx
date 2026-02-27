import { useEffect, useRef, useState } from 'react'
import Button from '../Button/Button'
import { fetchAPI } from '../../utils/fetchAPI'
import InputTextField from '../InputTextField/InputTextField'
import SendIcon from '/src/assets/send.svg?react'
import Message from '../Message/Message'
import './chat-box.scss'

export default function ChatBox() {
    const [connected, setConnected] = useState<boolean>(false)
    const [clientID, setClientID] = useState<string | null>(null)
    const wsRef = useRef<WebSocket | null>(null)

    const [events, setEvents] = useState<string[]>([])
    const [messages, setMessages] = useState<string[]>([])
    const [draft, setDraft] = useState<string>("")

    const handleConnect = async () => {
        if (wsRef.current) return

        const res = await fetchAPI("ws/config")
        const ws = new WebSocket(res.wsUrl)

        ws.addEventListener('open', () => {
            wsRef.current = ws
            setConnected(true)
        })

        ws.addEventListener('message', (event) => {
            const data = JSON.parse(event.data as string)

            if (data.type === 'connected') {
                setClientID(data.clientID)
                setEvents(prev => [`Dołączyłeś jako ${data.clientID}`, ...prev])
            }

            if (data.type === 'user_joined') {
                setEvents(prev => [ ...prev, `${data.clientID} dołączył do rozmowy`])
            }

            if (data.type === 'chat_message') {
                console.log("Someone tried to send a message")
            }
        })

        ws.addEventListener('close', () => {
            wsRef.current = null
            setConnected(false)
            setClientID(null)
        })
    }

    useEffect(() => {
        return () => wsRef.current?.close()
    }, [])

    return(
        <div className="chat-box">
            <div className='chat-box-container'>
                {!connected && <Button label='Dołącz' onClick={handleConnect} />}
                {events.map((e, i) => (
                    <p key={`${e}-${i}`} className='system-message'>
                        {e}
                    </p>
                ))}
                {messages.map((msg, i) => (
                    <Message key={i} text={msg} reply={false}/>
                ))}
            </div>
            <div className='chat-box-actions'>
                <InputTextField 
                    disabled={!connected}
                    value={draft}
                    placeholder='Aa'
                    onChange={e => setDraft(e.target.value)}
                />
                <button type="button">
                    <SendIcon />
                </button>
            </div>
        </div>
    )
}