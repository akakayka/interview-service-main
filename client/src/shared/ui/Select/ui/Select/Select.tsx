import { classNames } from 'shared/lib/classNames/classNames';
import { memo, MouseEventHandler, useCallback, useRef, useState } from 'react';
import cls from './Select.module.scss';
import { SelectOption } from '../SelectOption/SelectOption.tsx';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import ArrowDownIcon from 'shared/assets/icons/arrow-down.svg';
import { Text } from '../../../Text/Text.tsx';

interface SelectProps {
    className?: string;
    selected: SelectOption | null;
    options: SelectOption[];
    placeholder?: string;
    onChange?: (selected: SelectOption) => void;
    onClose?: () => void;
}

export const Select = memo((props: SelectProps) => {
    const { className, onClose, options, selected, onChange, placeholder } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useInitialEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const { target } = event;
            if (target instanceof Node && !rootRef.current?.contains(target)) {
                isOpen && onClose?.();
                setIsOpen(false);
            }
        };

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    });

    const handleOptionClick = useCallback(
        (value: SelectOption) => {
            setIsOpen(false);
            onChange?.(value);
        },
        [onChange],
    );

    const handlePlaceHolderClick: MouseEventHandler<HTMLDivElement> = useCallback(() => {
        setIsOpen((prev) => !prev);
        setIsDirty(true);
    }, []);

    return (
        <div
            className={classNames(cls.Select, { [cls.error]: isDirty && !selected }, [className])}
            ref={rootRef}
            data-is-active={isOpen}
        >
            <div
                className={cls.placeholder}
                data-selected={!!selected?.value}
                onClick={handlePlaceHolderClick}
            >
                <div className={cls.arrow}>
                    <ArrowDownIcon />
                </div>
                <Text text={selected?.title || placeholder} />
            </div>
            {isOpen && (
                <ul className={cls.select}>
                    {options.map((option) => (
                        <SelectOption
                            key={option.title}
                            option={option}
                            onClick={handleOptionClick}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
});
