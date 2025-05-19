import * as signalR from '@aspnet/signalr';
import { MeetPeerData, SignalInfo, UserInfo } from 'shared/types/api.ts';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';

export class SignalRService {
    private hubConnection!: signalR.HubConnection;

    public newPeer: UserInfo | null = null;
    public helloAnswer: UserInfo | null = null;
    public disconnectedPeer: UserInfo | null = null;

    public data: MeetPeerData = {};
    public signal: SignalInfo | null = null;

    public async startConnection(currentUserName: string, roomName: string): Promise<void> {
        console.log('HUB CONNECTED -----------------------', roomName);
        console.log(currentUserName, roomName);

        this.hubConnection = new signalR.HubConnectionBuilder().withUrl(UrlRoutes.signal).build();
        console.log(this.hubConnection);

        console.log('Wait for connection started');
        await this.hubConnection.start();
        console.log('Connection started');

        this.hubConnection.on('NewUserArrived', (data) => {
            this.newPeer = JSON.parse(data);
            console.log('New User Arrived', data);
        });

        this.hubConnection.on('UserSaidHello', (data) => {
            this.helloAnswer = JSON.parse(data);
            console.log('User Said Hello', data);
        });

        this.hubConnection.on('UserDisconnect', (data) => {
            try {
                this.disconnectedPeer = data;
            } catch (e) {
                console.error(e);
            }
            console.log('User Disconnect', data);
        });

        this.hubConnection.on('SendSignal', (user, signal) => {
            this.signal = { user, signal };
            console.log('Send Signal', user);
        });

        this.hubConnection.on('SendData', (_userName, data) => {
            this.data = JSON.parse(data) as MeetPeerData;
        });

        this.hubConnection.invoke('NewUser', currentUserName, roomName);
    }

    public sendSignalToUser(signal: string, user: string): void {
        this.hubConnection.invoke('SendSignal', signal, user);
    }

    public sayHello(userName: string, roomName: string, user: string): void {
        this.hubConnection.invoke('HelloUser', userName, roomName, user);
    }

    public sendData(userConnectionId: string, data: string): void {
        this.hubConnection.invoke('SendData', userConnectionId, data);
        console.log(data);
    }

    public disconnect(): Promise<void> {
        console.log('HUB DISCONNECT -----------------------------');

        return this.hubConnection.stop();
    }
}
