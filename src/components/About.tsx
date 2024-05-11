import { FaGithub } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

export const About = (props: { onClick: () => void }) => {
  return (
    <div className="bg-white dark:bg-black p-4 flex flex-col gap-4 w-full">
      <div className="flex flex-row justify-between">
        <div className="italic font-semibold text-2xl">About DiagramX</div>
        <div
          onClick={props.onClick}
          className="flex cursor-pointer flex-row gap-3 justify-center items-center border-[1px] border-black hover:bg-gray-100 p-2 rounded-md"
        >
          <IoMdClose />
        </div>
      </div>
      <div className="text-sm">
        DiagramX was created by Dave Aldon to be a beautiful diagram maker that
        helps you just get to the point. The Json export also makes it source
        control friendly!
      </div>
      <a
        className="flex flex-row gap-3 justify-center items-center border-[1px] border-black hover:bg-gray-100 p-1 rounded-md"
        href="https://github.com/davealdon"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub />
        <div>Dave Aldon</div>
      </a>
      <div className="text-xs fixed bottom-4">
        DiagramX Copyright &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};
