import React from "react";
import { useReactFlow } from "@xyflow/react";
import useUndoRedo from "@/hooks/useUndoRedo";
import { Algorithm } from "../edges/EditableEdge/constants";

const colors = [
  "#CF4C2C",
  "#EA9C41",
  "#EBC347",
  "#438D57",
  "#3F8AE2",
  "#803DEC",
];

const edgeVariants = [
  {
    algorithm: Algorithm.BezierCatmullRom,
    label: "Bezier-Catmull-Rom",
  },
  {
    algorithm: Algorithm.CatmullRom,
    label: "Catmull-Rom",
  },
  {
    algorithm: Algorithm.Linear,
    label: "Linear",
  },
];

type EdgeToolbarProps = {
  editingEdge: string | null;
};

function EdgeToolbar(props: EdgeToolbarProps) {
  const { setEdges, getEdge } = useReactFlow();
  const { takeSnapshot } = useUndoRedo();
  const edge = getEdge(`${props.editingEdge}`);
  const activeShape = edge?.data?.algorithm;
  const activeColor = edge?.data?.color;
  const isAnimated = edge?.animated;

  const onColorChange = (color: string) => {
    takeSnapshot();
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === props.editingEdge
          ? { ...edge, style: { ...edge.style, stroke: color } }
          : edge
      )
    );
  };

  const onShapeChange = (shape: Algorithm) => {
    takeSnapshot();
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === props.editingEdge
          ? { ...edge, data: { ...edge.data, algorithm: shape } }
          : edge
      )
    );
  };

  const onAnimatedChange = (animated: boolean) => {
    takeSnapshot();
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === props.editingEdge
          ? {
              ...edge,
              animated: true,
              style: {
                ...edge.style,
                animation: `circledraw 0${
                  animated ? ".4" : ""
                }s linear infinite`,
              },
            }
          : edge
      )
    );
  };

  const onSolidDashChange = (solid: boolean) => {
    takeSnapshot();
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === props.editingEdge
          ? {
              ...edge,
              animated: solid ? false : true,
              style: {
                ...edge.style,
                animation: solid
                  ? ""
                  : `dashdraw 0${isAnimated ? ".2" : ""}s linear infinite`,
              },
            }
          : edge
      )
    );
  };

  const onStyleChange = (style: string) => {
    takeSnapshot();
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === props.editingEdge
          ? { ...edge, style: { ...edge.style, stroke: style } }
          : edge
      )
    );
  };

  return (
    <div
      className={`nodrag rounded-md flex flex-col bg-slate-800 ${
        props.editingEdge ? "visible" : "hidden"
      }`}
    >
      <div className="flex flex-row gap-0.5">
        {colors.map((color) => (
          <button
            key={color}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            className={`color-swatch ${color === activeColor ? "active" : ""}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3">
        {edgeVariants.map((shape, index) => (
          <button
            key={index}
            onClick={() => onShapeChange(shape.algorithm)}
            className={`${shape === activeShape ? "active" : ""}`}
          >
            {shape.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1">
        <button onClick={() => onAnimatedChange(true)}>Animated</button>
        <button onClick={() => onAnimatedChange(false)}>Not Animated</button>
      </div>
      <div className="grid grid-cols-3">
        <button onClick={() => onSolidDashChange(false)}>Dotted</button>
        <button onClick={() => onSolidDashChange(true)}>Solid</button>
      </div>
    </div>
  );
}

export default EdgeToolbar;
