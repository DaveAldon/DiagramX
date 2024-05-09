import React from "react";
import {
  Panel,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { toPng } from "html-to-image";

const downloadImage = (dataUrl: string) => {
  const a = document.createElement("a");

  a.setAttribute("download", "reactflow.png");
  a.setAttribute("href", dataUrl);
  a.click();
};

const imageWidth = 1024;
const imageHeight = 768;

export const DownloadButton = () => {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getNodesBounds(getNodes());
    const transform = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      0.2
    );

    toPng(document.querySelector(".react-flow__viewport") as HTMLElement, {
      backgroundColor: "white",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}`,
        height: `${imageHeight}`,
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
      },
    }).then(downloadImage);
  };

  return (
    <button className="text-black bg-blue-200 rounded-md p-1" onClick={onClick}>
      Download Image
    </button>
  );
};

export default DownloadButton;
