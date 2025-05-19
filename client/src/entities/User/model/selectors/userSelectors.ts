import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getUserRole = (state: StateSchema) => state.user.role;
export const getUserSession = (state: StateSchema) => state.user.session || '';
export const getUserInited = (state: StateSchema) => state.user._inited || false;
