import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getChatMessage = (state: StateSchema) => state.chat?.message;
export const getChatIsLoading = (state: StateSchema) => state.chat?.isLoading;
export const getChatError = (state: StateSchema) => state.chat?.error;
