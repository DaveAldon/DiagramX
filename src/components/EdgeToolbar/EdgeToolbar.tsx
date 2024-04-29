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

enum Animation {
  AnimatedDotted = "animatedDotted",
  Dotted = "dotted",
  Solid = "solid",
}
enum AnimationDirection {
  Normal = "normal",
  Reverse = "reverse",
}

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
  const activeShape = edge?.data?.algorithm || Algorithm.BezierCatmullRom;
  const activeColor = edge?.style?.stroke || "#FFFFFF80";
  const activeAnimation = edge?.data?.animation || Animation.Solid;
  const activeAnimationDirection = edge?.data?.animationDirection || "normal";
  const activeShowMovingBall = edge?.data?.showMovingBall || false;

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

  const setAnimatedDotted = () => {
    takeSnapshot();
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === props.editingEdge
          ? {
              ...edge,
              animated: true,
              style: {
                ...edge.style,
                animation: `dashdraw 0.4s linear infinite`,
              },
              data: { ...edge.data, animation: Animation.AnimatedDotted },
            }
          : edge
      )
    );
  };

  const setDotted = () => {
    takeSnapshot();
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === props.editingEdge
          ? {
              ...edge,
              animated: true,
              style: {
                ...edge.style,
                animation: `dashdraw 0s linear infinite`,
              },
              data: { ...edge.data, animation: Animation.Dotted },
            }
          : edge
      )
    );
  };

  const setSolid = () => {
    takeSnapshot();
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === props.editingEdge
          ? {
              ...edge,
              animated: false,
              style: {
                ...edge.style,
              },
              data: { ...edge.data, animation: Animation.Solid },
            }
          : edge
      )
    );
  };

  const changeAnimationDirection = (direction: "normal" | "reverse") => {
    takeSnapshot();
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === props.editingEdge
          ? {
              ...edge,
              style: { ...edge.style, animationDirection: direction },
              data: { ...edge.data, animationDirection: direction },
            }
          : edge
      )
    );
  };

  const onMovingBallChange = (isMoving: boolean) => {
    takeSnapshot();
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === props.editingEdge
          ? { ...edge, data: { ...edge.data, showMovingBall: isMoving } }
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
      <div className="flex flex-row gap-4">
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
        <div className="grid grid-cols-3 gap-2">
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
      </div>

      <div className="grid grid-cols-2 justify-center items-center">
        <button
          className={`flex justify-center items-center ${
            activeShowMovingBall === true
              ? " border-white border rounded-md"
              : "border border-transparent"
          }`}
          onClick={() => onMovingBallChange(true)}
        >
          Show Ball
        </button>
        <button
          className={`flex justify-center items-center ${
            activeAnimationDirection === AnimationDirection.Normal
              ? " border-white border rounded-md"
              : "border border-transparent"
          }`}
          onClick={() => changeAnimationDirection("normal")}
        >
          Forward
        </button>
        <button
          className={`flex justify-center items-center ${
            activeShowMovingBall === false
              ? " border-white border rounded-md"
              : "border border-transparent"
          }`}
          onClick={() => onMovingBallChange(false)}
        >
          Hide Ball
        </button>
        <button
          className={`flex justify-center items-center ${
            activeAnimationDirection === AnimationDirection.Reverse
              ? " border-white border rounded-md"
              : "border border-transparent"
          }`}
          onClick={() => changeAnimationDirection("reverse")}
        >
          Reverse
        </button>
      </div>
      <div className="grid grid-cols-3 justify-between">
        <button
          className={`flex justify-center items-center ${
            activeAnimation === Animation.AnimatedDotted
              ? " border-white border rounded-md"
              : "border border-transparent"
          }`}
          onClick={() => setAnimatedDotted()}
        >
          <MovingDotsIcon />
        </button>
        <button
          className={`flex justify-center items-center ${
            activeAnimation === Animation.Dotted
              ? " border-white border rounded-md"
              : "border border-transparent"
          }`}
          onClick={() => {
            setDotted();
          }}
        >
          <RxBorderDotted color="white" size={30} />
        </button>
        <button
          className={`flex justify-center items-center ${
            activeAnimation === Animation.Solid
              ? " border-white border rounded-md"
              : "border border-transparent"
          }`}
          onClick={() => setSolid()}
        >
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
