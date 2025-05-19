import { memo, useCallback } from 'react';
import cls from './EmailCard.module.scss';
import { classNames } from 'shared/lib/classNames/classNames.ts';
import { Text } from '../Text/Text.tsx';
import EmailIcon from 'shared/assets/icons/email.svg';
import { HStack } from '../Stack';
import { toast } from 'react-toastify';
import { Button } from '../Button/Button.tsx';

interface EmailCardProps {
    className?: string;
    email?: string;
}

export const EmailCard = memo((props: EmailCardProps) => {
    const { className, email } = props;

    const onClickHandler = useCallback(() => {
        if (email) {
            navigator.clipboard.writeText(email);
            toast.success('Email скопирован!');
        }
    }, [email]);

    if (!email) return null;

    return (
        <Button
            variant={'clear'}
            onClick={onClickHandler}
        >
            <HStack
                gap={'8'}
                className={classNames(cls.EmailCard, {}, [className])}
            >
                <EmailIcon />
                <Text
                    weight={'regular'}
                    size={'md'}
                    text={email}
                />
            </HStack>
        </Button>
    );
});
