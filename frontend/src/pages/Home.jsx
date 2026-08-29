import Base from './Base'
import { useEffect } from 'react';
import { useAuth } from '../components/UserProvider';

export default function Home () {
    const {user, setUser, userLoading} = useAuth()
    useEffect(() => {
        console.log("useContext: ", user)
    },[user])
    return (
        <Base title="Home">
            <div className="card bg-black text-light border-secondary mb-3">
                <div className="card-body">
                <p>Hello world, welcome to my site!</p>
                <p>
                    Armed with knowledge from my CS3720 course, this is my first Flask
                    project.
                </p>
                <p>
                    I'm planning to make simple media tracking, like favourites and stuff.
                </p>
                <h4>Here's some videos on Jojo's in the meantime!</h4>
                </div>
                    {userLoading?
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    :
                    console.log("loaded")}
            </div>
            <div>
                <div className="row g-3" id="update-videos-area"></div>
            </div>
        </Base>
    )
}