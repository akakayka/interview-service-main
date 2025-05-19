import { classNames } from 'shared/lib/classNames/classNames';
import { ChangeEvent, memo, useCallback, useState } from 'react';
import cls from './Checkbox.module.scss';

export interface CheckboxValue {
    value: boolean;
    data: string;
}

interface CheckboxProps {
    className?: string;
    onChange: (value: CheckboxValue) => void;
    data: string;
}

export const Checkbox = memo((props: CheckboxProps) => {
    const { className, onChange, data } = props;
    const [value, setValue] = useState(false);

    const onChangeHandler = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setValue(event.target.checked);
            onChange({
                value: event.target.checked,
                data: data,
            });
        },
        [data, onChange],
    );

    return (
        <input
            className={classNames(cls.Checkbox, {}, [className])}
            type="checkbox"
            checked={value}
            onChange={onChangeHandler}
        />
    );
});
