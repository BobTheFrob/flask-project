import { useState } from 'react';
import Base from './Base'

async function parseAuthResponse(response) {
    const data = await response.json()
    if (response.status === 201) {
        return {
            success: true,
            message: data.message,
            type: "success"
        }
    }
    if (response.status === 400) {
        return {
            success: false,
            message: data.error,
            type: "danger"
        }
    }
    if (response.status === 409) {
        return {
            success: false,
            message: data.error,
            type: "warning"
        }
    }
    if (!response.ok) {
        return {
            success: false,
            message: data.error || "Something went wrong.",
            type: "danger"
        }
    }

    return {
        success: true,
        message: data.message,
        type: "success"
    }
}

function RegisterSection ({ setMessage, setMessageType, setHiddenMessage }) {
    const [registerDetails, setRegisterDetails] = useState({
        username: "",
        password: ""
    })
    function handleUsernameChange (e) {
        setRegisterDetails({
            ...registerDetails,
            username: e.target.value
        })
    }
    function handlePasswordChange (e) {
        setRegisterDetails({
            ...registerDetails,
            password: e.target.value
        })
    }

    async function registerHandler(e) {
        e.preventDefault()
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: registerDetails.username, password: registerDetails.password})
        })
        
        const result = await parseAuthResponse(response)

        setMessage(result.message)
        setMessageType(result.type)

        if (result.success) {
            setRegisterDetails({
                username: "",
                password: ""
            })
        }
        e.target.reset()
        }
    return (
        <div className="col-lg-6">
            <div className="card bg-black text-light border-secondary mb-4">
                <div className="card-body py-5">
                <h2 className="h2 card-title px-lg-5">Register</h2>
                <hr />
                <form id="register-form" className="px-lg-5" onSubmit={registerHandler}>
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
                        value={registerDetails.username}
                        onChange={handleUsernameChange}
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
                        value={registerDetails.password}
                        onChange={handlePasswordChange}
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
    )
}

function LoginSection ({ setMessage, setMessageType, setHiddenMessage }) {
    const [loginDetails, setLoginDetails] = useState({
        username: "",
        password: ""
    })
    function handleUsernameChange (e) {
        setLoginDetails({
            ...loginDetails,
            username: e.target.value
        })
    }
    function handlePasswordChange (e) {
        setLoginDetails({
            ...loginDetails,
            password: e.target.value
        })
    }

    async function loginHandler(e) {
        e.preventDefault()
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: loginDetails.username, password: loginDetails.password})
        })
        
        const result = await parseAuthResponse(response)

        if (response.ok) {
            window.location.href = "/posts"
            return
        }

        setMessage(result.message)
        setMessageType(result.type)
        e.target.reset()
        }

    return (
        <div className="col-lg-6">
            <div className="card bg-black text-light border-secondary mb-4">
                <div className="card-body py-5">
                <h2 className="h2 card-title px-lg-5">Login</h2>
                <hr />
                <form id="login-form" className="px-lg-5" onSubmit={loginHandler}>
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
                        value={loginDetails.username}
                        onChange={handleUsernameChange}
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
                        value={loginDetails.password}
                        onChange={handlePasswordChange}
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
    )
}

export default function Login () {
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("")
    const [hiddenMessage, setHiddenMessage] = useState("dhiddenarea")
    return (
        <Base title="Login" header="Welcome To DMedias!">
            <div className={`card bg-black text-light border-secondary text-${messageType} ${hiddenMessage}`} id="dmessage">
                <div className="card-body">
                <p className={`card-text text-${messageType}`}>
                {message}
                </p>
                </div>
            </div>
            <div className="row row-cols-1 row-cols-lg-4 pt-5">
                <LoginSection setMessage={setMessage} setMessageType={setMessageType} setHiddenMessage={setHiddenMessage}></LoginSection>
                <RegisterSection setMessage={setMessage} setMessageType={setMessageType} setHiddenMessage={setHiddenMessage}></RegisterSection>
            </div>
        </Base>
    )
}