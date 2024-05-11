import React from "react";
import { FaSun } from "react-icons/fa";
import { IoMoon } from "react-icons/io5";

export const ThemeToggle = (props: {
  onClick?: () => void;
  isDarkMode: boolean;
}) => {
  return (
    <button
      className="w-8 hover:bg-slate-200 hover:dark:bg-slate-700 dark:bg-slate-800 font-extrabold italic rounded-md p-1 flex flex-row gap-1 justify-center items-center mr-4"
      onClick={props.onClick}
    >
      {props.isDarkMode ? <FaSun /> : <IoMoon />}
    </button>
  );
};

export default ThemeToggle;
