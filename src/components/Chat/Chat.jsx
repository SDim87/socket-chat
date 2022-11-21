import { Divider, Input, Button } from 'antd';
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './Chat.module.css';

const { TextArea } = Input;

export const Chat = ({ state }) => {
    const { users, messages } = state;

    console.log('~ Chat ~ users', users)

    const [textarea, setTextarea] = useState('');

    const onChange = (evt) => {
        setTextarea(evt.target.value);
    };

    const onSendMessage = useCallback(() => {
        console.log('onSendMessage:', textarea);
    }, [textarea]);

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
                <div className={styles.messages}>
                    {messages.map((text, i) => (
                        <div className={styles.message} key={uuidv4()}>
                            <div className={styles.userMessage}>Test User</div>
                            {text}
                        </div>
                    ))}
                </div>

                <div className={styles.sendMessage}>
                    <Divider />
                    <TextArea
                        placeholder="Текст сообщения:"
                        showCount
                        maxLength={500}
                        style={{ height: 80, resize: 'none' }}
                        onChange={onChange}
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
