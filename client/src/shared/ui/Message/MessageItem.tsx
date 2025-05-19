import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import cls from './Message.module.scss';
import { HStack, VStack } from '../Stack';
import { Text } from '../Text/Text.tsx';
import { Message } from 'shared/lib/hooks/useSignalR/types.ts';
import { convertTimeMsToString } from 'shared/lib/time/convertTimeMsToString.ts';

interface MessageProps {
    className?: string;
    message: Message;
}

export const MessageItem = memo((props: MessageProps) => {
    const { className, message } = props;

    return (
        <VStack className={classNames(cls.Message, {}, [className])}>
            <HStack max>
                <Text
                    text={message.message}
                    className={cls.message}
                />
            </HStack>
            <HStack
                max
                gap={'8'}
            >
                <Text
                    text={message.owner}
                    size={'sm'}
                    variant={'gray'}
                />
                <Text
                    text={convertTimeMsToString(message.date).split('г.')[1]}
                    size={'sm'}
                    variant={'gray'}
                />
            </HStack>
        </VStack>
    );
});
