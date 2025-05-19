import { useCallback, useEffect, useRef, useState } from 'react';
import { UserInfo } from 'shared/types/api.ts';
import * as signalR from '@aspnet/signalr';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';
import { toast } from 'react-toastify';
import { Message, SignalRData, UseSignalRProps } from './types.ts';

export function useSignalR(props: UseSignalRProps) {
    const { username, interviewId } = props;
    const [otherUser, setOtherUser] = useState<UserInfo | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const hubConnection = useRef<signalR.HubConnection>(
        new signalR.HubConnectionBuilder().withUrl(UrlRoutes.signal).build(),
    );

    const [signalRData, setSignalRData] = useState<SignalRData>({
        newPeer: null,
        helloAnswer: null,
        disconnectedPeer: null,
        data: {},
        signal: null,
    });

    async function startConnection(currentUserName: string, roomName: string) {
        console.log('HUB CONNECTED -----------------------', roomName);
        console.log(currentUserName, roomName);

        await hubConnection.current.start();
        console.log('Connection started');

        hubConnection.current.on('NewUserArrived', (data) => {
            setSignalRData({ ...signalRData, newPeer: JSON.parse(data) });
            console.log('New User Arrived', data);
        });

        hubConnection.current.on('UserSaidHello', (data) => {
            setSignalRData({ ...signalRData, helloAnswer: JSON.parse(data) });
            console.log('User Said Hello', data);
        });

        hubConnection.current.on('UserDisconnect', (data) => {
            setSignalRData({ ...signalRData, disconnectedPeer: data });
            console.log('User Disconnect', data);
        });

        hubConnection.current.on('SendSignal', (user, signal) => {
            setSignalRData({ ...signalRData, signal: { user, signal } });
            console.log('Send Signal', user);
        });

        hubConnection.current.on('SendData', (_userName, newData) => {
            const receivedData = JSON.parse(newData);
            if (receivedData.message) {
                setMessages((prev) => [...prev, receivedData]);
            }
            setSignalRData({ ...signalRData, data: receivedData });
        });

        hubConnection.current.invoke('NewUser', currentUserName, roomName);
    }

    function sendSignalToUser(signal: string, user: string): void {
        hubConnection.current.invoke('SendSignal', signal, user);
    }

    function sayHello(userName: string, roomName: string, user: string): void {
        hubConnection.current.invoke('HelloUser', userName, roomName, user);
    }

    function sendData(userConnectionId: string, data: string): void {
        hubConnection.current.invoke('SendData', userConnectionId, data);
    }

    function disconnect(): Promise<void> {
        console.log('HUB DISCONNECT -----------------------------');

        return hubConnection.current.stop();
    }

    useEffect(() => {
        if (!interviewId) return;
        if (signalRData && signalRData.newPeer) {
            sayHello(username, interviewId, signalRData.newPeer.connectionId);
            setOtherUser(signalRData.newPeer);
            toast.info(
                username === 'candidate' ? 'Интервьюер подключился' : 'Кандидат подключился',
            );
        }
    }, [interviewId, signalRData, signalRData.newPeer, username]);

    useEffect(() => {
        if (signalRData && signalRData.helloAnswer) {
            setOtherUser(signalRData.helloAnswer);
        }
    }, [signalRData]);

    useEffect(() => {
        if (
            signalRData &&
            signalRData.disconnectedPeer &&
            signalRData.disconnectedPeer === otherUser?.connectionId
        ) {
            toast.info(username === 'candidate' ? 'Интервьюер отключился' : 'Кандидат отключился');
            setOtherUser(null);
        }
    }, [otherUser?.connectionId, signalRData, username]);

    useEffect(() => {
        startConnection(username, interviewId);
        return () => {
            disconnect();
        };
        // eslint-disable-next-line
    }, [interviewId, username]);

    const sendDataToOther = useCallback(
        async (data: string) => {
            if (otherUser && data) {
                const objData = JSON.parse(data);
                if (objData && objData.message) {
                    setMessages((prev) => [...prev, objData]);
                }
                sendData(otherUser.connectionId, data);
            }
        },
        [otherUser],
    );

    return {
        sendDataToOther,
        otherUser,
        data: signalRData,
        messages,
        disconnect,
        sendSignalToUser,
    };
}
