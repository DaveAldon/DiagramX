import { useCallback, useRef, useState } from "react";
import {
  BaseEdge,
  useReactFlow,
  useStore,
  type Edge,
  type EdgeProps,
  type XYPosition,
} from "@xyflow/react";
import { ControlPoint, type ControlPointData } from "./ControlPoint";
import { getPath, getControlPoints } from "./path";
import { Algorithm } from "./constants";

const useIdsForInactiveControlPoints = (points: ControlPointData[]) => {
  const prevIds = useRef<string[]>([]);
  let newPoints: ControlPointData[] = [];
  if (prevIds.current.length === points.length) {
    // reuse control points from last render, just update their position
    newPoints = points.map((point, i) =>
      point.active ? point : { ...point, id: prevIds.current[i] }
    );
  } else {
    // calculate new control points
    newPoints = points.map((prevPoint, i) => {
      const id = window.crypto.randomUUID();
      prevIds.current[i] = id;
      return prevPoint.active ? points[i] : { ...points[i], id };
    });
  }

  return newPoints;
};

export type EditableEdgeData = {
  algorithm?: Algorithm;
  points: ControlPointData[];
};

export function EditableEdge({
  id,
  selected,
  source,
  sourceX,
  sourceY,
  sourcePosition,
  target,
  targetX,
  targetY,
  targetPosition,
  markerEnd,
  markerStart,
  style,
  data = { points: [] },
  ...delegated
}: EdgeProps) {
  const sourceOrigin = { x: sourceX, y: sourceY } as XYPosition;
  const targetOrigin = { x: targetX, y: targetY } as XYPosition;
  const color = style?.stroke || "#FFFFFF80";
  const direction = (style?.animationDirection as string) || "normal";
  const { setEdges } = useReactFlow();
  const shouldShowPoints = useStore((store) => {
    const sourceNode = store.nodeLookup.get(source as string)!;
    const targetNode = store.nodeLookup.get(target as string)!;

    return selected || sourceNode.selected || targetNode.selected;
  });

  const setControlPoints = useCallback(
    (update: (points: ControlPointData[]) => ControlPointData[]) => {
      setEdges((edges) =>
        edges.map((e) => {
          if (e.id !== id) return e;
          if (!isEditableEdge(e)) return e;

          const points = e.data?.points ?? [];
          const data = { ...e.data, points: update(points) };

          return { ...e, data };
        })
      );
    },
    [id, setEdges]
  );

  let pathPoints = [
    sourceOrigin,
    ...(Array.isArray(data.points) ? data.points : []),
    targetOrigin,
  ];
  const controlPoints = getControlPoints(
    pathPoints,
    data.algorithm as Algorithm | undefined,
    {
      fromSide: sourcePosition,
      toSide: targetPosition,
    }
  );
  const path = getPath(pathPoints, data.algorithm as Algorithm | undefined, {
    fromSide: sourcePosition,
    toSide: targetPosition,
  });

  const controlPointsWithIds = useIdsForInactiveControlPoints(controlPoints);
  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        {...delegated}
        markerStart={markerStart}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: color,
        }}
      />

      {shouldShowPoints &&
        controlPointsWithIds.map((point, index) => (
          <ControlPoint
            key={point.id}
            index={index}
            setControlPoints={setControlPoints}
            color={`${color}`}
            {...point}
          />
        ))}

      {data.showMovingBall ? (
        <circle
          style={{ filter: `drop-shadow(0px 0px 2px ${color}` }}
          r="4"
          fill={`${color}`}
          className="circle"
        >
          <animateMotion
            dur={`${getRandomDuration(4.5, 6)}s`}
            repeatCount="indefinite"
            path={path}
            keyPoints={direction === "normal" ? undefined : "1;0"}
            keyTimes={direction === "normal" ? undefined : "0;1"}
          />
        </circle>
      ) : null}
    </>
  );
}

function getRandomDuration(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const isEditableEdge = (edge: Edge): edge is Edge<EditableEdgeData> =>
  edge.type === "editable-edge";
