import React from "react";

export const AboutButton = (props: { onClick?: () => void }) => {
  return (
    <button
      className="font-extrabold italic hover:text-gray-600 rounded-md p-1 flex flex-row gap-1 justify-center items-center mr-4"
      onClick={props.onClick}
    >
      DiagramX
    </button>
  );
};

export default AboutButton;
