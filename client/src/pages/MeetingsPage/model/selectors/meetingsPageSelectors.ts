import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getMeetingsPageIsLoading = (state: StateSchema) => state.meetingsPage?.isLoading;
export const getMeetingsPageError = (state: StateSchema) => state.meetingsPage?.error;
export const getMeetingsPageMeetings = (state: StateSchema) => state.meetingsPage?.meetings;
