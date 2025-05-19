import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getLoginFormEmail = (state: StateSchema) => state.loginForm?.data.email || '';
export const getLoginFormPassword = (state: StateSchema) => state.loginForm?.data.password || '';
export const getLoginFormError = (state: StateSchema) => state.loginForm?.error || '';
export const getLoginFormIsLoading = (state: StateSchema) => state.loginForm?.isLoading;
