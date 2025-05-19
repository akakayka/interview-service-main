import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegisterFormSchema } from '../types/registerForm.ts';
import { registerByEmail } from '../services/registerByEmail/registerByEmail.ts';

const initialState: RegisterFormSchema = {
    isLoading: false,
    error: undefined,
    data: {
        email: '',
        password: '',
        phoneNumber: '',
        surname: '',
        firstName: '',
        confirmPassword: '',
    },
};

export const registerFormSlice = createSlice({
    name: 'registerForm',
    initialState,
    reducers: {
        setEmail: (state, action: PayloadAction<string>) => {
            state.data.email = action.payload;
        },
        setFirstName: (state, action: PayloadAction<string>) => {
            state.data.firstName = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.data.password = action.payload;
        },
        setConfirmPassword: (state, action: PayloadAction<string>) => {
            state.data.confirmPassword = action.payload;
        },
        setPhoneNumber: (state, action: PayloadAction<string>) => {
            state.data.phoneNumber = action.payload;
        },
        setSurname: (state, action: PayloadAction<string>) => {
            state.data.surname = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerByEmail.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(registerByEmail.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(registerByEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: registerFormActions } = registerFormSlice;
export const { reducer: registerFormReducer } = registerFormSlice;
