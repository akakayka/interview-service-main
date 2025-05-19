import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginFormSchema } from '../types/loginForm.ts';
import { loginByEmail } from '../services/loginByEmail/loginByEmail.ts';

const initialState: LoginFormSchema = {
    isLoading: false,
    error: undefined,
    data: {
        email: '',
        password: '',
    },
};

export const loginFormSlice = createSlice({
    name: 'loginForm',
    initialState,
    reducers: {
        setEmail: (state, action: PayloadAction<string>) => {
            state.data.email = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.data.password = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginByEmail.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(loginByEmail.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(loginByEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: loginFormActions } = loginFormSlice;
export const { reducer: loginFormReducer } = loginFormSlice;
