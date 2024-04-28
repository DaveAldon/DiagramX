import type { ControlPointData } from "../ControlPoint";
import { Position, type XYPosition } from "@xyflow/react";

import { isControlPoint } from "./utils";
import { getControlWithCurvature } from "./bezier";

export function getCatmullRomPath(
  points: XYPosition[],
  bezier = false,
  sides = { fromSide: Position.Left, toSide: Position.Right }
) {
  if (points.length < 2) return "";

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const p0 =
      points[i - 1] ??
      (bezier ? calculateBezierP0(p1, p2, sides.fromSide) : p1);

    const p3 =
      points[i + 2] ?? (bezier ? calculateBezierP3(p1, p2, sides.toSide) : p2);

    const b1 = {
      x: (-p0.x + 6 * p1.x + p2.x) / 6,
      y: (-p0.y + 6 * p1.y + p2.y) / 6,
    };

    const b2 = {
      x: (p1.x + 6 * p2.x - p3.x) / 6,
      y: (p1.y + 6 * p2.y - p3.y) / 6,
    };

    path += ` C ${b1.x} ${b1.y}, ${b2.x} ${b2.y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

export function getCatmullRomControlPoints(
  points: (ControlPointData | XYPosition)[],
  bezier = false,
  sides = { fromSide: Position.Left, toSide: Position.Right }
) {
  const controlPoints: ControlPointData[] = [];

  // The `actualPoints.length - 2` is intentional and significant! The final point
  // in the array is just the `XYPosition` of the target handle: we don't want to
  // include it in the control points array, but we still need to know it's there
  // to calculate the final control point.
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const p0 =
      points[i - 1] ??
      (bezier ? calculateBezierP0(p1, p2, sides.fromSide) : p1);

    const p3 =
      points[i + 2] ?? (bezier ? calculateBezierP3(p1, p2, sides.toSide) : p2);

    // The first and last points are the source and target handles, and we don't
    // want to include them as control points.
    if (isControlPoint(p1)) {
      controlPoints.push(p1);
    }

    controlPoints.push({
      id: "",
      active: false,
      x: q(p0.x, p1.x, p2.x, p3.x),
      y: q(p0.y, p1.y, p2.y, p3.y),
    });
  }

  return controlPoints;
}

// UTILS -----------------------------------------------------------------------

function calculateBezierP0(p1: XYPosition, p2: XYPosition, side: Position) {
  const c1 = getControlWithCurvature(side, p1.x, p1.y, p2.x, p2.y, 0.25);
  return { x: p2.x + 6 * (p1.x - c1[0]), y: p2.y + 6 * (p1.y - c1[1]) };
}

function calculateBezierP3(p1: XYPosition, p2: XYPosition, side: Position) {
  const c2 = getControlWithCurvature(side, p2.x, p2.y, p1.x, p1.y, 0.25);
  return { x: p1.x + 6 * (p2.x - c2[0]), y: p1.y + 6 * (p2.y - c2[1]) };
}

function q(p0: number, p1: number, p2: number, p3: number, t = 0.5) {
  const alpha = 0.5;
  const t2 = t ** 2;
  const t3 = t ** 3;

  return (
    alpha *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}
