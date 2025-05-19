export const convertTimeMsToString = (timeMs: number): string => {
    const date = new Date(timeMs);
    return (
        date.toLocaleDateString('ru-ru', { dateStyle: 'full' }) +
        ' ' +
        date.toTimeString().split('GMT')[0]
    );
};

export const convertTimeMsToHours = (timeMs: number): string => {
    return `${timeMs / 3600000} час(а)`;
};
