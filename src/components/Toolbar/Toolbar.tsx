import { NodeToolbar } from "@xyflow/react";
import { ShapeComponents, ShapeType } from "../shape/types";
import SidebarItem from "../Sidebar/SidebarItem";

const colors = [
  "#CF4C2C",
  "#EA9C41",
  "#EBC347",
  "#438D57",
  "#3F8AE2",
  "#803DEC",
];

type ShapeNodeToolbarProps = {
  activeColor: string;
  activeShape: ShapeType;
  onColorChange?: (color: string) => void;
  onShapeChange?: (shape: ShapeType) => void;
};

function ShapeNodeToolbar({
  onColorChange = () => false,
  onShapeChange = () => false,
  activeColor,
  activeShape,
}: ShapeNodeToolbarProps) {
  return (
    <NodeToolbar className="nodrag flex flex-col" offset={32}>
      <div className="flex flex-row gap-2">
        {colors.map((color) => (
          <button
            key={color}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            className={`color-swatch ${color === activeColor ? "active" : ""}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-5">
        {ShapeComponents &&
          Object.keys(ShapeComponents).map((shape) => (
            <button
              key={shape}
              onClick={() => onShapeChange(shape as ShapeType)}
              className={`shape-button ${
                shape === activeShape ? "active" : ""
              }`}
            >
              <SidebarItem type={shape as ShapeType} key={shape} />
            </button>
          ))}
      </div>
    </NodeToolbar>
  );
}

export default ShapeNodeToolbar;
