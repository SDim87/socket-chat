import axios from 'axios';
import { useCallback, useState } from 'react';
// import { socket } from '../../utils/socket';
import { Button, InputNumber, Input } from 'antd';
import styles from './Auth.module.css';

export const Auth = ({ onLogin }) => {
    // const addSocket = useCallback(() => socket, [socket]);

    const [roomId, setRoomId] = useState();
    const [userName, setNameUser] = useState();

    const onChangeRoomId = useCallback((value) => setRoomId(value), []);
    const onChangeName = useCallback((evt) => setNameUser(evt.target.value), []);

    const onSubmit = useCallback(() => {
        if (roomId && userName) {
            const objLogin = { roomId, userName };

            axios.post('/rooms', { ...objLogin }).then((res) => {
                if (res?.data?.result) {
                    console.log(res);
                    onLogin(objLogin);
                } else {
                    alert('Ошибка в данных');
                }
            });
        } else {
            alert('Заполните поля');
        }
    }, [roomId, userName, onLogin]);

    return (
        <div className={styles.wrapper}>
            <InputNumber
                onChange={onChangeRoomId}
                placeholder="Номер комнаты"
                controls={false}
                type="number"
                style={{ width: '100%', marginBottom: '8px' }}
                value={roomId}
            />
            <Input value={userName} onChange={onChangeName} placeholder="Ваше Имя" style={{ marginBottom: '16px' }} />
            <Button type="primary" onClick={onSubmit} style={{ width: '100%' }}>
                Войти
            </Button>
        </div>
    );
};

Auth.displayName = 'Auth';
