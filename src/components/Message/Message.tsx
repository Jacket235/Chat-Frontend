import './message.scss'

export default function Message({ text, username, groupPrev, groupNext, reply }: { text?: string, username: string, groupPrev: boolean, groupNext: boolean, reply?: boolean }) {
    return(
        <div className={`
            message-container
            ${reply ? " reply" : ""}
            ${groupPrev && groupNext ? " group-both" : ""}
            ${!groupPrev && groupNext ? "group-next" : ""}
            ${groupPrev && !groupNext ? "group-prev" : ""}
        `}>
            {!groupPrev && 
                <span className='username'>
                    {username}
                </span>
            }
            <span className='text'>
                {text}
            </span>
        </div>
    )
}