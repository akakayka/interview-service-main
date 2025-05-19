import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getSidebarVisible = (state: StateSchema) => state.sidebar.visible;
export const getSidebarCollapsed = (state: StateSchema) => state.sidebar.collapsed;
