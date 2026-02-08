import { Socket } from "socket.io-client";
import { Opening } from "../types";

export const registerOpeningHandlers = (
	socket: Socket, 
	setOpenings: (data: Opening[]) => void,
	setWallId: (wallId: string) => void
) => {
	socket.on('initialOpenings', (data: { type: string, payload: { wallId: string, openings: Opening[] }}) => {
		// Set wallId via callback
		if (data?.payload?.wallId) {
			setWallId(data.payload.wallId);
		}
		if (!data?.payload?.openings) return setOpenings([]);
		const openings: Opening[] = data.payload.openings.map((o, idx) => {
			if (o.shape === 'RECTANGLE') {
				return {
					shape: 'RECTANGLE',
					width: o.width,
					height: o.height,
					x: o.x,
					elevation: o.elevation,
					color: o.color,
					fromPrevious: o.fromPrevious,
					id: idx,
					xIndex: idx,
				};
			} else if (o.shape === 'CIRCLE') {
				return {
					shape: 'CIRCLE',
					radius: o.radius,
					x: o.x,
					elevation: o.elevation,
					color: o.color,
					fromPrevious: o.fromPrevious,
					id: idx,
					xIndex: idx,
				};
			}
			return null;
		}).filter(Boolean) as Opening[];
		setOpenings(openings);
	});
}
