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
import { NodeType } from "./Nodes";
import "./nodeStyles.css";
import { useDiagramPopup } from "./useDiagramPopup";

const Flow = () => {
  const diagram = useDiagram();
  const diagramPopup = useDiagramPopup(diagram);

  return (
    <div className="w-full h-full">
      <button onClick={() => diagram.undo()}>undo</button>
      <button onClick={() => diagram.redo()}>redo</button>
      <div
        ref={diagramPopup.modalRef}
        className={`absolute bg-slate-900 text-white h-16 w-64 rounded-md p-2 flex flex-row gap-2 z-50 ${
          diagram.showModal ? "block" : "hidden"
        }`}
        style={{
          top: `${diagram.modalPosition.y}px`,
          left: `${diagram.modalPosition.x}px`,
        }}
      >
        <button onClick={() => diagram.onNodeTypeSelect(NodeType.Circle)}>
          Circle
        </button>
        <button onClick={() => diagram.onNodeTypeSelect(NodeType.Triangle)}>
          Triangle
        </button>
        <button onClick={() => diagram.onNodeTypeSelect(NodeType.Rectangle)}>
          Rectangle
        </button>
      </div>
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
        nodeTypes={diagram.nodeTypes}
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
