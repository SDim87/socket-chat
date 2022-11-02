import { useCallback, useEffect, useReducer } from 'react';
import { Auth } from './components/Auth';
import { Chat } from './components/Chat/Chat';
import { reducer } from './reducer';
import { socket } from './utils/socket';

import styles from './App.module.css';

function App() {
    const [state, dispatch] = useReducer(reducer, {
        joined: false,
        roomId: null,
        userName: null,
    });
    const onLogin = useCallback((objLogin) => {
        dispatch({
            type: 'JOINED',
            payload: objLogin,
        });

        socket.emit('ROOM:JOIN', objLogin);
    }, []);

    useEffect(() => {
        socket.on('ROOM:JOINED', (users) => {
            console.log('новый пользователь', users);
        });
    }, []);

    return (
        <div className={styles.app}>
            {!state.joined && <Auth onLogin={onLogin} />}
            {!state.joined && <Chat />}
        </div>
    );
}

window.socket = socket;

export default App;
