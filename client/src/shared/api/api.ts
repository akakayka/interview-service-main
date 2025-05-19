import axios from 'axios';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';
import { AUTH_LOCALSTORAGE_KEY } from 'shared/consts/localstorage.ts';

export const $api = axios.create({
    baseURL: UrlRoutes.user,
});

$api.interceptors.request.use((config) => {
    if (config.headers) {
        const jwtSession = localStorage.getItem(AUTH_LOCALSTORAGE_KEY);

        const session = JSON.parse(jwtSession || '{}');

        if (session.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
    }
    return config;
});
