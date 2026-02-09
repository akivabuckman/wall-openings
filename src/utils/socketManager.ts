import getSocket, { emitWallJoin } from "./socket";
import { registerOpeningHandlers } from "../socketHandlers/openings";
import { registerWallHandlers } from "../socketHandlers/walls";

import { Dispatch, SetStateAction } from "react";
import { Opening } from "../types";

interface SocketCallbacks {
	setOpenings: Dispatch<SetStateAction<Opening[]>>;
	setWallId: (wallId: string) => void;
	onConnect?: (wallId: string | null) => void;
}

export function initializeSocket(callbacks: SocketCallbacks, wallIdParam: string | null) {
	const socket = getSocket();
	
	// Register all event handlers
    registerOpeningHandlers(socket, callbacks.setOpenings, callbacks.setWallId);
	registerWallHandlers(socket);
	
	// Handle connection
	socket.on('connect', () => {
		emitWallJoin(wallIdParam);
		if (callbacks.onConnect) {
			callbacks.onConnect(wallIdParam);
		}
	});
	
	return socket;
}
