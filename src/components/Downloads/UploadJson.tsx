import React, { useRef } from "react";
import { FaFileDownload } from "react-icons/fa";

export const UploadJsonButton = (props: { onClick: () => void }) => {
  return (
    <button
      className="w-full dark:text-white dark:hover:bg-slate-800 hover:bg-gray-200 rounded-md p-1 flex flex-row gap-1 justify-between items-center"
      onClick={props.onClick}
    >
      Import Json
      <FaFileDownload />
    </button>
  );
};

export default UploadJsonButton;
