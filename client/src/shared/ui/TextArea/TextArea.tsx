import { classNames } from 'shared/lib/classNames/classNames';
import { ChangeEvent, HTMLProps, memo, useCallback } from 'react';
import cls from './TextArea.module.scss';

interface TextAreaProps extends Omit<HTMLProps<HTMLTextAreaElement>, 'onChange'> {
    className?: string;
    value: string;
    onChange?: (value: string) => void;
}

export const TextArea = memo((props: TextAreaProps) => {
    const { className, value, onChange, ...otherProps } = props;

    const onChangeHandler = useCallback(
        (e: ChangeEvent<HTMLTextAreaElement>) => {
            onChange?.(e.target.value || '');
        },
        [onChange],
    );

    return (
        <textarea
            value={value}
            onChange={onChangeHandler}
            className={classNames(cls.TextArea, {}, [className])}
            {...otherProps}
        />
    );
});
