import { useCallback, useEffect, useReducer } from 'react';
import { Auth } from './components/Auth';
import { Chat } from './components/Chat/Chat';
import { reducer } from './reducer';
import { socket } from './utils/socket';

import styles from './App.module.css';
import axios from 'axios';

function App() {
    const [state, dispatch] = useReducer(reducer, {
        joined: false,
        roomId: null,
        userName: null,
        users: [],
        messages: [],
    });

    const setUsers = useCallback(
        (users) =>
            dispatch({
                type: 'SET_USERS',
                payload: users,
            }),
        [],
    );

    const onLogin = async (objLogin) => {
        console.log('🚀 ~ file: App.jsx ~ line 29 ~ onLogin ~ objLogin', objLogin);
        dispatch({
            type: 'JOINED',
            payload: objLogin,
        });

        socket.emit('ROOM:JOIN', objLogin);
        // запрос на сервер для актуальных данных
        const { data } = await axios.get(`/rooms/${objLogin.roomId}`);
        console.log(' ~ data', data);

        setUsers(data.users);
    };

    useEffect(() => {
        // socket.on('ROOM:JOINED', (users) => {
        //     console.log('ROOM:JOINED', users);
        //     setUsers(users);
        // });

        socket.on('ROOM:SET_USERS', setUsers);
    }, [setUsers]);

    return (
        <div className={styles.app}>
            {!state.joined && <Auth onLogin={onLogin} />}
            {state.joined && <Chat state={state} />}
        </div>
    );
}

window.socket = socket;

export default App;
