import React from "react";
import { useReactFlow } from "@xyflow/react";
import useUndoRedo from "@/hooks/useUndoRedo";
import { Algorithm } from "../edges/EditableEdge/constants";
import { AnalyticsOutline } from "react-ionicons";
import { SiMaterialdesign, SiMaterialdesignicons } from "react-icons/si";
import { CgCommunity } from "react-icons/cg";
import { SlVector } from "react-icons/sl";
import { TbVectorSpline } from "react-icons/tb";
import { TfiVector } from "react-icons/tfi";
import { Crosshair } from "react-feather";
import { RxBorderDotted } from "react-icons/rx";
import { IoRemoveOutline } from "react-icons/io5";

const colors = [
  "#CF4C2C",
  "#EA9C41",
  "#EBC347",
  "#438D57",
  "#3F8AE2",
  "#803DEC",
  "#FFFFFF80",
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
  const activeColor = edge?.style?.stroke;
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
      className={`nodrag rounded-md flex flex-col bg-slate-800 gap-1 ${
        props.editingEdge ? "visible" : "hidden"
      }`}
    >
      <div className="flex flex-row gap-0.5">
        {colors.map((color) => (
          <button
            key={color}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            className={`color-swatch flex justify-center items-center ${
              color === activeColor ? "border" : ""
            }`}
          >
            {color === activeColor ? <Crosshair /> : ""}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3">
        <button
          onClick={() => onShapeChange(Algorithm.Linear)}
          className={`flex justify-center items-center ${
            Algorithm.Linear === activeShape
              ? " border-white border rounded-md"
              : "border border-transparent"
          }`}
        >
          <AnalyticsOutline color={"white"} />
        </button>
        <button
          onClick={() => onShapeChange(Algorithm.BezierCatmullRom)}
          className={`flex justify-center items-center ${
            Algorithm.BezierCatmullRom === activeShape
              ? "border-white border rounded-md"
              : "border border-transparent"
          }`}
        >
          <TbVectorSpline color={"white"} />
        </button>
        <button
          onClick={() => onShapeChange(Algorithm.CatmullRom)}
          className={`flex justify-center items-center ${
            Algorithm.CatmullRom === activeShape
              ? "border-white border rounded-md"
              : "border border-transparent"
          }`}
        >
          <TfiVector color={"white"} />
        </button>
      </div>
      <div className="grid grid-cols-1">
        <button onClick={() => onAnimatedChange(true)}>
          <MovingDotsIcon />
        </button>
        <button onClick={() => onAnimatedChange(false)}>Not Animated</button>
      </div>
      <div className="grid grid-cols-3">
        <button onClick={() => onSolidDashChange(false)}>
          <RxBorderDotted color="white" size={30} />
        </button>
        <button onClick={() => onSolidDashChange(true)}>
          <IoRemoveOutline color="white" size={30} />
        </button>
      </div>
    </div>
  );
}

function MovingDotsIcon() {
  return (
    <svg
      width="30"
      height="10"
      viewBox="0 0 80 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5" cy="5" r="5" fill="currentColor">
        <animate
          attributeName="cx"
          values="5;45;5"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="5" cy="5" r="5" fill="currentColor">
        <animate
          attributeName="cx"
          values="5;45;5"
          dur="2s"
          begin="0.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="5" cy="5" r="5" fill="currentColor">
        <animate
          attributeName="cx"
          values="5;45;5"
          dur="2s"
          begin="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

export default EdgeToolbar;
