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

app.get('/rooms/:id', (req, res) => {
    const { id: roomId } = req.params;
    console.log('req', req.params);
    const obj = rooms.has(roomId)
        ? {
              users: [...rooms.get(roomId).get('users').values()],
              messages: [...rooms.get(roomId).get('messages').values()],
          }
        : { users: [], messages: [] };

    res.json(obj);
});

app.post('/rooms', (req, res) => {
    // console.log('~ req', req.body);
    const { roomId, userName } = req.body;

    if (!rooms.has(roomId)) {
        rooms.set(
            roomId,
            new Map([
                ['users', new Map()],
                ['messages', []],
            ]),
        );
    }

    if (roomId && userName) {
        res.send({
            result: true,
            rooms: [...rooms.keys()],
        });
    } else {
        res.send({
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
        setTimeout(() => socket.to(roomId).emit('ROOM:SET_USERS', users), 100);
        // socket.to(roomId).emit('ROOM:SET_USERS', users);
    });
    // console.log('user connected', socket.id);

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            // console.log('room', room);

            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()];
                socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users);
            }
        });
    });
});

// слушаем сервер
server.listen(PORT, (err) => {
    if (err) {
        throw Error(err);
    }

    console.log(`listening on port ${PORT}`);
});
