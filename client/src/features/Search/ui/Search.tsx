import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import cls from './Search.module.scss';
import { HStack } from 'shared/ui/Stack';
import { Input } from 'shared/ui/Input/Input.tsx';

interface SearchProps {
    className?: string;
    placeholder?: string;
    query?: string;
    onChangeQuery?: (value: string) => void;
}

export const Search = memo((props: SearchProps) => {
    const { className, query, onChangeQuery, placeholder = 'Поиск...' } = props;

    return (
        <HStack
            max
            gap={'16'}
            className={classNames(cls.Search, {}, [className])}
        >
            <Input
                placeholder={placeholder}
                value={query}
                onChange={onChangeQuery}
            />
        </HStack>
    );
});
