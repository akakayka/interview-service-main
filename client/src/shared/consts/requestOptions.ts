import { ContentType } from './contentType.ts';
import { RequestMethodType } from './requestMethod.ts';
import { RequestResponseType } from './requestResponceType.ts';

export interface IRequestOptions<F = null> {
    url: string;
    method?: RequestMethodType;
    timeout?: number;
    params?:
        | string
        | URLSearchParams
        | {
              [key: string]: string | string[] | number | number[];
          };
    headers?: Headers;
    withCredentials?: boolean;
    responseType?: RequestResponseType;
    contentType?: ContentType;
    auth?: boolean;
    body?: F | null;
}
