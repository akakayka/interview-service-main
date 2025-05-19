import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import cls from './Text.module.scss';

export type TextVariant =
    | 'primary'
    | 'secondary'
    | 'gray'
    | 'error'
    | 'white'
    | 'accent'
    | 'green'
    | 'dark_red';
export type TextAlign = 'right' | 'left' | 'center';
export type TextSize =
    | 'display_2xl'
    | 'display_xl'
    | 'display_lg'
    | 'display_md'
    | 'display_sm'
    | 'display_xs'
    | 'xl'
    | 'lg'
    | 'md'
    | 'sm'
    | 'xs';
export type TextWeight = 'regular' | 'medium' | 'bold' | 'semibold';
export type TextFontFamily = 'inter' | 'raleway' | 'montserrat';

interface TextProps {
    className?: string;
    text?: string;
    variant?: TextVariant;
    align?: TextAlign;
    size?: TextSize;
    weight?: TextWeight;
    family?: TextFontFamily;
}

export const Text = memo((props: TextProps) => {
    const {
        className,
        text,
        variant = 'primary',
        align = 'left',
        size = 'md',
        weight = 'regular',
        family = 'inter',
    } = props;

    const additional: Array<string | undefined> = [
        className,
        cls[variant],
        cls[align],
        cls[size],
        cls[weight],
        cls[family],
    ];

    return (
        <div className={classNames(cls.Text, {}, additional)}>
            {text && <p className={cls.text}>{text}</p>}
        </div>
    );
});
