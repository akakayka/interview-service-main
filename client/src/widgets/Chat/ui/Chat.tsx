import { classNames, Mods } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import cls from './Chat.module.scss';
import { Message } from 'shared/lib/hooks/useSignalR/types.ts';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { chatActions } from '../model/slice/chatSlice.ts';
import { useSelector } from 'react-redux';
import { getChatError, getChatMessage } from '../model/selectors/chatSelectors.ts';
import { useValidation } from 'shared/lib/hooks/useValidation/useValidation.ts';
import MessageIcon from 'shared/assets/icons/message.svg';
import ArrowIcon from 'shared/assets/icons/arrowR.svg';
import { Button } from 'shared/ui/Button/Button.tsx';
import { HStack, VStack } from 'shared/ui/Stack';
import { Input } from 'shared/ui/Input/Input.tsx';
import { MessageItem } from 'shared/ui/Message/MessageItem.tsx';
import { useFormSubmitOnEnter } from 'shared/lib/hooks/useFormSubmitOnEnter/useFormSubmitOnEnter.ts';
import { toast } from 'react-toastify';

interface ChatProps {
    className?: string;
    messages?: Message[];
    sendMessage?: (message?: string) => void;
}

export const Chat = memo((props: ChatProps) => {
    const { className, sendMessage, messages } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const wrapper = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();
    const message = useSelector(getChatMessage);
    const error = useSelector(getChatError);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const { inputValid } = useValidation(message ?? '', { isEmpty: true });

    const onChangeMessage = useCallback(
        (mess: string) => {
            dispatch(chatActions.setMessage(mess));
        },
        [dispatch],
    );

    function lastMessageScroll() {
        const e = wrapper.current;
        if (!e) return;

        e.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        });
    }

    const onSendMessage = useCallback(async () => {
        await sendMessage?.(message);
        dispatch(chatActions.setMessage(''));
        lastMessageScroll();
    }, [dispatch, message, sendMessage]);

    useFormSubmitOnEnter({ inputsValid: inputValid, callback: onSendMessage });

    const mods: Mods = {
        [cls.collapsed]: !isOpen,
    };

    if (!isOpen)
        return (
            <div className={classNames(cls.Chat, mods, [className])}>
                <Button
                    variant={'primary'}
                    square
                    onClick={() => setIsOpen(true)}
                >
                    <MessageIcon />
                </Button>
            </div>
        );

    return (
        <VStack
            justify={'between'}
            gap={'16'}
            className={classNames(cls.Chat, mods, [className])}
        >
            <Button
                square
                onClick={() => setIsOpen(false)}
                className={cls.collapseButton}
            >
                <MessageIcon />
            </Button>
            <VStack
                max
                gap={'8'}
                className={cls.messagesList}
            >
                {messages?.map((mess) => (
                    <MessageItem
                        message={mess}
                        key={mess.id}
                    />
                ))}
                <div ref={wrapper}></div>
            </VStack>
            <HStack
                gap={'8'}
                max
            >
                <Input
                    value={message}
                    onChange={onChangeMessage}
                    placeholder={'Сообщение'}
                    autofocus
                />
                <Button
                    square
                    onClick={onSendMessage}
                    disabled={!inputValid}
                >
                    <ArrowIcon />
                </Button>
            </HStack>
        </VStack>
    );
});
