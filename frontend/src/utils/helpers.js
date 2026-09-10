export function htmlToText(str) {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
}

export function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export async function parseResponse(response) {
    if (response.status === 204) {
        return {
            success: true,
            message: "No changes detected.",
            type: "warning"
        }
    }
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