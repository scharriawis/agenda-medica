import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
    interface Window {
        Pusher: typeof Pusher
    }
}

window.Pusher = Pusher

export const echo = new Echo({
    broadcaster: 'reverb',
    key: 'agenda-key',
    wsHost: window.location.hostname,
    wsPort: 8080,
    forceTLS: false,
    disableStats: true,
})