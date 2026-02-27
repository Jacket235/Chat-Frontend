import './input-text-field.scss'

export default function InputTextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return(
        <label className='input-text-field'>
            <input {...props}/>
        </label>
    )
}