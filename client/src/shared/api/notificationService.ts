import * as signalR from '@microsoft/signalr';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';

export class NotificationService {
    private hubConnection!: signalR.HubConnection;
    public notification: string = '';

    constructor() {}

    public async startConnection(roomName: string): Promise<void> {
        console.log('HUB CONNECTED -----------------------', roomName);

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(UrlRoutes.notification)
            .build();

        await this.hubConnection.start();
        console.log('Notification Connection started');

        this.hubConnection.on('NewUserArrived', (data) => {
            console.log('New User Arrived', data);
        });

        this.hubConnection.on('SendNotification', (data) => {
            this.notification = data;
            console.log('Send Notification');
        });

        this.hubConnection.onclose((error) => {
            console.assert(this.hubConnection.state === signalR.HubConnectionState.Disconnected);
            console.log(error);
        });

        this.hubConnection.invoke('NewUser', 'wee', roomName);
    }
}
