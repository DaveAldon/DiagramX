export enum Algorithm {
  Linear = "linear",
  CatmullRom = "catmull-rom",
  BezierCatmullRom = "bezier-catmull-rom",
  Straight = "straight",
}

export const COLORS = {
  [Algorithm.Linear]: "#0375ff",
  [Algorithm.BezierCatmullRom]: "#68D391",
  [Algorithm.CatmullRom]: "#FF0072",
  [Algorithm.Straight]: "#FFA400",
};

export const DEFAULT_ALGORITHM = Algorithm.BezierCatmullRom;
