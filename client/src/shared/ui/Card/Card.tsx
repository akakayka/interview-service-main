import { classNames } from 'shared/lib/classNames/classNames';
import { HTMLAttributes, memo, ReactNode } from 'react';
import cls from './Card.module.scss';
import { VStack } from '../Stack';
import { Text } from '../Text/Text';

export enum CardSize {
    M = 'size_m',
    L = 'size_l',
    XL = 'size_xl',
    AUTO = 'size_auto',
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: ReactNode;
    title?: string;
    size?: CardSize;
}

export const Card = memo((props: CardProps) => {
    const { className, children, title, size = CardSize.AUTO, ...otherProps } = props;

    return (
        <VStack
            role="div"
            className={classNames(cls.Card, {}, [className, cls[size]])}
            {...otherProps}
        >
            {title && (
                <div className={cls.titleWrapper}>
                    <Text
                        className={cls.title}
                        text={title}
                        weight={'semibold'}
                        size={'display_md'}
                    />
                </div>
            )}
            {children}
        </VStack>
    );
});
