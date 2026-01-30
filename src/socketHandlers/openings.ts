import { Socket } from "socket.io-client";
import { Opening } from "../types";

export const registerOpeningHandlers = (socket: Socket, setOpenings: (data: Opening[]) => void) => {
	socket.on('initialOpenings', (payload: { openings: any[] }) => {
		if (!payload?.openings) return setOpenings([]);
		const openings: Opening[] = payload.openings.map((o, idx) => {
			if (o.shape === 'RECTANGLE') {
				return {
					type: 'rectangle',
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
					type: 'circle',
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
