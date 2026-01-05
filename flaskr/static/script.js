function edit_post(id) {
    textarea = document.getElementById(`editform-${id}`)
    textarea.classList.toggle("dhiddentextarea");
}