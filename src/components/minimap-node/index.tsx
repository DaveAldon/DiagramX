import { type MiniMapNodeProps, useStore } from "@xyflow/react";
import { ShapeComponents, ShapeType } from "../shape/types";

// the custom minimap node is being used to render the shapes of the nodes in the minimap, too
function MiniMapNode({ id, width, height, x, y, selected }: MiniMapNodeProps) {
  // get the node data to render the shape accordingly
  const { color, type } = useStore(
    (state) => state.nodeLookup.get(id)?.data || {}
  );

  if (!color || !type) {
    return null;
  }

  const ShapeComponent = ShapeComponents[type as ShapeType];

  return (
    <g transform={`translate(${x}, ${y})`}>
      <ShapeComponent
        width={width}
        height={height}
        fill={color as string}
        strokeWidth={selected ? 6 : 0}
        className={
          selected
            ? "react-flow__minimap-node selected"
            : "react-flow__minimap-node"
        }
      />
    </g>
  );
}

export default MiniMapNode;
