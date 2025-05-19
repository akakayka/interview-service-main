import { useEffect, useState } from 'react';

export interface Validation {
    minLength?: number;
    maxLength?: number;
    isEmpty?: boolean;
    isEmail?: boolean;
    isPassword?: boolean;
    isPhone?: boolean;
    isName?: boolean;
}

export type ValidationError = OptionalRecord<keyof Validation, string>;

export const useValidation = (value: string, validations: Validation) => {
    const {
        isEmpty,
        isEmail,
        isPassword,
        maxLength = 10000,
        minLength = -1,
        isPhone,
        isName,
    } = validations;

    const [isEmptyError, setIsEmptyError] = useState(true);
    const [emailError, setEmailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [maxLengthError, setMaxLengthError] = useState(false);
    const [minLengthError, setMinLengthError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [inputValid, setInputValid] = useState(false);

    useEffect(() => {
        if (validations) {
            Object.entries(validations).forEach(([key, _]) => {
                switch (key) {
                    case 'minLength':
                        if (!minLength) break;
                        value.length < minLength
                            ? setMinLengthError(true)
                            : setMinLengthError(false);
                        break;
                    case 'maxLength':
                        if (!maxLength) break;
                        value.length > maxLength
                            ? setMaxLengthError(true)
                            : setMaxLengthError(false);
                        break;
                    case 'isEmpty':
                        if (!isEmpty) break;
                        value.trim() ? setIsEmptyError(false) : setIsEmptyError(true);
                        break;
                    case 'isEmail':
                        if (!isEmail) break;
                        // eslint-disable-next-line no-case-declarations
                        const regexp = new RegExp(
                            // eslint-disable-next-line no-useless-escape
                            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
                        );
                        regexp.test(String(value).toLowerCase())
                            ? setEmailError(false)
                            : setEmailError(true);
                        break;
                    case 'isPassword':
                        if (!isPassword) break;
                        value.length < 3 || value.length > 20
                            ? setPasswordError(true)
                            : setPasswordError(false);
                        break;
                    case 'isPhone':
                        if (!isPhone) break;
                        // eslint-disable-next-line no-case-declarations
                        const reg = new RegExp(/^89\d{9}$/);
                        reg.test(String(value).toLowerCase())
                            ? setPhoneError(false)
                            : setPhoneError(true);
                        break;
                    case 'isName':
                        if (!isName) break;
                        // eslint-disable-next-line no-case-declarations
                        const exp =
                            // eslint-disable-next-line no-useless-escape
                            new RegExp(/^[a-zA-Zа-яА-ЯёЁ\-]+$/);
                        exp.test(String(value).toLowerCase())
                            ? setNameError(false)
                            : setNameError(true);
                        break;
                }
            });
        }
    }, [isEmail, isEmpty, isName, isPassword, isPhone, maxLength, minLength, validations, value]);

    useEffect(() => {
        if (
            isEmptyError ||
            emailError ||
            passwordError ||
            minLengthError ||
            maxLengthError ||
            phoneError ||
            nameError
        ) {
            setInputValid(false);
        } else {
            setInputValid(true);
        }
    }, [
        emailError,
        isEmptyError,
        maxLengthError,
        minLengthError,
        nameError,
        passwordError,
        phoneError,
    ]);

    return {
        inputValid,
        isEmptyError,
        emailError,
        passwordError,
        minLengthError,
        maxLengthError,
        phoneError,
        nameError,
    };
};
