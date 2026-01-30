import { Socket } from "socket.io-client";

export function registerWallHandlers(socket: Socket) {
	socket.on('wall:joined', () => {
		// No-op for now
	});
}
