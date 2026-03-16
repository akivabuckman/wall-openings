import { Dispatch, SetStateAction } from "react";

interface OpeningBase {
  x: number;
  elevation: number;
  color: string;
  id: number;
  fromPrevious: number;
  xIndex: number;
  wallId?: string;
}

export interface RectangleOpening extends OpeningBase {
  shape: 'RECTANGLE';
  width: number;
  height: number;
}

export interface CircleOpening extends OpeningBase {
  shape: 'CIRCLE';
  radius: number;
}

export type Opening = RectangleOpening | CircleOpening;

export type SaveStatus = 'saving' | 'saved' | 'error';

export type ResponseType = string;

export type SocketMeta = {
  lastEntryId: string;
  eventId: string;
  replayed?: boolean;
};

export type SocketResponse<TPayload = any> = {
  type: ResponseType;
  source?: "server";
  payload?: TPayload;
  _meta?: SocketMeta;
};

export type SocketEvent<TPayload> = SocketResponse<TPayload> & {
  payload: TPayload;
  _meta: SocketMeta;
};

export type InitialOpeningsPayload = {
    wallId: string;
    openings: Opening[];
};

export type OpeningDeletedPayload = {
    openingId: number;
};

export type ErrorPayload = {
    message: string;
};

export interface SocketCallbacks {
  setOpenings: Dispatch<SetStateAction<Opening[]>>;
  setWallId: (wallId: string) => void;
  setSaveStatus?: (status: SaveStatus) => void;
  setLastEntryId?: (lastEntryId: string) => void;
  getLastEntryId?: () => string | null;
  setRedisAvailable?: (available: boolean) => void;
  getWallId?: () => string | null;
  onConnect?: (wallId: string | null) => void;
};
