import { useState } from 'react';
import io from 'socket.io-client';

import { SocketStatus } from '../interfaces/socket.interface';

export const useSocket = (): [SocketIOClient.Socket, SocketStatus] => {
  const socket = io();
  const [status, setStatus] = useState<SocketStatus>('disconnected');

  socket.on('connect', () => {
    setStatus('connected');
  });

  socket.on('disconnect', () => {
    setStatus('disconnected');
  });

  return [socket, status];
};