import React, { useRef } from "react";
import { FaUpload } from "react-icons/fa";

export const UploadJsonButton = (props: { useDiagram: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = e.target?.result as string;
        props.useDiagram.uploadJson(json);
      };
      reader.readAsText(file);
    }
  };

  const onClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".json"
        onChange={onFileChange}
      />
      <button
        className="text-black bg-yellow-200 rounded-md p-1 flex flex-row gap-1 justify-center items-center"
        onClick={onClick}
      >
        <FaUpload color="black" /> Import
      </button>
    </>
  );
};

export default UploadJsonButton;
