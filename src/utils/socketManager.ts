import { getSocket, emitWallJoin, requestReconnect } from "./socket";
import { registerOpeningHandlers } from "../socketHandlers/openings";
import { registerWallHandlers } from "../socketHandlers/walls";
import { SaveStatus, SocketCallbacks } from "../types";
import { toast } from "react-toastify";

export function initializeSocket(callbacks: SocketCallbacks, wallIdParam: string | null) {
	const socket = getSocket();
	let hasConnectedOnce = false;
	let disconnectedSinceLastConnect = false;
	let currentSaveStatus: SaveStatus | undefined;

	const setSaveStatus = (status: SaveStatus) => {
		currentSaveStatus = status;
		callbacks.setSaveStatus?.(status);
	};
	const resolveWallId = () => callbacks.getWallId?.() ?? wallIdParam;
	
	// Register all event handlers
	registerOpeningHandlers(
		socket,
		callbacks.setOpenings,
		callbacks.setWallId,
		setSaveStatus,
		callbacks.setLastEntryId,
		callbacks.setRedisAvailable
	);
	registerWallHandlers(socket);
	
	// Handle connection
	socket.on('connect', () => {
		const currentWallId = resolveWallId();
		if (!hasConnectedOnce) {
			emitWallJoin(currentWallId);
			if (callbacks.onConnect) {
				callbacks.onConnect(currentWallId);
			}
			hasConnectedOnce = true;
			disconnectedSinceLastConnect = false;
			return;
		}

		if (!disconnectedSinceLastConnect) return;

		const lastEntryId = callbacks.getLastEntryId?.();
		if (currentWallId && lastEntryId) {
			requestReconnect(currentWallId || '', lastEntryId || '');
		} else {
			emitWallJoin(currentWallId);
		}
		disconnectedSinceLastConnect = false;
	});

	socket.on('disconnect', () => {
		console.log("Socket disconnected");
		disconnectedSinceLastConnect = true;
	});

	socket.on('connect_error', () => {
		if (currentSaveStatus === 'error') return;
		toast.error("Cannot connect to server");
		setSaveStatus('error');
	});
	
	return socket;
}
