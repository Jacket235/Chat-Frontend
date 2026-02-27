import './message.scss'

export default function Message({ text, reply }: { text: string, reply?: boolean }) {
    return(
        <div className={`message-container${reply ? " reply" : ""}`}>
            <span className='text'>
                {text}
            </span>
        </div>
    )
}