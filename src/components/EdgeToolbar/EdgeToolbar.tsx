import React, { useState } from "react";
import { ShapeComponents, ShapeType } from "../shape/types";
import SidebarItem from "../Sidebar/SidebarItem";
import { NodeToolbar, useReactFlow } from "@xyflow/react";

const colors = [
  "#CF4C2C",
  "#EA9C41",
  "#EBC347",
  "#438D57",
  "#3F8AE2",
  "#803DEC",
];

type EdgeToolbarProps = {
  editingEdge: string | null;
};

function EdgeToolbar({ editingEdge }: EdgeToolbarProps) {
  const { setEdges, getEdge } = useReactFlow();

  const onColorChange = (color: string) => {
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === editingEdge ? { ...edge, data: { color } } : edge
      )
    );
    console.log("color changed", color, editingEdge);
  };

  const activeColor = editingEdge ? getEdge(editingEdge)?.data?.color : null;

  return (
    <div
      className={`nodrag rounded-md flex flex-col bg-slate-800 ${
        editingEdge ? "visible" : "hidden"
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
      {/* <div className="grid grid-cols-5">
        {ShapeComponents &&
          Object.keys(ShapeComponents).map((shape) => (
            <button
              key={shape}
              onClick={() => onShapeChange(shape as ShapeType)}
              className={`${shape === activeShape ? "active" : ""}`}
            >
              <SidebarItem type={shape as ShapeType} key={shape} />
            </button>
          ))}
      </div> */}
    </div>
  );
}

export default EdgeToolbar;
