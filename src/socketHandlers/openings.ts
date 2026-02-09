import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { Opening } from "../types";

export const registerOpeningHandlers = (
	socket: Socket, 
	setOpenings: Dispatch<SetStateAction<Opening[]>>,
	setWallId: (wallId: string) => void
) => {
	socket.on('initialOpenings', (data: { type: string, payload: { wallId: string, openings: Opening[] }}) => {
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
					id: o.id,
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
					id: o.id,
					xIndex: idx,
				};
			}
			return null;
		}).filter(Boolean) as Opening[];
		setOpenings(openings);
	});

	socket.on('dbUpdated', (data: { type: string, payload: Opening}) => {
		const updatedOpening = data.payload;
        setOpenings((prev: Opening[]) => {
            const idx = prev.findIndex(o => o.id === updatedOpening.id);
            if (idx === -1) return prev;
            const openings = [...prev];
            openings[idx] = updatedOpening;
            return openings;
        });
	});
};
