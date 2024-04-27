import {
  NodeResizer,
  useStore,
  Handle,
  Position,
  useKeyPress,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";

import Shape from "../shape";
import { type ShapeType } from "../shape/types";
import NodeLabel from "./label";
import ShapeNodeToolbar from "../Toolbar/Toolbar";
import { useEffect } from "react";

export type ShapeNodeData = {
  type: ShapeType;
  color: string;
};

// this will return the current dimensions of the node (measured internally by react flow)
const useNodeDimensions = (id: string) => {
  const node = useStore((state) => state.nodeLookup.get(id));
  return {
    width: node?.measured?.width || 0,
    height: node?.measured?.height || 0,
  };
};

const ShapeNode = ({ id, selected, data }: any) => {
  const { color, type }: { color: string; type: ShapeType } = data as any;
  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const { width, height } = useNodeDimensions(id);
  const shiftKeyPressed = useKeyPress("Shift");
  const handleStyle = { backgroundColor: color };

  const onColorChange = (color: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              color,
            },
          };
        }

        return node;
      })
    );
  };

  const onShapeChange = (shape: ShapeType) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              type: shape,
            },
          };
        }

        return node;
      })
    );
  };

  const onResize = () => {
    updateNodeInternals(id);
  };

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, updateNodeInternals]);

  return (
    <>
      <ShapeNodeToolbar
        onColorChange={onColorChange}
        onShapeChange={onShapeChange}
        activeShape={type}
        activeColor={color}
      />
      <NodeResizer
        color={color}
        keepAspectRatio={shiftKeyPressed}
        isVisible={selected}
        onResize={onResize}
      />
      <Shape
        type={type}
        width={width}
        height={height}
        fill={color}
        strokeWidth={2}
        stroke={color}
        fillOpacity={0.8}
      />
      <Handle
        style={handleStyle}
        id="top"
        type="source"
        position={Position.Top}
      />
      <Handle
        style={handleStyle}
        id="right"
        type="source"
        position={Position.Right}
      />
      <Handle
        style={handleStyle}
        id="bottom"
        type="source"
        position={Position.Bottom}
      />
      <Handle
        style={handleStyle}
        id="left"
        type="source"
        position={Position.Left}
      />
      <NodeLabel placeholder={data.type} />
    </>
  );
};

export default ShapeNode;
