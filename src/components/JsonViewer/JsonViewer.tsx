import React, { useEffect, useRef, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import "./jsonViewer.css";
import { IoMdClose } from "react-icons/io";

interface JsonViewerProps {
  jsonString: string;
  toggleRightSidebar: () => void;
}

const JsonViewer: React.FC<JsonViewerProps> = (props: JsonViewerProps) => {
  let prettyJsonString: string;
  const observedDiv = useRef<any>(null);
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [syntaxHighlighting, setSyntaxHighlighting] = useState<boolean>(false);

  try {
    const jsonObj = JSON.parse(props.jsonString);
    prettyJsonString = JSON.stringify(jsonObj, null, 2);
  } catch (error) {
    prettyJsonString = "Invalid JSON string";
  }

  useEffect(
    () => {
      if (!observedDiv.current) {
        // we do not initialize the observer unless the ref has
        // been assigned
        return;
      }

      // we also instantiate the resizeObserver and we pass
      // the event handler to the constructor
      const resizeObserver = new ResizeObserver(() => {
        if (observedDiv.current && observedDiv.current.offsetWidth !== width) {
          setWidth(observedDiv.current.offsetWidth);
        }
        if (
          observedDiv.current &&
          observedDiv.current.offsetHeight !== height
        ) {
          setHeight(observedDiv.current.offsetHeight);
        }
      });

      // the code in useEffect will be executed when the component
      // has mounted, so we are certain observedDiv.current will contain
      // the div we want to observe
      resizeObserver.observe(observedDiv.current);

      // if useEffect returns a function, it is called right before the
      // component unmounts, so it is the right place to stop observing
      // the div
      return function cleanup() {
        resizeObserver.disconnect();
      };
    },
    // only update the effect if the ref element changed
    [observedDiv.current]
  );

  const copyAll = async () => {
    await navigator.clipboard.writeText(prettyJsonString);
    alert("Copied to clipboard");
  };

  return (
    <div
      ref={observedDiv}
      className="w-full json-viewer overflow-y-auto bg-[#1e1e1e]"
    >
      <div className="flex flex-row h-16 justify-between items-center p-4">
        <button
          className="text-white p-2 m-2 bg-slate-800 rounded-md"
          onClick={copyAll}
        >
          Copy
        </button>
        <button
          className="text-white p-2 m-2 bg-slate-800 rounded-md"
          onClick={() => setSyntaxHighlighting(!syntaxHighlighting)}
        >
          Syntax
        </button>
        <div
          onClick={props.toggleRightSidebar}
          className="flex text-white hover:text-black cursor-pointer h-8 flex-row gap-3 justify-center items-center border-[1px] border-white hover:bg-gray-100 p-2 rounded-md"
        >
          <IoMdClose />
        </div>
      </div>
      <MonacoEditor
        width={width}
        height={height}
        language={syntaxHighlighting ? "json" : ""}
        theme="vs-dark"
        value={prettyJsonString}
        options={{
          readOnly: true,
          lineNumbers: "on",
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 0,
          minimap: {
            enabled: true,
          },
          stopRenderingLineAfter: 1000,
          mouseWheelZoom: true,
        }}
      />
    </div>
  );
};

export default JsonViewer;
