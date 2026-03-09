import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { Opening, SaveStatus } from "../types";
import { toast } from "react-toastify";

export const registerOpeningHandlers = (
	socket: Socket, 
	setOpenings: Dispatch<SetStateAction<Opening[]>>,
	setWallId: (wallId: string) => void,
	setSaveStatus?: (status: SaveStatus) => void
) => {
	socket.on('initialOpenings', (data: { type: string, payload: { wallId: string, openings: Opening[] }}) => {
		if (data?.payload?.wallId) {
			setWallId(data.payload.wallId);
		}
		setSaveStatus?.('saved');
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

	socket.on('openingUpdated', (data: { type: string, payload: Opening}) => {
		const updatedOpening = data.payload;
		setSaveStatus?.('saved');
        setOpenings((prev: Opening[]) => {
            const idx = prev.findIndex(o => o.id === updatedOpening.id);
            if (idx === -1) return prev;
            const openings = [...prev];
            openings[idx] = updatedOpening;
            return openings;
        });
	});

	socket.on('newOpening', (data: { type: string, payload: Opening}) => {
		const newOpening = data.payload;
		setSaveStatus?.('saved');
		setOpenings((prev: Opening[]) => [...prev, newOpening]);
	});

	socket.on('openingDeleted', (data: { type: string, payload: { openingId: number }}) => {
		const { openingId } = data.payload;
		setSaveStatus?.('saved');
		setOpenings((prev: Opening[]) => prev.filter(o => o.id !== openingId));
	});

	socket.on('error', (data: { type: string, payload: { message: string }}) => {
		setSaveStatus?.('error');
		toast.error("Something went wrong" + (data.payload.message ? `: ${data.payload.message}` : ""));
	});
};
