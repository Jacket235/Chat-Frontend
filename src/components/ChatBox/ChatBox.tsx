import { useEffect, useRef, useState } from 'react'
import Button from '../Button/Button'
import { fetchAPI } from '../../utils/fetchAPI'
import './chat-box.scss'


export default function ChatBox() {
    const [connected, setConnected] = useState<boolean>(false)
    const [clientID, setClientID] = useState<string | null>(null)
    const wsRef = useRef<WebSocket | null>(null)

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
                setClientID(data.clientId)
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
                <Button label='Dołącz' onClick={handleConnect} disabled={connected}/>
            </div>
        </div>
    )
}