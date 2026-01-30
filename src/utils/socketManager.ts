import getSocket from "./socket";
import { registerOpeningHandlers } from "../socketHandlers/openings";
import { registerWallHandlers } from "../socketHandlers/walls";
import { Opening } from "../types";

export function initializeSocketManager(setOpenings: (data: Opening[]) => void) {
	const socket = getSocket();
    registerOpeningHandlers(socket, setOpenings);
	registerWallHandlers(socket);
	return socket;
}
