import { Position, XYPosition } from "@xyflow/react";
import { ControlPointData } from "../ControlPoint";
import { isControlPoint } from "./utils";

export function getStraightPath(
  points: Readonly<XYPosition[]>,
  turnDistance: number = 50
) {
  if (points.length < 2) return "";

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const midX = (p1.x + p2.x) / 2;

    path += ` L ${midX} ${p1.y} L ${midX} ${p2.y}`;
  }

  path += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;

  return path;
}

export function getStraightControlPoints(
  points: (ControlPointData | XYPosition)[],
  turnDistance: number = 50
) {
  const controlPoints = [] as ControlPointData[];
  return controlPoints;
  /*
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const turnX = p1.x < p2.x ? p2.x - turnDistance : p2.x + turnDistance;

    if (isControlPoint(p1)) {
      controlPoints.push(p1);
    }

    controlPoints.push({
      prev: "id" in p1 ? p1.id : undefined,
      id: `spline-${window.crypto.randomUUID()}`,
      active: false,
      x: turnX,
      y: p1.y,
    });

    controlPoints.push({
      prev: "id" in p2 ? p2.id : undefined,
      id: `spline-${window.crypto.randomUUID()}`,
      active: false,
      x: turnX,
      y: p2.y,
    });
  }

  return controlPoints;
  */
}
