import {
  Handle,
  NodeResizer,
  Position,
  useUpdateNodeInternals,
} from "@xyflow/react";
import React, { useEffect, useRef, useState } from "react";
import { drag } from "d3-drag";
import { select } from "d3-selection";

export const enum NodeType {
  Circle = "circle",
  Rectangle = "rectangle",
  Text = "text",
}

interface NodeProps {
  data?: any;
  hide?: boolean;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  nodeType?: NodeType;
}

export const CustomNode = (props: NodeProps) => {
  const nodeRef = useRef(null);
  const rotateControlRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [rotation, setRotation] = useState(0);
  const [resizable, setResizable] = useState(true);
  const [rotatable, setRotatable] = useState(true);

  useEffect(() => {
    if (!rotateControlRef.current || props.hide) {
      return;
    }
    const selection = select<Element, unknown>(rotateControlRef.current);

    const dragHandler = drag().on("drag", (evt) => {
      const dx = evt.x - 100;
      const dy = evt.y - 100;
      const rad = Math.atan2(dx, dy);
      const deg = rad * (180 / Math.PI);
      setRotation(180 - deg);
      updateNodeInternals(props.id as string);
    });

    selection.call(dragHandler);
  }, [props.hide, props.id, updateNodeInternals]);

  return (
    <>
      <div
        ref={nodeRef}
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
        className={
          props.nodeType === NodeType.Circle
            ? "node bg-[#9ca8b3] rounded-full"
            : "node rectangle-node"
        }
      >
        {!props.hide && (
          <>
            <NodeResizer
              isVisible={resizable}
              minWidth={10}
              minHeight={10}
              onResize={() => updateNodeInternals(props.id as string)}
            />
            <div
              ref={rotateControlRef}
              style={{
                display: rotatable ? "block" : "none",
              }}
              className={`nodrag rotateHandle`}
            />
            <div id={props.id}>{props.data.label}</div>
            <Handle
              type="source"
              position={Position.Left}
              id={`${props.id}.left1`}
              className="rounded-full"
            />
            <Handle
              type="source"
              position={Position.Right}
              id={`${props.id}.right1`}
              className="rounded-full"
            />
            <Handle
              type="source"
              position={Position.Top}
              id={`${props.id}.top1`}
              className="rounded-full"
            />
            <Handle
              type="source"
              position={Position.Bottom}
              id={`${props.id}.bottom1`}
              className="rounded-full"
            />
          </>
        )}
      </div>
    </>
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
  circle: (props: NodeProps) => (
    <CustomNode {...props} nodeType={NodeType.Circle} />
  ),
  rectangle: (props: NodeProps) => (
    <CustomNode {...props} nodeType={NodeType.Rectangle} />
  ),
  text: TextNode,
};
