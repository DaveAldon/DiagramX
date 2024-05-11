import React, { useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";

import "./buttonedge.css";
import useDraggableEdgeLabel from "@/hooks/useDraggableEdgeLabel";

export default function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [edgePathRef, draggableEdgeLabelRef] = useDraggableEdgeLabel(
    sourceX,
    sourceY,
    targetX,
    targetY,
    id
  );

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <path
        id={id}
        d={edgePath}
        markerEnd={markerEnd}
        style={{ ...style, strokeWidth: 2 }}
        ref={edgePathRef}
        stroke="#000"
        fill="transparent"
      />
      <EdgeLabelRenderer>
        <div
          ref={draggableEdgeLabelRef}
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <button className="edgebutton" onClick={onEdgeClick}>
            ×asdasd
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
