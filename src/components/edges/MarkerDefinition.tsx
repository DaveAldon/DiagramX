import React, { ReactNode } from "react";

interface MarkerProps {
  id: string;
  className?: string;
  children: ReactNode;
  strokeColor?: string;
  fillColor?: string;
}

const Marker = (props: MarkerProps) => {
  return (
    <marker
      className={props.className || "react-flow__arrowhead"}
      id={props.id}
      markerWidth="15"
      markerHeight="15"
      viewBox="-10 -10 20 20"
      orient="auto"
      markerUnits="userSpaceOnUse"
      refX="0"
      refY="0"
    >
      <circle
        cx="0"
        cy="0"
        r="5"
        stroke={props.strokeColor}
        fill={props.fillColor}
      />
    </marker>
  );
};

interface MarkerDefinitionsProps {
  id: string;
  color: string;
}

export function MarkerDefinition({ color, id }: MarkerDefinitionsProps) {
  return (
    <svg>
      <defs>
        <Marker id={id} strokeColor={color} fillColor="white">
          <polyline
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            fill={color}
            points="-12,-6 0,0 -12,6 -12,-6"
          />
        </Marker>
      </defs>
    </svg>
  );
}
