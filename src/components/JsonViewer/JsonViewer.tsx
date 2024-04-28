import React, { useEffect, useRef, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import "./jsonViewer.css";
interface JsonViewerProps {
  jsonString: string;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ jsonString }) => {
  let prettyJsonString: string;
  const observedDiv = useRef<any>(null);
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  try {
    const jsonObj = JSON.parse(jsonString);
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

  return (
    <div ref={observedDiv} className="w-full json-viewer overflow-y-auto">
      <MonacoEditor
        width={width}
        height={height}
        language="json"
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
        }}
      />
    </div>
  );
};

export default JsonViewer;
