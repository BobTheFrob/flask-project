// CuteSmallerComponentsRawrXdUwU.jsx

export function HiddenMessage ({messageJson}) {
    const messageType = messageJson.type? `text-${messageJson.type}` : ""
    return <p className={`card-text small ${messageType}`}>{messageJson.message}</p>
}
