import { RiMenu3Fill } from "react-icons/ri";
import AboutButton from "./Downloads/AboutButton";
import ThemeToggle from "./Downloads/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./DropDownMenu/DropDownMenu";
import { IoSync } from "react-icons/io5";
import { VscJson } from "react-icons/vsc";
import DownloadImageButton from "./Downloads/DownloadImage";
import DownloadJsonButton from "./Downloads/DownloadJson";
import UploadJsonButton from "./Downloads/UploadJson";
import { useToast } from "./Toast/useToast";
import { useTheme } from "@/hooks/useTheme";
import { useDiagram } from "@/hooks/useDiagram";
import { useRef } from "react";
import DownloadGifButton from "./Downloads/DownloadGif";

interface MenuProps {
  themeHook: ReturnType<typeof useTheme>;
  diagram: ReturnType<typeof useDiagram>;
  toggleRightSidebar: () => void;
  toggleLeftSidebar: () => void;
  isRightSidebarOpen: boolean;
}
export const Menu = (props: MenuProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = e.target?.result as string;
        props.diagram.uploadJson(json);
      };
      reader.readAsText(file);
    }
  };
  return (
    <div className="gap-0 cursor-pointer flex">
      <AboutButton
        onClick={() => {
          props.toggleLeftSidebar();
        }}
      />
      <ThemeToggle
        onClick={props.themeHook.darkModeToggle}
        isDarkMode={props.themeHook.theme === "dark"}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-row gap-2 justify-center items-center p-1 pl-2 rounded-md hover:bg-slate-200 hover:dark:bg-slate-700 dark:bg-slate-800">
          Menu
          <RiMenu3Fill />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white dark:bg-black text-black dark:text-white">
          <DropdownMenuLabel className="w-full justify-start">
            <button
              onClick={() => {
                props.diagram.deselectAll();
                toast({
                  title: "Save successful!",
                  description:
                    "The latest changes to your DiagramX have been saved. You can download them as an image or Json file.",
                });
              }}
              className="w-full font-normal dark:text-white dark:hover:bg-slate-800 hover:bg-gray-200 rounded-md p-1 flex flex-row gap-1 justify-between items-center"
            >
              Save
              <IoSync />
            </button>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <DownloadImageButton useDiagram={props.diagram} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadGifButton useDiagram={props.diagram} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadJsonButton useDiagram={props.diagram} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UploadJsonButton
              onClick={() => {
                fileInputRef.current?.click();
              }}
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button
              onClick={() => props.toggleRightSidebar()}
              className="w-full dark:text-white dark:hover:bg-slate-800 hover:bg-gray-200 rounded-md p-1 flex flex-row gap-1 justify-between items-center"
            >
              {props.isRightSidebarOpen ? "Hide" : "Show"} Json
              <VscJson />
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".json"
        onInput={onFileChange}
      />
    </div>
  );
};
