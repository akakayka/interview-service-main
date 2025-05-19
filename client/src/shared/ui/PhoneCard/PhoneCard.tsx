import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback } from 'react';
import cls from './PhoneCard.module.scss';
import { Text } from '../Text/Text.tsx';
import PhoneIcon from 'shared/assets/icons/call.svg';
import { HStack } from '../Stack';
import { toast } from 'react-toastify';
import { Button } from '../Button/Button.tsx';

interface PhoneCardProps {
    className?: string;
    phone?: string;
}

export const PhoneCard = memo((props: PhoneCardProps) => {
    const { className, phone } = props;

    const onClickHandler = useCallback(() => {
        if (phone) {
            navigator.clipboard.writeText(phone);
            toast('Номер телефона скопирован!', { type: 'success' });
        }
    }, [phone]);

    if (!phone) return null;

    return (
        <Button
            variant={'clear'}
            onClick={onClickHandler}
        >
            <HStack
                gap={'8'}
                className={classNames(cls.PhoneCard, {}, [className])}
            >
                <PhoneIcon />
                <Text
                    size={'md'}
                    weight={'regular'}
                    text={phone}
                />
            </HStack>
        </Button>
    );
});
