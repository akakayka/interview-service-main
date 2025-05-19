import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useEffect, useMemo } from 'react';
import cls from './RegisterForm.module.scss';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { registerFormActions, registerFormReducer } from '../model/slice/registerFormSlice.ts';
import { HStack, VStack } from 'shared/ui/Stack';
import { Input } from 'shared/ui/Input/Input.tsx';
import { useSelector } from 'react-redux';
import {
    getRegisterFormConfirmPassword,
    getRegisterFormEmail,
    getRegisterFormError,
    getRegisterFormFirstName,
    getRegisterFormIsLoading,
    getRegisterFormPassword,
    getRegisterFormPhoneNumber,
    getRegisterFormSurname,
} from '../model/selectors/registerFormSelectors.ts';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import {
    registerByEmail,
    RegisterByEmailProps,
} from '../model/services/registerByEmail/registerByEmail.ts';
import { encryptString } from 'shared/lib/encryptString/encryptString.ts';
import { useValidation } from 'shared/lib/hooks/useValidation/useValidation.ts';
import { useFormSubmitOnEnter } from 'shared/lib/hooks/useFormSubmitOnEnter/useFormSubmitOnEnter.ts';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';
import { toast } from 'react-toastify';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { getUserRole } from 'entities/User';
import { createSolution } from '../model/services/createSolution/createSolution.ts';

interface RegisterFormProps {
    className?: string;
    invite?: string;
}

const reducers: ReducersList = {
    registerForm: registerFormReducer,
};

