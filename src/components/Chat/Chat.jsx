import { Divider, Input, Button } from 'antd';
import { useEffect, useRef } from 'react';
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { socket } from '../../utils/socket';
import styles from './Chat.module.css';

const { TextArea } = Input;

export const Chat = ({ state, onAddMessage }) => {
    const { roomId, users, messages, userName } = state;
    const messageRef = useRef(null);

    console.log('~ messages', messages);

    const [textarea, setTextarea] = useState('');

    const onChange = (evt) => setTextarea(evt.target.value);

    const onSendMessage = useCallback(() => {
        console.log('onSendMessage:', textarea);
        socket.emit('ROOM:NEW_MESSAGE', {
            roomId,
            userName,
            text: textarea,
        });

        onAddMessage({ userName, text: textarea });

        setTextarea('');
    }, [onAddMessage, roomId, textarea, userName]);

    useEffect(() => {
        messageRef?.current?.scrollTo(0, 999999999);
    }, [messages]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.users}>
                <h2>Онлайн ({users.length}):</h2>
                {users.map((name, i) => (
                    <div className={styles.user} key={uuidv4()}>
                        {name}
                    </div>
                ))}
            </div>
            <div className={styles.leftPlace}>
                <h2>Сообщения:</h2>
                <div className={styles.messages} ref={messageRef}>
                    {messages.map(({ userName: messageUserName, text: messageText }) => {
                        return (
                            <div className={styles.message} key={uuidv4()}>
                                <div className={styles.userMessage}>{messageUserName}</div>
                                {messageText}
                            </div>
                        );
                    })}
                </div>

                <div className={styles.sendMessage}>
                    <Divider />
                    <TextArea
                        placeholder="Текст сообщения:"
                        showCount
                        maxLength={500}
                        style={{ height: 80, resize: 'none' }}
                        onChange={onChange}
                        value={textarea}
                    />
                    <Button
                        type="primary"
                        onClick={onSendMessage}
                        style={{ width: '100%', borderRadius: '4px' }}
                    >
                        Отправить
                    </Button>
                </div>
            </div>
        </div>
    );
};

Chat.displayName = 'Chat';
