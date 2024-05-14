import React from "react";
import { IoMdPhotos } from "react-icons/io";
import { toSvg } from "html-to-image";
import {
  getNodesBounds,
  getViewportForBounds,
  useReactFlow,
} from "@xyflow/react";

const imageWidth = 1024;
const imageHeight = 768;

export const DownloadGifButton = (props: { useDiagram: any }) => {
  const { getNodes } = useReactFlow();

  const onClick = () => {
    props.useDiagram.deselectAll();
    try {
      const nodesBounds = getNodesBounds(getNodes());
      const transform = getViewportForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5,
        2,
        0.2
      );

      toSvg(document.querySelector(".react-flow__viewport") as HTMLElement, {
        backgroundColor: "white",
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}`,
          height: `${imageHeight}`,
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
        },
      }).then((canvas) => {
        const encodedSvg = canvas.replace(
          /^data:image\/svg\+xml;charset=utf-8,/,
          ""
        );
        const svgString = decodeURIComponent(encodedSvg);
        const blob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "DiagramX.svg";
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      className="w-full dark:text-white dark:hover:bg-slate-800 hover:bg-gray-200 rounded-md p-1 flex flex-row gap-1 justify-between items-center"
      onClick={onClick}
    >
      Download SVG (With animations)
      <IoMdPhotos />
    </button>
  );
};

export default DownloadGifButton;
