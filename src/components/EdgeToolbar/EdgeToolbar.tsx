import React from "react";
import { Algorithm } from "../edges/EditableEdge/constants";
import { AnalyticsOutline } from "react-ionicons";
import { TbVectorSpline } from "react-icons/tb";
import { TfiVector } from "react-icons/tfi";
import { Crosshair } from "react-feather";
import { RxBorderDotted } from "react-icons/rx";
import { IoRemoveOutline } from "react-icons/io5";
import { useDiagram } from "@/hooks/useDiagram";

const colors = [
  "#CF4C2C",
  "#EA9C41",
  "#EBC347",
  "#438D57",
  "#3F8AE2",
  "#803DEC",
  "#a5a4a5",
];

export enum Animation {
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
  takeSnapshot: () => void;
  useDiagram: ReturnType<typeof useDiagram>;
};

function EdgeToolbar(props: EdgeToolbarProps) {
  const diagram = props.useDiagram;
  const editingEdgeId = diagram.editingEdgeId;
  const edge = diagram.getEdge(`${editingEdgeId}`);
  const activeShape = edge?.data?.algorithm || Algorithm.BezierCatmullRom;
  const activeColor = edge?.style?.stroke || "#a5a4a5";
  const activeAnimation = edge?.data?.animation || Animation.Solid;
  const activeAnimationDirection = edge?.data?.animationDirection || "normal";
  const activeShowMovingBall = edge?.data?.showMovingBall || false;
  const edgeTitle = edge?.data?.title || "";

  const onColorChange = (color: string) => {
    props.takeSnapshot();
    diagram.setEdges((edges) =>
      edges.map((edge) =>
        edge.id === editingEdgeId
          ? { ...edge, style: { ...edge.style, stroke: color } }
          : edge
      )
    );
  };

  const onShapeChange = (shape: Algorithm) => {
    props.takeSnapshot();
    diagram.setEdges((edges) =>
      edges.map((edge) =>
        edge.id === editingEdgeId
          ? { ...edge, data: { ...edge.data, algorithm: shape } }
          : edge
      )
    );
  };

  const setAnimatedDotted = () => {
    props.takeSnapshot();
    diagram.setEdges((edges) =>
      edges.map((edge) =>
        edge.id === editingEdgeId
          ? {
              ...edge,
              animated: true,
              style: {
                ...edge.style,
                strokeDashArray: 1000,
                strokeDashOffset: 1000,
                animation: "dashdraw 0.4s linear infinite",
              },
              data: { ...edge.data, animation: Animation.AnimatedDotted },
            }
          : edge
      )
    );
  };

  const setDotted = () => {
    props.takeSnapshot();
    diagram.setEdges((edges) =>
      edges.map((edge) =>
        edge.id === editingEdgeId
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
    props.takeSnapshot();
    diagram.setEdges((edges) =>
      edges.map((edge) =>
        edge.id === editingEdgeId
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
    props.takeSnapshot();
    diagram.setEdges((edges) =>
      edges.map((edge) =>
        edge.id === editingEdgeId
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
    props.takeSnapshot();
    diagram.setEdges((edges) =>
      edges.map((edge) =>
        edge.id === editingEdgeId
          ? { ...edge, data: { ...edge.data, showMovingBall: isMoving } }
          : edge
      )
    );
  };

  const onUpdateEdgeTitle = (title: string) => {
    props.takeSnapshot();
    diagram.setEdges((edges) =>
      edges.map((edge) =>
        edge.id === editingEdgeId
          ? { ...edge, data: { ...edge.data, title } }
          : edge
      )
    );
  };

  return (
    <div
      className={`nodrag rounded-md flex flex-col bg-transparent text-black gap-1 ${
        editingEdgeId ? "visible" : "hidden"
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
              {color === activeColor ? <Crosshair color="white" /> : ""}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onShapeChange(Algorithm.Linear)}
            className={`flex justify-center items-center ${
              Algorithm.Linear === activeShape
                ? " border-black border rounded-md"
                : "border border-transparent"
            }`}
          >
            <AnalyticsOutline color={"black"} />
          </button>
          <button
            onClick={() => onShapeChange(Algorithm.BezierCatmullRom)}
            className={`flex justify-center items-center ${
              Algorithm.BezierCatmullRom === activeShape
                ? "border-black border rounded-md"
                : "border border-transparent"
            }`}
          >
            <TbVectorSpline color={"black"} />
          </button>
          <button
            onClick={() => onShapeChange(Algorithm.CatmullRom)}
            className={`flex justify-center items-center ${
              Algorithm.CatmullRom === activeShape
                ? "border-black border rounded-md"
                : "border border-transparent"
            }`}
          >
            <TfiVector color={"black"} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 justify-center items-center">
        <button
          className={`flex justify-center items-center ${
            activeShowMovingBall === true
              ? " border-black border rounded-md"
              : "border border-transparent"
          }`}
          onClick={() => onMovingBallChange(true)}
        >
          Show Ball
        </button>
        <button
          className={`flex justify-center items-center ${
            activeAnimationDirection === AnimationDirection.Normal
              ? " border-black border rounded-md"
              : "border border-transparent"
          }`}
          onClick={() => changeAnimationDirection("normal")}
        >
          Forward
        </button>
        <button
          className={`flex justify-center items-center ${
            activeShowMovingBall === false
              ? " border-black border rounded-md"
              : "border border-transparent"
          }`}
          onClick={() => onMovingBallChange(false)}
        >
          Hide Ball
        </button>
        <button
          className={`flex justify-center items-center ${
            activeAnimationDirection === AnimationDirection.Reverse
              ? " border-black border rounded-md"
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
              ? " border-black border rounded-md"
              : "border border-transparent"
          }`}
          onClick={() => setAnimatedDotted()}
        >
          <MovingDotsIcon />
        </button>
        <button
          className={`flex justify-center items-center ${
            activeAnimation === Animation.Dotted
              ? " border-black border rounded-md"
              : "border border-transparent"
          }`}
          onClick={() => {
            setDotted();
          }}
        >
          <RxBorderDotted color="black" size={30} />
        </button>
        <button
          className={`flex justify-center items-center ${
            activeAnimation === Animation.Solid
              ? " border-black border rounded-md"
              : "border border-transparent"
          }`}
          onClick={() => setSolid()}
        >
          <IoRemoveOutline color="black" size={30} />
        </button>
      </div>
      <div className="grid grid-cols-1 justify-between">
        <input
          type="text"
          value={edgeTitle as string}
          onChange={(e) => onUpdateEdgeTitle(e.target.value)}
          placeholder="Edge Title"
          className="border border-black rounded-md p-2"
        />
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
