import { useEffect } from 'react';
import socketIO from 'socket.io-client';

let socket = socketIO.connect("http://localhost:3000");
export default socket;