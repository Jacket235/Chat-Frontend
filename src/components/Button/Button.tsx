import './button.scss'

export default function Button({ label, ...props }: { label?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return(
        <button className='button' type="button" {...props}>
            {label}
        </button>
    )
}