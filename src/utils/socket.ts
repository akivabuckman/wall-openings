import { io, Socket } from "socket.io-client";
import { Opening } from "../types";
import { SOCKET_URL } from "../constants";

// Singleton socket instance
let socketInstance: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket"],
    });
  }
  return socketInstance;
};

// Utility functions for emitting events
export const emitWallJoin = (wallId: string | null) => {
  const socket = getSocket();
  socket.emit('wallJoin', {wallId, source: "client"});
};

export const emitOpeningChange = (opening: Opening, wallId?: string) => {
  if (!wallId) {
    console.error("Wall ID is required to emit opening changes");
    return;
  }
  const { xIndex, ...formattedOpening } = opening;
  formattedOpening.wallId = wallId;
  const socket = getSocket();
  socket.emit('openingChange', {opening: formattedOpening, source: "client"});
};

export const emitDeleteOpening = (openingId: number, wallId?: string) => {
  if (!wallId) {
    console.error("Wall ID is required to delete an opening");
    return;
  }
  const socket = getSocket();
  socket.emit('deleteOpening', {openingId, wallId, source: "client"});
};

export const emitRequestNewOpening = (wallId?: string) => {
  if (!wallId) {
    console.error("Wall ID is required to request a new opening");
    return;
  }
  const socket = getSocket();
  socket.emit('requestNewOpening', {wallId, source: "client"});
};

export default getSocket;
