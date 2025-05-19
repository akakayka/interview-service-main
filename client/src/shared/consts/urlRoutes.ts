export enum UrlRoutes {
    // Для production (Kubernetes)
    compiler = '/',
    user = '/api',
    client = '/',
    tracker = '/api/v1.0/tracker',
    signal = '/signalrtc',
    notification = '/notificationHub',

    // Альтернатива с env-переменными (лучший вариант)
    // compiler = process.env.VITE_API_BASE_URL + '/api',
    // signal = process.env.VITE_API_BASE_URL + '/signalrtc',
}