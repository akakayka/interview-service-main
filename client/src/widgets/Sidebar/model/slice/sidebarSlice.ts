import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SidebarSchema } from '../types/sidebar.ts';

const initialState: SidebarSchema = {
    collapsed: false,
    visible: false,
};

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setCollapsed: (state, action: PayloadAction<boolean>) => {
            state.collapsed = action.payload;
        },
        setVisible: (state, action: PayloadAction<boolean>) => {
            state.visible = action.payload;
        },
    },
});

export const { actions: sidebarActions } = sidebarSlice;
export const { reducer: sidebarReducer } = sidebarSlice;
