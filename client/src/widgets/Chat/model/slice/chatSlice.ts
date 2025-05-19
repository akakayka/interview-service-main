import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatSchema } from '../../model/types/chat';

const initialState: ChatSchema = {
    isLoading: false,
    error: undefined,
    message: '',
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
    },
});

export const { actions: chatActions } = chatSlice;
export const { reducer: chatReducer } = chatSlice;
