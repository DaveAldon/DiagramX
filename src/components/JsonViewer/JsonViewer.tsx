import React from "react";
import "./jsonViewer.css";

interface JsonViewerProps {
  jsonString: string;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ jsonString }) => {
  let prettyJsonString: string;

  try {
    const jsonObj = JSON.parse(jsonString);
    prettyJsonString = JSON.stringify(jsonObj, null, 2);
  } catch (error) {
    prettyJsonString = "Invalid JSON string";
  }

  return (
    <div className="json-viewer h-full overflow-y-auto">
      <pre>
        <code>{prettyJsonString}</code>
      </pre>
    </div>
  );
};

export default JsonViewer;
