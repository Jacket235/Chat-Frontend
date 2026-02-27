import ChatBox from './components/ChatBox/ChatBox'
import DefaultLayout from './layouts/Default'
import './App.scss'

function App() {
    return (
        <div className='app'>
            <DefaultLayout>
                <ChatBox />
            </DefaultLayout>
        </div>
    )
}

export default App
