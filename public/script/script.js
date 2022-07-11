const room = window.location.pathname.replace(/\//g, '')
const socket = io(`http://localhost:3000/${room}`)

document.addEventListener('DOMContentLoaded', () => {

    const userForm = document.querySelector('#user_form')
    userForm.addEventListener('submit', (e) => {
        e.preventDefault()
        room_server = document.forms['user_form_name']['room_server'].value
        socket.emit('try_create_server', { server: room_server })

        socket.on('try_create_server', (info) => {

            if (info == 'new server created') {
                window.location.href = `http://localhost:3000/${room_server}`;
            } else {
                let create_room_h2 = document.getElementById('create_room_h2')
                create_room_h2.innerText = 'Server already exists '
            }
        })
    })

    const connect_server = document.querySelector('#connect_server_form')
    connect_server.addEventListener('submit', (e) => {
        e.preventDefault()
        room_server_connect = document.getElementById('room_server_connect').value
        socket.emit('try_connect_server', { server: room_server_connect })

        socket.on('try_connect_server', (info) => {

            if (info == 'y') {
                window.location.href = `http://localhost:3000/${room_server_connect}`;
            } else {
                let connection_room_h2 = document.getElementById('connection_room_h2')
                connection_room_h2.innerText = 'Do you need create this server'
            }
        })
    })
})


