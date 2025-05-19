import { useDispatch } from 'react-redux';
import { AppDispatch } from 'app/providers/StoreProvider/config/store.ts';

export const useAppDispatch = () => useDispatch<AppDispatch>();
