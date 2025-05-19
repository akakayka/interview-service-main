import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserSchema } from '../types/user.ts';
import { AUTH_LOCALSTORAGE_KEY, NAME_LOCALSTORAGE_KEY } from 'shared/consts/localstorage.ts';
import { validateSessionToken } from '../services/validateSessionToken/validateSessionToken.ts';
import { UserSession } from '../types/userSession.ts';
import { JWTSession } from '../types/JWTSession.ts';
import { parseJwt } from 'shared/lib/parseJwt/parseJwt.ts';

const initialState: UserSchema = {
    session: {
        accessToken: '',
        fullName: '',
    },
    _inited: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<JWTSession>) => {
            state.session.accessToken = action.payload.accessToken;
            state.session.fullName = action.payload.fullName;

            localStorage.setItem(
                AUTH_LOCALSTORAGE_KEY,
                JSON.stringify({
                    accessToken: action.payload.accessToken,
                }),
            );
            localStorage.setItem(
                NAME_LOCALSTORAGE_KEY,
                JSON.stringify({
                    fullName: action.payload.fullName,
                }),
            );
        },
        clearToken: (state) => {
            localStorage.setItem(AUTH_LOCALSTORAGE_KEY, '');
            localStorage.setItem(NAME_LOCALSTORAGE_KEY, '');
            state.session.accessToken = '';
            state.session.fullName = '';
            state.role = undefined;
        },
        init: (state) => {
            const session = localStorage.getItem(AUTH_LOCALSTORAGE_KEY);
            const name = localStorage.getItem(NAME_LOCALSTORAGE_KEY);
            if (session) {
                const sessionToken = JSON.parse(session).accessToken;
                state.session.accessToken = sessionToken;
                const userData = parseJwt(sessionToken) as UserSession;
                state.role = userData.role;
            }
            if (name) {
                state.session.fullName = JSON.parse(name).fullName;
            }
            state._inited = true;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            validateSessionToken.fulfilled,
            (state, action: PayloadAction<UserSession>) => {
                state.role = action.payload.role;
                state.userSession = action.payload;
            },
        );
    },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
