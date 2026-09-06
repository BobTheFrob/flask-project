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
