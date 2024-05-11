import {
  NodeResizer,
  useStore,
  Handle,
  Position,
  useKeyPress,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import TextareaAutosize from "react-textarea-autosize";

import Shape from "../shape";
import { type ShapeType } from "../shape/types";
import NodeLabel from "./label";
import ShapeNodeToolbar from "../Toolbar/Toolbar";
import { useEffect, useState } from "react";
import useUndoRedo from "@/hooks/useUndoRedo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName, fas } from "@fortawesome/free-solid-svg-icons";

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
  const { takeSnapshot } = useUndoRedo();
  const [iconsLoaded, setIconsLoaded] = useState(false);

  const { width, height } = useNodeDimensions(id);
  const shiftKeyPressed = useKeyPress("Shift");
  const handleStyle = { backgroundColor: color };

  useEffect(() => {
    if (data.icon) {
      setTimeout(() => {
        setIconsLoaded(true);
        console.log("Icons loaded", data.icon);
      }, 3000);
    }
  }, []);

  const onColorChange = (color: string) => {
    takeSnapshot();
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
    takeSnapshot();
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

  const onTitleChange = (title: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              title,
            },
          };
        }

        return node;
      })
    );
  };

  const onDescriptionChange = (description: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              description,
            },
          };
        }

        return node;
      })
    );
  };

  const onContentsChange = (contents: any) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              contents,
            },
          };
        }

        return node;
      })
    );
  };

  const onIconChange = (icon: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              icon,
            },
          };
        }

        return node;
      })
    );
  };

  const onDeleteNode = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
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
        onDeleteNode={onDeleteNode}
        onIconChange={onIconChange}
      />
      <NodeResizer
        color={color}
        keepAspectRatio={shiftKeyPressed}
        isVisible={selected}
        onResize={onResize}
        onResizeStart={takeSnapshot}
      />
      <div style={{ position: "relative" }}>
        <input
          className={`absolute bottom-full p-2 text-center w-full text-sm font-bold  ${
            data.title === undefined || data.title === ""
              ? "bg-transparent"
              : "bg-white bg-opacity-10 backdrop-blur-sm rounded-md dark:bg-black"
          }`}
          //placeholder={data.type}
          value={data.title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <Shape
          type={type}
          width={width}
          height={height}
          fill={color}
          strokeWidth={1}
          stroke={color}
          fillOpacity={0.2}
        />
        <TextareaAutosize
          className={`absolute resize-none top-full p-2 text-left w-full text-xs  ${
            data.description === undefined || data.description === ""
              ? "bg-transparent"
              : "bg-white dark:bg-black bg-opacity-10 backdrop-blur-sm rounded-md"
          }`}
          //placeholder={data.type}
          value={data.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
      <Handle
        style={{ ...handleStyle, left: "23%" }}
        id="top-left"
        type="source"
        position={Position.Top}
      />
      <Handle
        style={handleStyle}
        id="top"
        type="source"
        position={Position.Top}
      />
      <Handle
        style={{ ...handleStyle, left: "auto", right: "20%" }}
        id="top-right"
        type="source"
        position={Position.Top}
      />
      <Handle
        style={{ ...handleStyle, top: "23%" }}
        id="right-top"
        type="source"
        position={Position.Right}
      />
      <Handle
        style={handleStyle}
        id="right"
        type="source"
        position={Position.Right}
      />
      <Handle
        style={{ ...handleStyle, top: "auto", bottom: "20%" }}
        id="right-bottom"
        type="source"
        position={Position.Right}
      />
      <Handle
        style={{ ...handleStyle, left: "23%" }}
        id="bottom-left"
        type="source"
        position={Position.Bottom}
      />
      <Handle
        style={handleStyle}
        id="bottom"
        type="source"
        position={Position.Bottom}
      />
      <Handle
        style={{ ...handleStyle, left: "auto", right: "20%" }}
        id="bottom-right"
        type="source"
        position={Position.Bottom}
      />
      <Handle
        style={{ ...handleStyle, top: "23%" }}
        id="left-top"
        type="source"
        position={Position.Left}
      />
      <Handle
        style={handleStyle}
        id="left"
        type="source"
        position={Position.Left}
      />
      <Handle
        style={{ ...handleStyle, top: "auto", bottom: "20%" }}
        id="left-bottom"
        type="source"
        position={Position.Left}
      />
      {data.icon ? null : (
        <NodeLabel
          placeholder={data.type}
          data={data.contents}
          onContentsChange={onContentsChange}
        />
      )}
      {data.icon ? (
        <FontAwesomeIcon
          className="h-[50%] w-[50%] node-label"
          icon={["fas", data.icon as IconName]}
          color={color}
        />
      ) : null}
    </>
  );
};

export default ShapeNode;
