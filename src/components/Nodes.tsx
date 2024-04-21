import { Handle, Position } from "@xyflow/react";
import React from "react";

export const enum NodeType {
  Circle = "circle",
  Rectangle = "rectangle",
  Triangle = "triangle",
  Text = "text",
}

const RectangleNode = ({ data }: { data: any }) => {
  return (
    <div style={{ background: "#9ca8b3", padding: "14px" }}>
      <Handle
        type="target"
        position={Position.Left}
        id={`${data.id}.left`}
        style={{ borderRadius: 0 }}
      />
      <div id={data.id}>{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        id={`${data.id}.right1`}
        style={{ top: "30%", borderRadius: 0 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`${data.id}.right2`}
        style={{ top: "70%", borderRadius: 0 }}
      />
    </div>
  );
};

const CircleNode = ({ data }: { data: any }) => {
  return (
    <div
      style={{
        backgroundColor: "#9ca8b3",
        padding: "14px",
        borderRadius: "50px",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id={`${data.id}.left`}
        style={{ borderRadius: "0" }}
      />
      <div id={data.id}>{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        id={`${data.id}.right1`}
        style={{ top: "30%", borderRadius: 0 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`${data.id}.right2`}
        style={{ top: "70%", borderRadius: 0 }}
      />
    </div>
  );
};

const TriangleNode = ({ data }: { data: any }) => {
  return (
    <div className="triangle-node">
      <Handle
        type="target"
        position={Position.Top}
        id={`${data.id}.top`}
        style={{ borderRadius: 0 }}
      />
      <div id={data.id} className="triangle-node-text">
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${data.id}.bottom1`}
        style={{ left: "30%", borderRadius: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${data.id}.bottom2`}
        style={{ left: "70%", borderRadius: 0 }}
      />
    </div>
  );
};

export const TextNode = ({ data }: { data: any }) => {
  return (
    <div style={{ background: "transparent", padding: "14px" }}>
      <div id={data.id}>{data.label}</div>
    </div>
  );
};

export const nodeTypes = {
  circle: CircleNode,
  rectangle: RectangleNode,
  triangle: TriangleNode,
  text: TextNode,
};
