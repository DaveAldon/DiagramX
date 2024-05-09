import { RefObject, useCallback, useRef, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  useReactFlow,
  useStore,
  type Edge,
  type EdgeProps,
  type XYPosition,
} from "@xyflow/react";
import { ControlPoint, type ControlPointData } from "./ControlPoint";
import { getPath, getControlPoints } from "./path";
import { Algorithm } from "./constants";
import { useDiagram } from "@/hooks/useDiagram";
import useDraggableEdgeLabel from "@/hooks/useDraggableEdgeLabel";
import { Animation } from "@/components/EdgeToolbar/EdgeToolbar";

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

interface EditableEdgeProps extends EdgeProps {
  useDiagram: ReturnType<typeof useDiagram>;
}
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
  useDiagram,
  ...delegated
}: EditableEdgeProps) {
  const { setEdges } = useReactFlow();

  const sourceOrigin = { x: sourceX, y: sourceY } as XYPosition;
  const targetOrigin = { x: targetX, y: targetY } as XYPosition;
  const color = style?.stroke || "#a5a4a5";
  const direction = (style?.animationDirection as string) || "normal";
  const shouldShowPoints = useStore((store) => {
    const sourceNode = store.nodeLookup.get(source as string)!;
    const targetNode = store.nodeLookup.get(target as string)!;

    return selected || sourceNode.selected || targetNode.selected;
  });

  const [edgePathRef, draggableEdgeLabelRef] = useDraggableEdgeLabel(
    sourceX,
    sourceY,
    targetX,
    targetY
  );

  const setControlPoints = useCallback(
    (update: (points: ControlPointData[]) => ControlPointData[]) => {
      console.log("setControlPoints");

      setEdges((edges) =>
        edges.map((e) => {
          if (e.id !== id) return e;
          if (!isEditableEdge(e)) return e;

          const points = e.data?.points ?? [];
          const localData = { ...e.data, points: update(points) };

          return { ...e, data: localData };
        })
      );
      /* setTimeout(() => {
        useDiagram.setEdges((edges) =>
          edges.map((e) => {
            if (e.id !== id) return e;
            if (!isEditableEdge(e)) return e;

            const points = e.data?.points ?? [];
            const localData = { ...e.data, points: update(points) };

            return { ...e, data: localData };
          })
        );
      }, 1000); */
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
  console.log(data.animation);
  return (
    <>
      <path
        id={id}
        d={path}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: color,
        }}
        ref={edgePathRef}
        fill="transparent"
      />
      <EdgeLabelRenderer>
        <div
          ref={draggableEdgeLabelRef}
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%)`,
            pointerEvents: "all",
            zIndex: 1000,
          }}
          className="nodrag nopan"
        >
          {data.title ? (
            <div
              ref={draggableEdgeLabelRef as RefObject<HTMLInputElement>}
              style={{
                borderColor: `${color}`,
                borderWidth: "2px",
                borderStyle:
                  data.animation === Animation.Solid ? "solid" : "none",
                /* animation:
                  data.animation === "not implemented"
                    ? "dashdraw_edge 2s linear infinite, dashrotate 2s linear infinite" // Apply both animations
                    : "none", */
                backgroundImage:
                  data.animation === Animation.Solid
                    ? "none"
                    : (`linear-gradient(90deg, ${color} 50%, transparent 50%),
                      linear-gradient(90deg, ${color} 50%, transparent 50%),
                      linear-gradient(0deg, ${color} 50%, transparent 50%),
                      linear-gradient(0deg, ${color} 50%, transparent 50%)` as string),
                backgroundRepeat:
                  data.animation === Animation.Solid
                    ? "none"
                    : "repeat-x, repeat-x, repeat-y, repeat-y",
                backgroundSize:
                  data.animation === Animation.Solid
                    ? "none"
                    : "15px 2px, 15px 2px, 2px 15px, 2px 15px",
                backgroundPosition:
                  data.animation === Animation.Solid
                    ? "none"
                    : "left top, right bottom, left bottom, right top",
                animation:
                  data.animation === Animation.AnimatedDotted
                    ? `border-dance 1s infinite linear ${data.animationDirection}`
                    : "none",
              }}
              className={` bottom-full p-2 text-center text-sm text-black bg-white rounded-md`}
            >{`${data.title}`}</div>
          ) : null}
        </div>
      </EdgeLabelRenderer>

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
