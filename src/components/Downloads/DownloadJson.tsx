import React from "react";
import useUndoRedo from "@/hooks/useUndoRedo";
import { FaUpload } from "react-icons/fa";

const downloadJson = (json: string) => {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.setAttribute("download", "DiagramX.json");
  a.setAttribute("href", url);
  a.click();

  // Clean up
  URL.revokeObjectURL(url);
};

export const DownloadJsonButton = (props: { useDiagram: any }) => {
  const { getSnapshotJson } = useUndoRedo();
  const onClick = () => {
    props.useDiagram.deselectAll();
    const flow = getSnapshotJson();
    //const json = JSON.stringify(flow, null, 2); // Pretty print the JSON
    downloadJson(flow);
  };

  return (
    <button
      className="text-black bg-gray-100 hover:bg-gray-200 rounded-md p-1 flex flex-row gap-1 justify-center items-center"
      onClick={onClick}
    >
      Export
      <FaUpload color="black" />
    </button>
  );
};

export default DownloadJsonButton;
