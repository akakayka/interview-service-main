import { ButtonHTMLAttributes, memo } from 'react';
import cls from './Button.module.scss';
import { classNames } from '../../lib/classNames/classNames';

export type ButtonVariant = 'primary' | 'secondary' | 'green' | 'clear' | 'disabled' | 'white';
export type ButtonSize = 'small' | 'big';

interface ButtonProps extends ButtonHTMLAttributes<HTMLElement> {
    className?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    square?: boolean;
    disabled?: boolean;
    max?: boolean;
}

export const Button = memo((props: ButtonProps) => {
    const {
        className,
        variant = 'primary',
        size = 'big',
        square = false,
        disabled = false,
        max = false,
        children,
        ...otherProps
    } = props;

    const mods: Record<string, boolean> = {
        [cls.square]: square,
        [cls.disabled]: disabled,
        [cls.max]: max,
    };

    const additional: (string | undefined)[] = [className, cls[variant], cls[size]];

    return (
        <button
            type="button"
            className={classNames(cls.Button, mods, additional)}
            disabled={disabled}
            {...otherProps}
        >
            {children}
        </button>
    );
});
