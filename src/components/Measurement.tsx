import { Line, Text } from "react-konva";
import Tick from "./Tick";

interface MeasurementProps {
  startX: number;
  endX: number;
  y: number;
}

const Measurement = ({ startX, endX, y }: MeasurementProps) => {
  const length = endX - startX;
  const midX = startX + length / 2;
  return [
    <Line
      key="main"
      points={[startX, y, endX, y]}
      stroke="#222"
      strokeWidth={2}
      draggable={false}
    />,
    <Tick key="tickLeft" x={startX} y={y} />,
    <Tick key="tickRight" x={endX} y={y} />,
    <Text
      key="label"
      x={midX}
      y={y - 20}
      text={length.toString()}
      fontSize={18}
      fill="#222"
      align="center"
      draggable={false}
    />
  ];
};

export default Measurement;
