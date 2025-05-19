import {
    ChangeEvent,
    InputHTMLAttributes,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { classNames } from '../../lib/classNames/classNames';
import cls from './Input.module.scss';
import { HStack, VStack } from '../Stack';
import { Text } from '../Text/Text.tsx';
import { ValidationError } from 'shared/lib/hooks/useValidation/useValidation.ts';
import EyeIcon from 'shared/assets/icons/eye.svg';
import EyeOffIcon from 'shared/assets/icons/eye-off.svg';
import { Button } from '../Button/Button.tsx';

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

interface InputProps extends HTMLInputProps {
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
    autofocus?: boolean;
    label?: string;
    error?: ValidationError;
    password?: boolean;
}

export const Input = memo((props: InputProps) => {
    const {
        className,
        value,
        onChange,
        autofocus,
        label,
        error = {},
        password = false,
        type,
        ...othersProps
    } = props;

    const ref = useRef<HTMLInputElement>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [view, setView] = useState<boolean>(false);

    useEffect(() => {
        if (autofocus) {
            ref.current?.focus();
        }
    }, [autofocus]);

    const onChangeHandler = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange?.(event.target.value);
        },
        [onChange],
    );

    const onBlurHandler = () => {
        setIsDirty(true);
    };

    return (
        <VStack
            max
            className={classNames(cls.container, {}, [className])}
            gap={'8'}
        >
            {label && (
                <HStack gap={'8'}>
                    <Text
                        text={label}
                        weight={'semibold'}
                        className={cls.label}
                        size={'lg'}
                    />
                    {isDirty &&
                        Object.values(error).map((err: string) => {
                            if (err) {
                                return (
                                    <Text
                                        text={err}
                                        variant={'error'}
                                        key={err}
                                    />
                                );
                            }
                        })}
                </HStack>
            )}
            <input
                ref={ref}
                className={cls.Input}
                value={value}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                type={password ? (view ? 'text' : 'password') : type}
                {...othersProps}
            />
            {password && (
                <>
                    {!view && (
                        <Button
                            variant={'clear'}
                            className={cls.eyeIcon}
                            onClick={() => setView(true)}
                        >
                            <EyeIcon />
                        </Button>
                    )}
                    {view && (
                        <Button
                            variant={'clear'}
                            className={cls.eyeOffIcon}
                            onClick={() => setView(false)}
                        >
                            <EyeOffIcon />
                        </Button>
                    )}
                </>
            )}
        </VStack>
    );
});
