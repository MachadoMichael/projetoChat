const express = require('express')
const { url } = require('inspector')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const socketIO = require('socket.io')

app.use('/', express.static(path.join(__dirname, 'public')))
app.get('/', (req, res)=>{
    res.send(port)
})

const server = app.listen(port, () => {
    console.log('Running on PORT ' + port)
})

const messages = {}
const people = []
const rooms = []

const io = socketIO(server)

const new_talk_room = io.of('/').on('connection', (socket) => {
    socket.on('try_create_server', (url) => {
        let serverName = url.server
        if (rooms.indexOf(serverName) > -1) {
            socket.emit('try_create_server', 'server always exist')
        } else {
            createNewRouter(serverName)
            socket.emit('userServer', { server: url.server })
            socket.emit('try_create_server', 'new server created')
        }
    })

    socket.on('try_connect_server', (url) =>{
        let serverName = url.server
        if (rooms.indexOf(serverName) > -1) {
            socket.emit('try_connect_server', 'y')
        } else {
            socket.emit('userServer', { server: url.server })
            socket.emit('try_connect_server', 'n')
        }
    })

    socket.on('user', (info) => {
        socket.emit('userServer', { user: info.user })
    })

})

function createNewRouter(serverName) {
    rooms.push(serverName)
    app.use(`/${serverName}`, express.static(path.join(__dirname, 'rooms')))

    messages[serverName] = new Array
    createNewUser(serverName)

    const novaSala = io.of(`/${serverName}`).on('connection', (socket) => {
        socket.emit('update_messages', messages[serverName])
        socket.on('new_message', (data) => {
            messages[serverName].push(data)
            novaSala.emit('update_messages', messages[serverName])
        })
    })
}

function createNewUser(serverName) {
    const newPerson = io.of(`/${serverName}`).on('connection', (socket) => {

        socket.on('userFind', (person) => {
            if (people.indexOf(person) > -1) {
                socket.emit('userFind', 'User already exists')
            } else {
                socket.emit('user_not_found', serverName)
                people.push(person)
            }
        })
    })

}








