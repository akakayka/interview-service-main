import { Instance } from 'simple-peer';
import { PeerData, UserInfo } from 'shared/types/api.ts';

declare let SimplePeer: any;

export class RtcService {
    public users: UserInfo[] = [];
    public onSignalToSend: PeerData | null = null;
    public onStream: PeerData | null = null;
    public onConnect: PeerData | null = null;
    public onData: PeerData | null = null;

    public currentPeer!: Instance | null;

    public newUser(user: UserInfo): void {
        this.users = [...this.users, user];
    }

    public disconnectedUser(user: UserInfo): void {
        this.users = this.users.filter((x) => x.connectionId === user.connectionId);
        if (this.currentPeer) {
            this.currentPeer.destroy();
            this.currentPeer = null;
        }
    }

    public disconnect(): void {
        this.currentPeer?.destroy();
        this.currentPeer = null;
    }

    public createPeer(stream: MediaStream, userId: string, initiator: boolean): Instance {
        const peer = new SimplePeer({ initiator, stream });

        peer.on('signal', (data: any) => {
            console.log('on signal', data);
            if (data.renegotiate || data.transceiverRequest) {
                return;
            }
            const stringData = JSON.stringify(data);
            this.onSignalToSend = { id: userId, data: stringData };
        });

        peer.on('stream', (data: any) => {
            console.log('on stream', data);
            this.onStream = { id: userId, data };
        });

        peer.on('connect', () => {
            console.log('on connect');
            this.onConnect = { id: userId, data: null };
        });

        peer.on('data', (data: any) => {
            console.log('on data', data);
            this.onData = { id: userId, data };
        });

        peer.on('close', () => {
            console.log('close');
            this.currentPeer = null;
        });

        return peer;
    }

    public signalPeer(userId: string, signal: string, stream: any): void {
        const signalObject = JSON.parse(signal);

        if (this.currentPeer) {
            this.currentPeer.signal(signalObject);
        } else {
            this.currentPeer = this.createPeer(stream, userId, false);
            this.currentPeer.signal(signalObject);
        }
    }
}
