// import type { Socket } from "socket.io";

const express = require('express');

const PORT = 9999;

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});

// чтобы в body приходил json
app.use(express.json());

const rooms = new Map();

app.get('/users', (req, res) => {
    console.log('APP');

    res.send('response');
});

app.get('/rooms', (req, res) => {
    res.json(rooms);
});

app.post('/rooms', (req, res) => {
    // console.log('~ req', req.body);
    const { roomId, userName } = req.body;

    if (!rooms.has(roomId)) {
        rooms.set(
            roomId,
            // @ts-ignore
            new Map([
                ['users', new Map()],
                ['messages', []],
            ]),
        );
    }

    if (roomId && userName) {
        res.json({
            result: true,
            rooms: [...rooms.keys()],
        });
    } else {
        res.json({
            result: false,
        });
    }
});

// настроили сокеты
io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({ roomId, userName }) => {
        console.log('connection -> roomId', roomId);
        // подключаемся к комнате
        socket.join(roomId);
        // сохраним в базу данных
        rooms.get(roomId).get('users').set(socket.id, userName);
        // данные пользователей в комнате
        const users = [...rooms.get(roomId).get('users').values()];
        // отсылаем данные всем кроме вошедшего
        socket.broadcast.to(roomId).emit('ROOM:JOINED', users);
    });
    // console.log('user connected', socket.id);
});

// слушаем сервер
server.listen(PORT, (err) => {
    if (err) {
        throw Error(err);
    }

    console.log(`listening on port ${PORT}`);
});
