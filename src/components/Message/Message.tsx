import './message.scss'

export default function Message({ text, username, reply }: { text?: string, username: string, reply?: boolean }) {
    return(
        <div className={`message-container${reply ? " reply" : ""}`}>
            <span className='username'>
                {username}
            </span>
            <span className='text'>
                {text}
            </span>
        </div>
    )
}