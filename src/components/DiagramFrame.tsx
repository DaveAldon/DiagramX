import {
  Background,
  ConnectionMode,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDiagram } from "./useDiagram";
import { NodeType, CustomNode, nodeTypes } from "./Nodes";
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
        className={`absolute bg-slate-900 justify-between items-center text-white h-16 w-32 rounded-md p-2 flex flex-row z-50 ${
          diagram.showModal ? "block" : "hidden"
        }`}
        style={{
          top: `${diagram.modalPosition.y}px`,
          left: `${diagram.modalPosition.x}px`,
        }}
      >
        <button onClick={() => diagram.onNodeTypeSelect(NodeType.Circle)}>
          <CustomNode nodeType={NodeType.Circle} hide className="h-8 w-8" />
        </button>
        <button onClick={() => diagram.onNodeTypeSelect(NodeType.Rectangle)}>
          <CustomNode nodeType={NodeType.Rectangle} hide className="h-8 w-8" />
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
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
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
