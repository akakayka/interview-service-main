import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getRegisterFormEmail = (state: StateSchema) => state.registerForm?.data.email || '';
export const getRegisterFormPassword = (state: StateSchema) =>
    state.registerForm?.data.password || '';
export const getRegisterFormConfirmPassword = (state: StateSchema) =>
    state.registerForm?.data.confirmPassword || '';
export const getRegisterFormFirstName = (state: StateSchema) =>
    state.registerForm?.data.firstName || '';
export const getRegisterFormSurname = (state: StateSchema) =>
    state.registerForm?.data.surname || '';
export const getRegisterFormPhoneNumber = (state: StateSchema) =>
    state.registerForm?.data.phoneNumber || '';
export const getRegisterFormIsLoading = (state: StateSchema) => state.registerForm?.isLoading;
export const getRegisterFormError = (state: StateSchema) => state.registerForm?.error || '';
