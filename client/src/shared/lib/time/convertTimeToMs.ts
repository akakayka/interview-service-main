export const convertTimeToMs = (time: string) => {
    const timeNumbers = time.split(':').map((num) => Number.parseInt(num));
    const hours = timeNumbers[0] ?? 0;
    const minutes = timeNumbers[1] ?? 0;

    return (hours * 60 * 60 + minutes * 60) * 1000;
};
