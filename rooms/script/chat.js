
const room = window.location.pathname.replace(/\//g, '')
var url = 'http://localhost:3000/'
const socket = io(`${url}${room}`)


socket.on('update_messages', (messages) => {
    updateMessagesOnScreen(messages)
})

function updateMessagesOnScreen(messages) {
    const div_messages = document.querySelector('#messages');

    let list_messages = '<ul id="list">'
    messages.forEach(message => {
        list_messages += `<li><strong>${message.user}</strong>: ${message.msg}</li>`
    })

    list_messages += '</ul>'
    div_messages.innerHTML = list_messages
}

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('#message_form')
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const message = document.forms['message_form_name']['msg'].value;
        document.forms['message_form_name']['msg'].value = ''
        socket.emit('new_message', { user: user, msg: message })
    })

    const userForm = document.querySelector('#user_form')
    userForm.addEventListener('submit', (e) => {
        e.preventDefault()
        findUser();
    })
})

function findUser() {
    let nameUser = document.getElementById('user').value;
    socket.emit('userFind', nameUser)

    socket.on('userFind', (info) => {

        let user_text = document.getElementById('user_text')
        user_text.innerText = 'User already exists'
    })

    socket.on('user_not_found', (info) => {
        user = document.forms['user_form_name']['user'].value;
        socket.emit('user', { user })

        let user_box = document.getElementById('user_box')
        user_box.style.display = 'none'

        let chatBox = document.getElementById('chatBox')
        chatBox.style.display = 'inline-block'

        let server_text = document.getElementById('server_text')
        server_text.innerText += ` ${info}`

    })

}
