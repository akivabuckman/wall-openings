import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const getSocket = (): Socket => {
    const socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket"],
    });
  return socket;
};

export default getSocket;
