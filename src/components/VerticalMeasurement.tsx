import { Group, Line, Text } from "react-konva";
import Tick from "./Tick";

interface VerticalMeasurementProps {
  startY: number;
  endY: number;
  x: number;
}

const VerticalMeasurement = ({ startY, endY, x }: VerticalMeasurementProps) => {
  const length = endY - startY;
  const midY = startY + length / 2;
  return [
    <Line
      key="main"
      points={[x, startY, x, endY]}
      stroke="#222"
      strokeWidth={2}
      draggable={false}
    />,
    <Tick key="tickTop" x={x} y={startY} rotation={90} />,
    <Tick key="tickBottom" x={x} y={endY} rotation={90} />,
    // Flip only the text so it is not mirrored by parent scaleY
    <Group key="label-group" scaleY={-1} x={0} y={2 * midY}>
      <Text
        x={x - 40}
        y={midY - 9}
        text={length.toString()}
        fontSize={18}
        fill="#222"
        align="center"
        draggable={false}
      />
    </Group>
  ];
};

export default VerticalMeasurement;
