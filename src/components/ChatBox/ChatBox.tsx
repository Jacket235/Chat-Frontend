import { useEffect, useRef, useState } from 'react'
import Button from '../Button/Button'
import { fetchAPI } from '../../utils/fetchAPI'
import InputTextField from '../InputTextField/InputTextField'
import SendIcon from '/src/assets/send.svg?react'
import Message from '../Message/Message'
import './chat-box.scss'

type TimelineItem =
    | { id: string; kind: "event"; text: string }
    | { id: string; kind: "message"; text: string; clientID: string; username: string }

export default function ChatBox() {
    const [connected, setConnected] = useState<boolean>(false)
    const [clientID, setClientID] = useState<string | null>(null)
    const [username, setUsername] = useState<string>("")
    const wsRef = useRef<WebSocket | null>(null)

    const [timeline, setTimeline] = useState<TimelineItem[]>([])
    const [draft, setDraft] = useState<string>("")

    const messagesRef = useRef<HTMLDivElement | null>(null)

    const handleConnect = async () => {
        if (wsRef.current) return

        const name = username.trim()

        const res = await fetchAPI("ws/config")
        const ws = new WebSocket(
            `${res.wsUrl}?username=${encodeURIComponent(name)}`
        )

        ws.addEventListener('open', () => {
            wsRef.current = ws
            setConnected(true)
        })

        ws.addEventListener('message', (event) => {
            const data = JSON.parse(event.data as string)

            if (data.type === "connected") {
                setClientID(data.clientID)
                setTimeline(prev => [
                    ...prev,
                    { id: Date.now().toString(), kind: "event", text: `Dołączyłeś jako ${data.username}` },
                ])
            }

            if (data.type === "user_left") {
                setTimeline(prev => [
                    ...prev,
                    { id: Date.now().toString(), kind: "event", text: `${data.username} wyszedł` },
                ])
            }

            if (data.type === "user_joined") {
                setTimeline(prev => [
                    ...prev,
                    { id: Date.now().toString(), kind: "event", text: `${data.username} dołączył do rozmowy` },
                ])
            }

            if (data.type === 'chat_message') {
                setTimeline(prev => [
                    ...prev,
                    { id: Date.now().toString(), kind: "message", text: data.text, clientID: data.clientID, username: data.username },
                ])
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

    useEffect(() => {
        const el = messagesRef.current
        if (!el) return
        el.scrollTop = el.scrollHeight
    }, [timeline])

    const handleSendMessage = () => {
        const ws = wsRef.current
        const text = draft.trim()
        if (!ws || !text) return

        ws.send(JSON.stringify({ type: "chat_message", text }))
        setDraft("")
    }

    return(
        <div className="chat-box">
            <div className='chat-box-container' ref={messagesRef}>
                {!connected && (
                    <>
                        <InputTextField 
                            placeholder='Nazwa' 
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <Button label='Dołącz' onClick={handleConnect} />
                    </>
                )}
                {timeline.map((item, i) => {
                    if (item.kind === "event") return <p key={item.id} className="system-message">{item.text}</p>

                    const prev = timeline[i - 1]
                    const next = timeline[i + 1]
                    const isGroupedWithPrevious = prev?.kind === "message" && prev.clientID === item.clientID
                    const isGroupedWithNext = next?.kind === "message" && next.clientID === item.clientID

                    return(
                        <Message
                            key={item.id}
                            username={item.username ?? item.clientID}
                            text={item.text}
                            reply={item.clientID !== clientID}
                            groupPrev={isGroupedWithPrevious}
                            groupNext={isGroupedWithNext}
                        />
                    )
                })}
            </div>
            <div className='chat-box-actions'>
                <InputTextField 
                    disabled={!connected}
                    value={draft}
                    placeholder='Aa'
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === "Enter")  handleSendMessage()
                    }}
                />
                <button type="button" onClick={handleSendMessage}>
                    <SendIcon />
                </button>
            </div>
        </div>
    )
}