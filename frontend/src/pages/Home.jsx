import Base from './Base'

function HomeContent () {
    return (
        <>
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
        </div>
        <div>
            <div className="row g-3" id="update-videos-area"></div>
        </div>
        </>
    )
}

export default function Home ({title}) {
    return (
        <Base title="Home" content={<HomeContent/>}>
        </Base>
    )
}