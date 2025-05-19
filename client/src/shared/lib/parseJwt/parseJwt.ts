import { JWTSession, UserSession } from 'entities/User';
import { AUTH_LOCALSTORAGE_KEY, NAME_LOCALSTORAGE_KEY } from 'shared/consts/localstorage.ts';

export const getJWTSession = (): JWTSession => {
    const session: string | null = localStorage.getItem(AUTH_LOCALSTORAGE_KEY);
    const name = localStorage.getItem(NAME_LOCALSTORAGE_KEY);

    if (session === null) {
        return { accessToken: '', fullName: name ?? '' };
    }

    return JSON.parse(session) as JWTSession;
};

export const parseJwt = (token: string): object => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(''),
    );

    return JSON.parse(jsonPayload);
};

export const getJWTInfo = (): UserSession => {
    const jwtSession = getJWTSession();

    if (!jwtSession || !jwtSession.accessToken) {
        return {};
    }

    const newObj = parseJwt(jwtSession.accessToken);
    const session = {} as UserSession;
    Object.assign(session, newObj);

    return session;
};
