import { Line } from "react-konva";
import { tickAngle, tickLength } from "../constants";

interface TickProps {
  x: number;
  y: number;
  rotation?: number;
}


const Tick = ({ x, y, rotation = 0 }: TickProps) => {
  const rad = ((tickAngle + rotation) * Math.PI) / 180;
  const dx = (tickLength / 2) * Math.cos(rad);
  const dy = (tickLength / 2) * Math.sin(rad);
  return (
    <Line
      points={[x - dx, y + dy, x + dx, y - dy]}
      stroke="#222"
      strokeWidth={2}
      draggable={false}
    />
  );
};

export default Tick;
