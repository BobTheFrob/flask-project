import Base from './Base'

function LoginContent() {
    return (
    <>
        <div
            className="card bg-black text-light border-secondary text-warning dhiddenarea"
            id="dmessage"
        >
            <div className="card-body">
            <p className="card-text" />
            </div>
        </div>
        <div className="row row-cols-1 row-cols-lg-4 pt-5">
            <div className="col-lg-6">
            <div className="card bg-black text-light border-secondary mb-4">
                <div className="card-body py-5">
                <h2 className="h2 card-title px-lg-5">Login</h2>
                <hr />
                <form id="login-form" className="px-lg-5">
                    <div className="mb-3 row row-cols-1 row-cols-lg-4 align-items-center">
                    <div className="col col-lg-3">
                        <label className="form-label" htmlFor="login-username">
                        Username
                        </label>
                    </div>
                    <div className="col col-lg-9">
                        <input
                        className="form-control"
                        name="login-username"
                        id="login-username"
                        required=""
                        />
                    </div>
                    </div>
                    <div className="mb-3 row row-cols-1 row-cols-lg-4 align-items-center">
                    <div className="col col-lg-3">
                        <label className="form-label" htmlFor="login-password">
                        Password
                        </label>
                    </div>
                    <div className="col col-lg-9">
                        <input
                        className="form-control"
                        name="login-password"
                        id="login-password"
                        type="password"
                        required=""
                        />
                    </div>
                    </div>
                    <button className="btn btn-success w-100" type="submit">
                    Login
                    </button>
                </form>
                </div>
            </div>
            </div>
            <div className="col-lg-6">
            <div className="card bg-black text-light border-secondary mb-4">
                <div className="card-body py-5">
                <h2 className="h2 card-title px-lg-5">Register</h2>
                <hr />
                <form id="register-form" className="px-lg-5">
                    <div className="mb-3 row row-cols-1 row-cols-lg-4 align-items-center">
                    <div className="col col-lg-3">
                        <label className="form-label" htmlFor="register-username">
                        Username
                        </label>
                    </div>
                    <div className="col col-lg-9">
                        <input
                        className="form-control"
                        name="register-username"
                        id="register-username"
                        required=""
                        />
                    </div>
                    </div>
                    <div className="mb-3 row row-cols-1 row-cols-lg-4 align-items-center">
                    <div className="col col-lg-3">
                        <label className="form-label" htmlFor="register-password">
                        Password
                        </label>
                    </div>
                    <div className="col col-lg-9">
                        <input
                        className="form-control"
                        name="register-password"
                        id="register-password"
                        type="password"
                        required=""
                        />
                    </div>
                    </div>
                    <button className="btn btn-success w-100" type="submit">
                    Register
                    </button>
                </form>
                </div>
            </div>
            </div>
        </div>
    </>

    )
}

export default function Login () {
    return (
        <Base title="Login" header="Welcome To DMedias!" content={<LoginContent></LoginContent>}>
        </Base>
    )
}