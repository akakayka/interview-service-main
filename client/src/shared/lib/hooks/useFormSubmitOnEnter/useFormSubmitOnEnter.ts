import { useEffect } from 'react';

interface UseFormSubmitOnEnterProps {
    inputsValid: boolean;
    callback: () => void;
}

export function useFormSubmitOnEnter(props: UseFormSubmitOnEnterProps) {
    const { callback, inputsValid } = props;

    useEffect(() => {
        const onKeyDownHandler = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && inputsValid) {
                callback();
            }
        };
        document.addEventListener('keydown', onKeyDownHandler);

        return () => {
            document.removeEventListener('keydown', onKeyDownHandler);
        };
    }, [callback, inputsValid]);
}