export const RegisterForm = memo((props: RegisterFormProps) => {
    const { className, invite } = props;

    useInitialEffect(() => {
        console.log('register form');
    });

    const email = useSelector(getRegisterFormEmail);
    const password = useSelector(getRegisterFormPassword);
    const confirmPassword = useSelector(getRegisterFormConfirmPassword);
    const phoneNumber = useSelector(getRegisterFormPhoneNumber);
    const firstName = useSelector(getRegisterFormFirstName);
    const surname = useSelector(getRegisterFormSurname);
    const navigate = useNavigate();

    const error = useSelector(getRegisterFormError);
    const isLoading = useSelector(getRegisterFormIsLoading);

    const passwordsIsOk = useMemo(() => password === confirmPassword, [confirmPassword, password]);

    const {
        emailError,
        isEmptyError: isEmptyEmailError,
        inputValid: emailValid,
    } = useValidation(email, { isEmail: true, isEmpty: true });
    const {
        passwordError,
        isEmptyError: isEmptyPasswordError,
        inputValid: passwordValid,
    } = useValidation(password, { isPassword: true, isEmpty: true });
    const { isEmptyError: isEmptyConfirmPasswordError, inputValid: confirmPasswordValid } =
        useValidation(confirmPassword, { isEmpty: true });
    const {
        phoneError,
        isEmptyError: isEmptyPhoneError,
        inputValid: phoneValid,
    } = useValidation(phoneNumber, { isPhone: true, isEmpty: true });
    const {
        isEmptyError: isEmptyFirstNameError,
        inputValid: firstNameValid,
        nameError: firstNameError,
    } = useValidation(firstName, { isEmpty: true, isName: true });
    const {
        isEmptyError: isEmptySurnameError,
        inputValid: surnameValid,
        nameError: surnameError,
    } = useValidation(surname, { isEmpty: true, isName: true });

    const isInputsValid = useMemo(
        () =>
            emailValid &&
            passwordValid &&
            phoneValid &&
            firstNameValid &&
            surnameValid &&
            confirmPasswordValid &&
            passwordsIsOk,
        [
            confirmPasswordValid,
            emailValid,
            firstNameValid,
            passwordValid,
            passwordsIsOk,
            phoneValid,
            surnameValid,
        ],
    );

    const role = useSelector(getUserRole);
    const dispatch = useAppDispatch();

    const onChangeEmail = useCallback(
        (value: string) => {
            dispatch(registerFormActions.setEmail(value));
        },
        [dispatch],
    );

    const onChangePassword = useCallback(
        (value: string) => {
            dispatch(registerFormActions.setPassword(value));
        },
        [dispatch],
    );

    const onChangePhoneNumber = useCallback(
        (value: string) => {
            dispatch(registerFormActions.setPhoneNumber(value));
        },
        [dispatch],
    );

    const onChangeFirstName = useCallback(
        (value: string) => {
            dispatch(registerFormActions.setFirstName(value));
        },
        [dispatch],
    );

    const onChangeSurname = useCallback(
        (value: string) => {
            dispatch(registerFormActions.setSurname(value));
        },
        [dispatch],
    );

    const onChangeConfirmPassword = useCallback(
        (value: string) => {
            dispatch(registerFormActions.setConfirmPassword(value));
        },
        [dispatch],
    );

    const onRegister = useCallback(() => {
        const registerData: RegisterByEmailProps = {
            email,
            passwordHash: encryptString(password),
            phone: phoneNumber,
            firstName,
            surname,
            invite: invite || '',
        };
        dispatch(registerByEmail(registerData));
    }, [dispatch, email, firstName, invite, password, phoneNumber, surname]);

    const navigateToLogin = useCallback(() => {
        if (invite) {
            navigate(RoutePath.login + `?invite=${invite}`);
        }
    }, [invite, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useFormSubmitOnEnter({
        inputsValid: isInputsValid && !isLoading,
        callback: onRegister,
    });

    const onCreateSolution = useCallback(() => {
        return toast.promise(dispatch(createSolution(invite)), {
            success: 'Можете приступать к выполнению',
            error: 'Произошла ошибка',
            pending: 'Создается интервью',
        });
    }, [dispatch, invite]);

    useEffect(() => {
        if (role) {
            onCreateSolution().then(() => {
                navigate('/start');
            });
        }
    }, [navigate, onCreateSolution, role]);

    if (!invite) {
        return null;
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={classNames(cls.RegisterForm, {}, [className])}>
                <VStack
                    max
                    gap={'32'}
                    className={classNames('', {}, [className])}
                >
                    <Input
                        label={'Имя'}
                        value={firstName}
                        onChange={onChangeFirstName}
                        placeholder={'Введите имя...'}
                        error={{
                            isEmpty: isEmptyFirstNameError
                                ? 'Поле не должно быть пустым'
                                : undefined,
                            isName: firstNameError ? 'Не должно быть пробелов и цифр' : undefined,
                        }}
                    />
                    <Input
                        label={'Фамилия'}
                        value={surname}
                        onChange={onChangeSurname}
                        placeholder={'Введите фамилию...'}
                        error={{
                            isEmpty: isEmptySurnameError ? 'Не должно быть пустым' : undefined,
                            isName: surnameError ? 'Не должно быть пробелов и цифр' : undefined,
                        }}
                    />
                    <Input
                        label={'Телефон'}
                        value={phoneNumber}
                        onChange={onChangePhoneNumber}
                        placeholder={'Введите телефон...'}
                        error={{
                            isEmpty: isEmptyPhoneError ? 'Не должно быть пустым' : undefined,
                            isPhone: phoneError ? 'Формат: 89123456789' : undefined,
                        }}
                    />
                    <Input
                        label={'Почта'}
                        value={email}
                        onChange={onChangeEmail}
                        placeholder={'Введите почту...'}
                        error={{
                            isEmpty: isEmptyEmailError ? 'Поле не должно быть пустым' : undefined,
                            isEmail: emailError ? 'Некорректный адрес эл. почты' : undefined,
                        }}
                    />
                    <Input
                        label={'Придумайте пароль'}
                        value={password}
                        onChange={onChangePassword}
                        placeholder={'Придумайте пароль...'}
                        password
                        error={{
                            isEmpty: isEmptyPasswordError
                                ? 'Поле не должно быть пустым'
                                : undefined,
                            isPassword: passwordError
                                ? 'Длина пароля от 3 до 20 символов'
                                : undefined,
                        }}
                    />
                    <Input
                        label={'Повторите пароль'}
                        value={confirmPassword}
                        onChange={onChangeConfirmPassword}
                        placeholder={'Повторите пароль...'}
                        password
                        error={{
                            isEmpty: isEmptyConfirmPasswordError
                                ? 'Поле не должно быть пустым'
                                : undefined,
                        }}
                    />
                    <HStack
                        max
                        justify={'between'}
                    >
                        <Text text={'Уже есть аккаунт?'} />
                        <Button
                            variant={'clear'}
                            onClick={navigateToLogin}
                        >
                            <Text
                                variant={'accent'}
                                text={'Войти'}
                            />
                        </Button>
                    </HStack>
                    <HStack
                        max
                        justify={'center'}
                        align={'center'}
                    >
                        <Button
                            onClick={onRegister}
                            disabled={!isInputsValid || isLoading}
                        >
                            <Text
                                text={'Сохранить данные'}
                                variant={'white'}
                                weight={'medium'}
                            />
                        </Button>
                    </HStack>
                </VStack>
            </div>
        </DynamicModuleLoader>
    );
});
