import { io } from 'socket.io-client';
import { BASE_URL } from './constants';

let socket;

export function initSocket() {
  if (!socket) {
    socket = io(BASE_URL, {
      withCredentials: true,
      transports: ['websocket']
    });
  }
  return socket;
}

export function getSocket() {
  return socket;
}
