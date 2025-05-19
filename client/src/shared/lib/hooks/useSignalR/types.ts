import { MeetPeerData, SignalInfo, UserInfo } from 'shared/types/api.ts';

export type UseSignalRProps = {
    username: string;
    interviewId: string;
};

export type Message = {
    id: string;
    owner: string;
    message: string;
    date: number;
};

export type SignalRData = {
    newPeer: UserInfo | null;
    helloAnswer: UserInfo | null;
    disconnectedPeer: string | null;
    data: MeetPeerData;
    signal: SignalInfo | null;
};

export function uuidv4() {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
        (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16),
    );
}
