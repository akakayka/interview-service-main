import { Md5 } from 'ts-md5';

export const encryptString = (value: string): string => {
    return Md5.hashStr(value);
};
