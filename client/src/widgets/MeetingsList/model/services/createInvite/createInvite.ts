import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import {
    getAddCandidateFormInterviewId,
    getAddCandidateFormIsSynchronous,
} from '../../selectors/addCandidateSelectors.ts';
import { AddCandidateForm } from '../../types/addCandidate.ts';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';

interface CreateInviteResponse {
    config: AxiosRequestConfig;
    data: {
        invitation: string;
    };
    headers: AxiosHeaders;
    request: XMLHttpRequest;
    status: number;
    statusText: string;
}

export const createInvite = createAsyncThunk<string, void, ThunkConfig<string>>(
    'addCandidateForm/createInvite',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, getState } = thunkApi;
        const interviewId = getAddCandidateFormInterviewId(getState());
        const isSynchronous = getAddCandidateFormIsSynchronous(getState());

        try {
            const response = await extra.api.post<AddCandidateForm, CreateInviteResponse>(
                'invitations/create',
                {
                    role: 'candidate',
                    interviewId,
                    isSynchronous,
                },
            );
            if (!response.data.invitation) {
                throw new Error();
            }

            // return `https://localhost:5001/auth/register/${response.data.invitation}`;
            // return `http://localhost:5173/auth/register/${response.data.invitation}`;
            return `${UrlRoutes.client}auth/register/${response.data.invitation}`;
        } catch (e) {
            console.log(e);
            return rejectWithValue('error');
        }
    },
);
