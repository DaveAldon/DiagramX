import { type XYPosition, Position } from "@xyflow/react";
import type { ControlPointData } from "../ControlPoint";

import { getLinearPath, getLinearControlPoints } from "./linear";
import { getCatmullRomPath, getCatmullRomControlPoints } from "./catmull-rom";
import { getStraightPath, getStraightControlPoints } from "./straight";

import { Algorithm } from "../constants";

export function getControlPoints(
  points: (ControlPointData | XYPosition)[],
  algorithm: Algorithm = Algorithm.BezierCatmullRom,
  sides = { fromSide: Position.Left, toSide: Position.Right }
) {
  switch (algorithm) {
    case Algorithm.Linear:
      return getLinearControlPoints(points);

    case Algorithm.CatmullRom:
      return getCatmullRomControlPoints(points);

    case Algorithm.BezierCatmullRom:
      return getCatmullRomControlPoints(points, true, sides);

    case Algorithm.Straight:
      return getStraightControlPoints(points);
  }
}

export function getPath(
  points: XYPosition[],
  algorithm: Algorithm = Algorithm.BezierCatmullRom,
  sides = { fromSide: Position.Left, toSide: Position.Right }
) {
  switch (algorithm) {
    case Algorithm.Linear:
      return getLinearPath(points);

    case Algorithm.CatmullRom:
      return getCatmullRomPath(points);

    case Algorithm.BezierCatmullRom:
      return getCatmullRomPath(points, true, sides);

    case Algorithm.Straight:
      return getStraightPath(points);
  }
}
