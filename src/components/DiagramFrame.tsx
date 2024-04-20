import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDiagram } from "./useDiagram";

const Flow = () => {
  const diagram = useDiagram();

  return (
    <div className="w-full h-full">
      <button onClick={() => diagram.undo()}>undo</button>
      <button onClick={() => diagram.redo()}>redo</button>
      <ReactFlow
        nodes={diagram.draggingElements}
        edges={diagram.elements.edges}
        onNodesChange={diagram.onNodesChange}
        onEdgeUpdate={diagram.onEdgeUpdate}
        onEdgesChange={diagram.onEdgesChange}
        onNodeDragStop={diagram.onNodeDragStop}
        onConnect={diagram.onConnect}
        onConnectEnd={diagram.onConnectEnd}
        onConnectStart={diagram.onConnectStart}
        onInit={diagram.setRfInstance}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Panel position="top-right">
          <div className="flex flex-col gap-4">
            <button onClick={diagram.onSave}>save</button>
            <button onClick={diagram.onRestore}>restore</button>
            <button onClick={diagram.onAdd}>add node</button>
            <button onClick={diagram.viewSave}>View</button>
          </div>
        </Panel>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

const DiagramFrame = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
};

export default DiagramFrame;
