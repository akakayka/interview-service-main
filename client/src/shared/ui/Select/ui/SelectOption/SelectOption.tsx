import { memo, useCallback } from 'react';
import cls from './SelectOption.module.scss';
import { Text } from '../../../Text/Text.tsx';

export interface SelectOption {
    title: string;
    value: string | number;
}

interface SelectOptionProps {
    option: SelectOption;
    onClick: (value: SelectOption) => void;
}

export const SelectOption = memo((props: SelectOptionProps) => {
    const { onClick, option } = props;

    const handleClick = useCallback(() => {
        onClick(option);
    }, [onClick, option]);

    return (
        <li
            className={cls.SelectOption}
            onClick={handleClick}
            tabIndex={0}
        >
            <Text text={option.title} />
        </li>
    );
});
