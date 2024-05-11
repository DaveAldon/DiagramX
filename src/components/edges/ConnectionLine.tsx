import { useEffect, useState } from "react";
import { MarkerType, type ConnectionLineComponentProps } from "@xyflow/react";

import { useAppStore } from "../store";
import { getPath } from "./EditableEdge";
import { Algorithm, DEFAULT_ALGORITHM } from "./EditableEdge/constants";

// The distance between points when free drawing
const DISTANCE = DEFAULT_ALGORITHM === Algorithm.BezierCatmullRom ? 50 : 25;

export function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  connectionStatus,
}: ConnectionLineComponentProps) {
  const { connectionLinePath, setConnectionLinePath } = useAppStore();
  const [freeDrawing, setFreeDrawing] = useState(false);

  // Check how far the cursor is from the last point in the path
  // and add a new point if it's far enough
  const prev = connectionLinePath[connectionLinePath.length - 1] ?? {
    x: fromX,
    y: fromY,
  };
  const distance = Math.hypot(prev.x - toX, prev.y - toY);
  const shouldAddPoint = freeDrawing && distance > DISTANCE;

  useEffect(() => {
    if (shouldAddPoint) {
      setConnectionLinePath([...connectionLinePath, { x: toX, y: toY }]);
    }
  }, [connectionLinePath, setConnectionLinePath, shouldAddPoint, toX, toY]);

  useEffect(() => {
    // pressing or holding the space key enables free drawing
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === " ") {
        setFreeDrawing(true);
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.key === " ") {
        setFreeDrawing(false);
      }
    }

    setConnectionLinePath([]);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      setFreeDrawing(false);
    };
  }, [setConnectionLinePath]);

  const path = getPath(
    [{ x: fromX, y: fromY }, ...connectionLinePath, { x: toX, y: toY }],
    DEFAULT_ALGORITHM,
    { fromSide: fromPosition, toSide: toPosition }
  );

  return (
    <g>
      <path
        fill="none"
        stroke={"#a5a4a5"}
        strokeWidth={2}
        className={connectionStatus === "valid" ? "" : "animated"}
        d={path}
        markerStart={MarkerType.ArrowClosed}
        markerWidth={25}
        markerEnd={MarkerType.Arrow}
      />
    </g>
  );
}
