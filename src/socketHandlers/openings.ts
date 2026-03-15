import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { ErrorPayload, InitialOpeningsPayload, Opening, OpeningDeletedPayload, SaveStatus, SocketEvent } from "../types";
import { toast } from "react-toastify";

export const registerOpeningHandlers = (
    socket: Socket,
    setOpenings: Dispatch<SetStateAction<Opening[]>>,
    setWallId: (wallId: string) => void,
    setSaveStatus?: (status: SaveStatus) => void,
    setLastEntryId?: (lastEntryId: string) => void
) => {
    socket.on("initialOpenings", (data: SocketEvent<InitialOpeningsPayload>) => {
		setLastEntryId?.(data._meta.lastEntryId);
		if (data.payload.wallId) {
			setWallId(data.payload.wallId);
		}
		setSaveStatus?.('saved');
		if (!data.payload.openings) return setOpenings([]);
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

    socket.on("openingUpdated", (data: SocketEvent<Opening>) => {
		setLastEntryId?.(data._meta.lastEntryId);

        const updatedOpening = data.payload;
        setSaveStatus?.("saved");
        setOpenings((prev: Opening[]) => {
            const idx = prev.findIndex((o) => o.id === updatedOpening.id);
            if (idx === -1) return prev;
            const openings = [...prev];
            openings[idx] = updatedOpening;
            return openings;
        });
    });

    socket.on("newOpening", (data: SocketEvent<Opening>) => {
		setLastEntryId?.(data._meta.lastEntryId);

        const newOpening = data.payload;
        setSaveStatus?.("saved");
        setOpenings((prev: Opening[]) => [...prev, newOpening]);
    });

    socket.on("openingDeleted", (data: SocketEvent<OpeningDeletedPayload>) => {
		setLastEntryId?.(data._meta.lastEntryId);

        const { openingId } = data.payload;
        setSaveStatus?.("saved");
        setOpenings((prev: Opening[]) => prev.filter((o) => o.id !== openingId));
    });

    socket.on("error", (data: SocketEvent<ErrorPayload>) => {
        setSaveStatus?.("error");
        toast.error("Something went wrong" + (data.payload.message ? `: ${data.payload.message}` : ""));
    });
};
