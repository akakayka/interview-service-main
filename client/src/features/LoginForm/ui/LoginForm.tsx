import { classNames } from 'shared/lib/classNames/classNames.ts';
import { memo, useCallback, useEffect } from 'react';
import cls from './LoginForm.module.scss';
import { HStack, VStack } from 'shared/ui/Stack';
import { Input } from 'shared/ui/Input/Input.tsx';
import { Card, CardSize } from 'shared/ui/Card/Card.tsx';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import { useSelector } from 'react-redux';
import {
    getLoginFormEmail,
    getLoginFormError,
    getLoginFormIsLoading,
    getLoginFormPassword,
} from '../model/selectors/loginFormSelectors.ts';
import { loginFormActions, loginFormReducer } from '../model/slice/LoginFormSlice.ts';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { encryptString } from 'shared/lib/encryptString/encryptString.ts';
import { loginByEmail } from '../model/services/loginByEmail/loginByEmail.ts';
import { getUserRole } from 'entities/User';
import { RedirectToDefaultPage } from 'features/RedirectToDefaultPage';
import { useValidation } from 'shared/lib/hooks/useValidation/useValidation.ts';
import { useFormSubmitOnEnter } from 'shared/lib/hooks/useFormSubmitOnEnter/useFormSubmitOnEnter.ts';
import { toast } from 'react-toastify';

interface LoginFormProps {
    className?: string;
    invite?: string | null;
}

const reducers: ReducersList = {
    loginForm: loginFormReducer,
};

export const LoginForm = memo((props: LoginFormProps) => {
    const { className, invite } = props;
    const email = useSelector(getLoginFormEmail);
    const password = useSelector(getLoginFormPassword);
    const dispatch = useAppDispatch();
    const isLoading = useSelector(getLoginFormIsLoading);
    const error = useSelector(getLoginFormError);
    const role = useSelector(getUserRole);

    const { emailError, isEmptyError, inputValid } = useValidation(email, {
        isEmail: true,
        isEmpty: true,
    });

    const onChangeEmail = useCallback(
        (value: string) => {
            dispatch(loginFormActions.setEmail(value));
        },
        [dispatch],
    );

    const onChangePassword = useCallback(
        (value: string) => {
            dispatch(loginFormActions.setPassword(value));
        },
        [dispatch],
    );

    const onLogin = useCallback(async () => {
        const passwordHash = encryptString(password);
        dispatch(
            loginByEmail({
                email,
                passwordHash,
                invite: invite ?? undefined,
            }),
        );
    }, [dispatch, email, invite, password]);

    useFormSubmitOnEnter({
        inputsValid: inputValid && !isLoading,
        callback: onLogin,
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    if (role) {
        return <RedirectToDefaultPage />;
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Card
                size={CardSize.M}
                className={classNames(cls.CandidateLoginPage, {}, [className])}
            >
                <VStack
                    max
                    gap={'32'}
                    className={classNames(cls.LoginForm, {}, [className])}
                >
                    <Input
                        label={'Почта'}
                        value={email}
                        onChange={onChangeEmail}
                        error={{
                            isEmail: emailError ? 'Некорректный адрес эл. почты' : undefined,
                            isEmpty: isEmptyError ? 'Поле не должно быть пустым' : undefined,
                        }}
                        placeholder={'Введите почту...'}
                    />
                    <Input
                        label={'Пароль'}
                        value={password}
                        type={'password'}
                        onChange={onChangePassword}
                        placeholder={'Введите пароль...'}
                        password
                    />
                    <HStack
                        justify={'center'}
                        max
                    >
                        <Button
                            onClick={onLogin}
                            disabled={!inputValid || isLoading}
                        >
                            <Text
                                variant={'white'}
                                text={'Войти в систему'}
                                weight={'medium'}
                            />
                        </Button>
                    </HStack>
                </VStack>
            </Card>
        </DynamicModuleLoader>
    );
});
