import { NodeToolbar } from "@xyflow/react";
import { ShapeComponents, ShapeType } from "../shape/types";
import SidebarItem from "../Sidebar/SidebarItem";
import { Trash2 } from "react-feather";
import { useEffect, useState } from "react";
import IconPicker from "../IconPicker/IconPicker";

const colors = [
  "#CF4C2C",
  "#EA9C41",
  "#EBC347",
  "#438D57",
  "#3F8AE2",
  "#803DEC",
  "#a5a4a5",
];

type ShapeNodeToolbarProps = {
  activeColor: string;
  activeShape: ShapeType;
  onColorChange?: (color: string) => void;
  onShapeChange?: (shape: ShapeType) => void;
  onDeleteNode?: () => void;
  onIconChange?: (contents: string) => void;
};

function ShapeNodeToolbar({
  onColorChange = () => false,
  onShapeChange = () => false,
  activeColor,
  activeShape,
  onDeleteNode,
  onIconChange,
}: ShapeNodeToolbarProps) {
  const [iconName, setIconName] = useState("");

  useEffect(() => {
    if (onIconChange) {
      onIconChange(iconName);
    }
  }, [iconName]);

  return (
    <NodeToolbar className="nowheel nodrag flex flex-col" offset={32}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-0.5">
          {colors.map((color) => (
            <button
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
              className={`color-swatch ${
                color === activeColor ? "active" : ""
              }`}
            />
          ))}
          {onDeleteNode ? (
            <button onClick={() => onDeleteNode()}>
              <Trash2 />
            </button>
          ) : null}
        </div>
      </div>
      <IconPicker value={iconName} onChange={setIconName} />
      <div className="grid grid-cols-10">
        {ShapeComponents &&
          Object.keys(ShapeComponents).map((shape) => (
            <button
              key={shape}
              onClick={() => onShapeChange(shape as ShapeType)}
              className={`${shape === activeShape ? "active" : ""}`}
            >
              <SidebarItem type={shape as ShapeType} key={shape} />
            </button>
          ))}
      </div>
    </NodeToolbar>
  );
}

export default ShapeNodeToolbar;
