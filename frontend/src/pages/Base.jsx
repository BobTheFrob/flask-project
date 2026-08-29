import { useAuth } from '../components/UserProvider';

function BasicBSSpinner () {
    return (
        <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    )
}

function LoggedInNavUser () {
    const {user} = useAuth()
    return (
        <>
         <button className="btn btn-danger btn-sm p-2 px-3" id="logout-btn">
            Logout
        </button>
        <li className="nav-item mx-4 rounded bg-secondary p-2 px-3">
            {user["username"]}
        </li>
        </>
    )
}

function UserNavInfo () {
    const {user, userLoading} = useAuth()

    return (
        <ul className="navbar-nav mb-2 mb-sm-0 d-flex flex-row-reverse pe-5">
            {
                userLoading?
                <BasicBSSpinner /> : 
                user?
                    <LoggedInNavUser /> :
                    <a className="btn btn-outline-light btn-sm p-2 px-3" href="/login">
                    Login
                    </a>
            }
        </ul>
    )
}

export default function Base ({title, header, children}) {
    return (
        <>
        <title>
            {`${title} - DMedias`}
        </title>
        <div className="bg-dark text-light min-vh-100">

            <nav className="navbar navbar-expand-sm navbar-dark bg-black sticky-top border-bottom border-secondary">
                <div className="container">
                <a className="navbar-brand fs-2" href="{{ url_for('home.index') }}">
                    <img
                    width={30}
                    height={30}
                    className="img-responsive rounded float-start mx-2"
                    src="https://imgs.search.brave.com/VgBo9e5yrVE37YZFBxg_HjV01zPM0ljrEb8P05-GXJQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzY1L2U4/L2YzLzY1ZThmMzhl/ZmEyMTllNjY2MmNl/MWU2YTNkNzFiMzI3/LmpwZw"
                    />
                    DMedias
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNav"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="mainNav">
                    <ul className="navbar-nav me-auto mb-2 mb-sm-0">
                    <li className="nav-item me-2">
                        <a className="nav-link" href="/">
                        Home
                        </a>
                    </li>
                    <li className="nav-item me-2">
                        <a className="nav-link" href="/posts">
                        Anime
                        </a>
                    </li>
                    </ul>
                    <UserNavInfo></UserNavInfo>
                </div>
                </div>
            </nav>
            <main className="container py-4">
                <header className="mb-4">
                <h1 className="display-3 px-5">{header? header : title}</h1>
                <hr />
                </header>
                <div className="px-lg-5 px-md-3 px-sm-6">
                {children}
                </div>
            </main>
        </div>
        </>

    )
}