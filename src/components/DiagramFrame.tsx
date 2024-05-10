import {
  Background,
  ConnectionLineType,
  ConnectionMode,
  ControlButton,
  Controls,
  DefaultEdgeOptions,
  MiniMap,
  NodeTypes,
  ReactFlow,
  ReactFlowProvider,
  Panel,
  EdgeTypes,
  EdgeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./nodeStyles.css";
import ShapeNode from "./shape-node";
import Sidebar from "./Sidebar/Sidebar";
import MiniMapNode from "./minimap-node";
import { Leva, useControls } from "leva";
import { useDiagram } from "@/hooks/useDiagram";
import { CornerUpLeft, CornerUpRight } from "react-feather";
import useUndoRedo from "@/hooks/useUndoRedo";
import {
  PanelGroup,
  PanelResizeHandle,
  Panel as ResizablePanel,
} from "react-resizable-panels";
const JsonViewer = dynamic(() => import("./JsonViewer/JsonViewer"), {
  ssr: false,
});
import { useCallback, useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import dynamic from "next/dynamic";
import { EditableEdge } from "./edges/EditableEdge";
import EdgeToolbar from "./EdgeToolbar/EdgeToolbar";
import { ConnectionLine } from "./edges/ConnectionLine";
import savedDiagramJson from "../json-diagrams/save.json";
import DownloadImageButton from "./Downloads/DownloadImage";
import DownloadJsonButton from "./Downloads/DownloadJson";
import UploadJsonButton from "./Downloads/UploadJson";
import { FileUploader } from "react-drag-drop-files";
import { KeyCode } from "monaco-editor";
import { IoSync } from "react-icons/io5";
import { VscJson } from "react-icons/vsc";

const nodeTypes: NodeTypes = {
  shape: ShapeNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "editable-edge",
  /* markerStart: "some-arrow",
  markerEnd: "some-arrow", */
  style: { strokeWidth: 2 },
};

const Flow = () => {
  const diagram = useDiagram();
  const { getSnapshotJson, takeSnapshot } = useUndoRedo();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const controls = useControls({
    theme: { options: ["light"] },
    snapToGrid: false,
    panOnScroll: true,
    zoomOnDoubleClick: false,
  });
  const [width] = useWindowSize();

  const getDefaultSize = (w: number) => {
    if (w < 1024) {
      return 33;
    } else return 20;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const EditableEdgeWrapper = useCallback(
    (props: EdgeProps) => {
      return <EditableEdge {...props} useDiagram={diagram} />;
    },
    [diagram]
  );
  const edgeTypes: EdgeTypes = {
    "editable-edge": EditableEdgeWrapper,
  };

  return (
    <div className="w-full h-full">
      <Leva hidden />
      <PanelGroup direction="horizontal">
        <ResizablePanel minSize={30}>
          <ReactFlow
            className={controls.theme}
            onConnect={diagram.onConnect}
            onConnectStart={diagram.onConnectStart}
            //onConnectEnd={diagram.onConnectEnd}
            connectionLineComponent={ConnectionLine}
            proOptions={{ hideAttribution: true }}
            onPaneClick={diagram.onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultNodes={savedDiagramJson.nodes}
            defaultEdges={savedDiagramJson.edges}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
            connectionMode={ConnectionMode.Loose}
            panOnScroll={controls.panOnScroll}
            onDrop={diagram.onDrop}
            snapToGrid={controls.snapToGrid}
            snapGrid={[10, 10]}
            onDragOver={diagram.onDragOver}
            zoomOnDoubleClick={controls.zoomOnDoubleClick}
            onNodesChange={diagram.onNodesChange}
            onNodeDragStart={diagram.onNodeDragStart}
            onSelectionDragStart={diagram.onSelectionDragStart}
            onNodesDelete={diagram.onNodesDelete}
            onNodeClick={diagram.onNodeClick}
            onEdgesDelete={diagram.onEdgesDelete}
            onEdgeClick={diagram.onEdgeClick}
            //onEdgesChange={diagram.onEdgesChange}
            elevateEdgesOnSelect
            elevateNodesOnSelect
            maxZoom={10}
            minZoom={0.1}
            multiSelectionKeyCode={["Meta", "Control"]}
          >
            <Background color="grey" bgColor="white" />
            <Panel position="top-left">
              <Sidebar />
            </Panel>
            {diagram.editingEdgeId ? (
              <Panel position="top-center">
                <EdgeToolbar takeSnapshot={takeSnapshot} useDiagram={diagram} />
              </Panel>
            ) : null}
            <Panel className="cursor-pointer gap-1 flex" position="top-right">
              <button
                onClick={() => diagram.deselectAll()}
                className="text-black bg-gray-100 hover:bg-gray-200 rounded-md p-1 flex flex-row gap-1 justify-center items-center"
              >
                Save
                <IoSync />
              </button>
              <DownloadImageButton useDiagram={diagram} />
              <DownloadJsonButton useDiagram={diagram} />
              <UploadJsonButton useDiagram={diagram} />
              <button
                onClick={() => toggleSidebar()}
                className="text-black bg-gray-100 hover:bg-gray-200 rounded-md p-1 flex flex-row gap-1 justify-center items-center"
              >
                {isSidebarOpen ? "Hide" : "Show"} <VscJson />
              </button>
            </Panel>
            <Controls className="text-black" showInteractive={false}>
              <ControlButton onClick={() => diagram.undo()} title="Undo">
                <CornerUpLeft fillOpacity={0} />
              </ControlButton>
              <ControlButton onClick={() => diagram.redo()} title="Redo">
                <CornerUpRight fillOpacity={0} />
              </ControlButton>
            </Controls>
            <MiniMap zoomable pannable draggable nodeComponent={MiniMapNode} />
            <diagram.HelperLines
              horizontal={diagram.helperLineHorizontal}
              vertical={diagram.helperLineVertical}
            />
            <diagram.Markers />
          </ReactFlow>
        </ResizablePanel>
        <PanelResizeHandle
          className={`w-1 cursor-col-resize ${
            isSidebarOpen === true
              ? "bg-stone-600 visible"
              : "bg-transparent hidden"
          }`}
        />
        {isSidebarOpen ? (
          <ResizablePanel
            defaultSize={getDefaultSize(width)}
            minSize={getDefaultSize(width)}
          >
            <JsonViewer jsonString={getSnapshotJson()} />
          </ResizablePanel>
        ) : null}
      </PanelGroup>
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
