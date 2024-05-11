import React from "react";
import { useToast } from "../Toast/useToast";
import { ToastAction } from "../Toast/Toast";
import { FaGithub } from "react-icons/fa";

export const AboutButton = (props: { onClick?: () => void }) => {
  const { toast } = useToast();

  return (
    <button
      className="text-black font-extrabold italic  hover:text-gray-600 rounded-md p-1 flex flex-row gap-1 justify-center items-center mr-4"
      onClick={props.onClick}
    >
      DiagramX
    </button>
  );
};

export default AboutButton;
